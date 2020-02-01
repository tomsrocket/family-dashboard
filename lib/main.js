
class BigClockDisplay {
  static start() {
    var seconds = 20*60;
    var loader = document.getElementById('loader')
    , α = 0
    , π = Math.PI
    , t = (seconds/360 * 1000);
    var secondDiv = document.getElementById('seconds');

    (function draw() {
        α++;
        α %= 360;
        var r = ( α * π / 180 )
            , x = Math.sin( r ) * 125
            , y = Math.cos( r ) * - 125
            , mid = ( α > 180 ) ? 1 : 0
            , anim = 'M 0 0 v -125 A 125 125 1 ' 
                + mid + ' 1 ' 
                +  x  + ' ' 
                +  y  + ' z';

            
        secondDiv.innerHTML= "Rest: " + (360 - α);

        loader.setAttribute( 'd', anim );
        
        setTimeout(draw, t); // Redraw

    })();
  }
}

class CurrentTimeDisplay {
    static start() {
        var clock = document.getElementById('clock');
        (function currentTime() {
    
            var currentdate = new Date();
            var datetime =  ("0" +currentdate.getHours()).slice(-2) + ":" + ("0" +currentdate.getMinutes()).slice(-2)
             + ":" + ("0" +currentdate.getSeconds()).slice(-2) ;
            clock.innerHTML= datetime;
            setTimeout(currentTime, 2000); // Redraw
    
        })();
    }
}

class TaskListDisplay {
    static start() {

        function resetWeather() {
            $("#weather").html('<img src="https://www.dwd.de/DWD/wetter/radar/radfilm_nrw_akt.gif" />');
        }
        
        var taskList = [
            ["Anziehen",      "icon-shirt.svg",     "chicken.gif"],
            ["Haare kämmen",  "icon-comb.svg",      "monkey.gif"],
            ["Zähne putzen",  "icon-toothbrush.svg","fox.gif"],
            ["Jacke",         "icon-jacket.svg",    "snoopy.gif"],
            ["Schuhe",        "icon-shoes.svg",     "cat.gif"],
            ["Hand- schuhe",  "icon-gloves.svg",    "panda.gif"],
            ["Mütze",         "icon-snowhat.svg"],
            ["Helm",          "icon-helmet.svg",    "jumpy.gif"],
            ["Rucksack",      "icon-bag.svg"],
        ];
        
        
        taskList.forEach(function(item, index) {
            $( "#fd-tasks" ).append( 
            '<div class="todo" data-taskId="' + index + '"><b>'
            + (index+1) + '</b><img src="images/' + item[1] +'" /><p class="button is-danger is-medium">' + item[0] + '</p></div>' );
        })
        $( "#fd-tasks .todo" ).click(function(ele){
            $ele = $( this )
            $ele.addClass( "done" );
            var taskId = $ele.attr("data-taskId");
            console.log("taskId", taskId)
            var anim = taskList[taskId][2]
            $("#weather").html('<img src="anims/' + (anim ? anim : 'tenor.gif') + '" />');
            setTimeout(resetWeather, 2000);
        })
        
        $(document).keypress(function(event) {
            var char = event.charCode;
            if ((char >47) && (char < 58)) {
            console.log('Handler for .keypress() called. - ' + char);
            $("#fd-tasks .todo")[char-49].click();
            }
        });
  
    }
}

$(function() {
    BigClockDisplay.start();
    CurrentTimeDisplay.start();
    TaskListDisplay.start();


    var datum = new Date();
    wochentag=new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag","Samstag");
    
    var weekday = wochentag[datum.getDay()];
    var date = datum.getDate() +"."+ (datum.getMonth()+1)+"."+datum.getFullYear();
    var dateElement = document.getElementById('datetime');
    dateElement.innerHTML = weekday + " " + date;



  console.log( "ready!" );
  $.getJSON('https://api.met.no/weatherapi/locationforecast/1.9/.json?lat=51.8156514&lon=7.1770284', function(data) {
    var symbol = data['product']['time'][1]['location']['symbol']['number'];
    var temperature = data['product']['time'][0]['location']['temperature']['value']; 
    console.log("temperature", temperature);
    console.log("weather symbol", symbol);
    $("#weatherIcon").html('<img src="https://api.met.no/weatherapi/weathericon/1.1/?symbol='+symbol+'&is_night=1&content_type=image/svg%2Bxml" />');
    $("#weatherTemp").html(temperature + "°C");
  });

  // Assign handlers immediately after making the request,
  // and remember the jqXHR object for this request
  var jqxhr = $.ajax( "basic.ics" )
    .done(function(data) {
      console.log("done reading basic.ics")
        // Get the basic data out
        var jCalData = ICAL.parse(data);
        console.log("jcaldata", jCalData)

        // Fetch the VEVENT part
        var comp = new ICAL.Component(jCalData[2][4]);
        var event = new ICAL.Event(comp); 
        console.log("event", event);
        console.log(event.summary, event.startDate, event.description);

        // Get start and end dates as local time on current machine
        console.log(event.startDate.toJSDate().toISOString(), event.endDate.toJSDate());


        // Get start and end dates as local time on current machine
        // console.log(event.startDate.toJSDate(), event.endDate.toJSDate());
    })
    .fail(function() {
      alert( "error" );
    })
    .always(function() {
      console.log( "complete" );
    });
});


