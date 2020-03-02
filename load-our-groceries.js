var OurGroceriesClient = require('our-groceries-client');
// or import OurGroceriesClient from 'our-groceries-client' 
const fs = require('fs') 
const config = require('./config.json')

var username = config.our_groceries.username
  , password = config.our_groceries.password
  , ourLists = config.our_groceries.lists;

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
//            console.log(list);

            var items = [];
            list.items.forEach(function(item, index) {
                if (!item.crossedOff) {
                    items.push(item);
                }
            })
            console.log("-------ITEMS of "+listName+"-----------")
            console.log(items)

            // Write data in 'Output.txt' . 
            fs.writeFile('public/cal/'+filename+'.json', JSON.stringify(items), (err) => { 
                
                // In case of a error throw err. 
                if (err) throw err; 
            }) 


            //client.addToList(list.id, itemName, quantity, handlers.addToListComplete);
        }},
        // Called after adding the item completes
        addToListComplete: function(result) {
            if (result.success) {
                console.log("Successfully added to list.");
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
