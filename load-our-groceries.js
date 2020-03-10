//var OurGroceriesClient = require('our-groceries-client');

var OurGroceriesClient = require('/home/thomas/git/our-groceries-client/src/our-groceries-client.js');

// or import OurGroceriesClient from 'our-groceries-client' 
const fs = require('fs') 
const config = require('./config.json')

var username = config.our_groceries.username
  , password = config.our_groceries.password
  , ourLists = config.our_groceries.lists
  , listWithTimers = config.our_groceries.listWithTimers;

var oldTimers = {};
if (listWithTimers) {
    try {
        oldTimersList = require('./public/cal/'+(listWithTimers.toLowerCase())+'.json')
        console.log("Using existing timers from list " + listWithTimers);
        oldTimersList.forEach(function(item, index) {
            oldTimers[item.id] = item;
        })
    }
    catch (e) {
        console.log('No existing timers file found')
        console.log(e)
    }

}

const today = new Date();
var todayString = today.toISOString().substr(0,10);

var client = new OurGroceriesClient();

function getList(listName) {
    var handlers = {   
        // Called when authentication completes, either success or failure 
        authComplete: function(result) {
            if (result.success) {
                client.getLists(handlers.getListsComplete);
            } else {
                console.log("Authentication Failed: "+result.error);
            }
        },
        // Called when fetching the list of lists completes, either success or failure 
        getListsComplete: function(result) {
            if (result.success) {
                var list = client.findList(result.response.shoppingLists, "* " + listName);
                if (list) {
                    client.getList(list.id, handlers.getListComplete(listName.toLowerCase()));                
                } else {
                    console.log("Unable to find list: "+listName);
                }
            } else {
                console.log("Unable to get lists: "+result.error);
            }
        },
        // Called when fetching a single list completes, either success or failure 
        getListComplete: function(filename) {
            return function(result) {
            var list = result.response.list;

            var items = [];
            list.items.forEach(function(item, index) {

                // There can be one special list (name: config.listWithTimers)
                // and if there are items in that list, 
                // then they will be automatically crossed off, and the date when the item was crossed off will be saved in the hash
                if (listWithTimers && (listWithTimers == listName)) {
                    if (item.crossedOff) {
                        item["date"] = (oldTimers[item.id] && ("date" in oldTimers[item.id])) ? oldTimers[item.id].date : todayString;
                    } else {
                        client.crossOff(item.id, list.id, handlers.crossOffComplete);
                        item["date"] = todayString;    
                    }
                    items.push(item);

                // All other lists behave normally and only have the non-crossedOff items
                } else {
                    if (!item.crossedOff) {
                        items.push(item);
                    }
                }
            })
            console.log("-------ITEMS of "+listName+"-----------")
            console.log(items)

            fs.writeFile('public/cal/'+filename+'.json', JSON.stringify(items), (err) => {                
                if (err) throw err;
            })
        }},

        crossOffComplete: function(result) {
            if (result.success) {
                console.log("Successfully crossed off.");
            } else {
                console.log("Unable to add to list: "+result.error);
            }
        }
    }
    return function(result) {
        handlers.authComplete(result)
    }
}

// Authenticate
console.log(ourLists)
ourLists.forEach(list => {
    console.log("fetching list", list)
    client.authenticate(username, password, getList(list));
})
