
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

class CurrentDateDisplay {
    static start() {
        var datum = new Date();
        var wochentag=new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag","Samstag");
        
        var weekday = wochentag[datum.getDay()];
        var date = datum.getDate() +"."+ (datum.getMonth()+1)+"."+datum.getFullYear();
        var dateElement = document.getElementById('datetime');
        dateElement.innerHTML = weekday + " " + date;
    }
}

class CurrentWeatherDisplay {
    static start() {
        $.getJSON('https://api.met.no/weatherapi/locationforecast/1.9/.json?lat=51.8156514&lon=7.1770284', function(data) {
            var symbol = data['product']['time'][1]['location']['symbol']['number'];
            var temperature = data['product']['time'][0]['location']['temperature']['value']; 
            console.log("temperature", temperature);
            console.log("weather symbol", symbol);
            $("#weatherIcon").html('<img src="https://api.met.no/weatherapi/weathericon/1.1/?symbol='+symbol+'&is_night=1&content_type=image/svg%2Bxml" />');
            $("#weatherTemp").html(temperature + "°C");
        });        
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
            var $ele = $( this )
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

class AudioPlaylist {
    static start() {
        var audio;
        var playlist;
        var tracks; 
        var current;
        
        // Generate content for "mp3Files": cd music; ls *.mp3 | jq -R -s -c 'split("\n")[:-1]'
        var mp3Dir = "music/";
        var mp3Files = ["Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 01 Breaker A Movement 01.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 02 Breaker A Movement 02.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 03 Breaker A Movement 03.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 04 Breaker A Movement 04.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 05 Breaker A Movement 05.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 06 Breaker A Movement 06.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 07 Breaker A Movement 07.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 08 Breaker A Movement 08.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 09 Breaker A Movement 09.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 10 Breaker B Movement 01.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 11 Breaker B Movement 02.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 12 Breaker B Movement 03.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 13 Breaker B Movement 04.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 14 Breaker B Movement 05.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 15 Breaker B Movement 06.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 16 Breaker B Movement 07.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 17 Breaker B Movement 08.mp3","Dubmood - Breaker (Original Video game Soundtrack) (DATA080) - 18 Breaker B Movement 09.mp3"];

        mp3Files.forEach(function(item, index) {
            $("#playlist").append('<li><a href="'
                + mp3Dir + item + '">' + index + " " + item.substr(-30).replace(".mp3","") + '</a></li>')
        })

        init();
        function init(){
            current = 0;
            audio = $('audio');
            playlist = $('#playlist');
            tracks = playlist.find('li a');
            console.log("tracks", tracks)
            var len = tracks.length - 1;
            //audio[0].volume = .10;
            run(tracks.first(), audio[0]);
            playlist.find('a').click(function(e){
                e.preventDefault();
                var link = $(this);
                current = link.parent().index();
                run(link, audio[0]);
            });
            audio[0].addEventListener('ended',function(e){
                current++;
                var link;
                if(current == len){
                    current = 0;
                    link = playlist.find('a')[0];
                }else{
                    link = playlist.find('a')[current];    
                }
                run($(link),audio[0]);
            });
        }
        function run(link, player){
            player.src = link.attr('href');
            var par = link.parent();
            par.addClass('active').siblings().removeClass('active');
            audio[0].load();
            audio[0].play();
        }        
    }
}

/**
 * Holy cow .. it's not easy to find out if recurring ical events are happening today
 */
class EventCalendarDisplay {
    static start() {

        const today = new Date();
        var todayString = today.toISOString().substr(0,10);
        
        function getNextDateOfEvent(event) {
            var iter = event.iterator();
            var next = iter.next();
        
            for (; next; next = iter.next()) {
                var occurrence = event.getOccurrenceDetails(next);
                if ((""+occurrence.startDate).substr(0,10) >= todayString) {
                    return (""+occurrence.startDate);
                }
            }
            return "";
        }

        var nextDays = [];

        var otherDay = new Date(today)
        var i; 
        for ( i=0; i<5; i++ ) {
            otherDay.setDate(otherDay.getDate() + 1)
            var day = otherDay.toISOString().substr(0,10);
            nextDays[day] = [];
        }
        console.log(nextDays);
        const nextDaysKeys = Object.keys(nextDays);
        console.log("nextDaysKeys", nextDaysKeys);

        // Assign handlers immediately after making the request,
        // and remember the jqXHR object for this request
        var jqxhr = $.ajax( "basic.ics" )
        .done(function(data) {
            console.log("done reading basic.ics")
            // Get the basic data out
            var jCalData = ICAL.parse(data);
            console.log("jcaldata", jCalData)
            
            // Fetch the VEVENT part
            var eventNr = 0;
            var displayedEventsCounter = 0;
            var totalEventCounter = 0;
            
            do {
                try {
                    totalEventCounter++;
                    var rawEvent = jCalData[2][4 + eventNr];
                    if (rawEvent) {
                        var comp = new ICAL.Component(rawEvent);
                        var event = new ICAL.Event(comp);

                        var eventStartDate = event.startDate;
                        if (event.isRecurring()) {
                            // console.log("isRecurring", event.startDate + ":" + event.summary + " - " + event.description);
                            var eventStartDate = getNextDateOfEvent(event);
                            // console.log("isRecurringDate", eventStartDate);

                        }
                    
                        if (eventStartDate >= todayString) {
                            displayedEventsCounter++;
                            $('#events').append("<p>" + displayedEventsCounter + " " + eventStartDate + ":" + event.summary + " - " + event.description + "</p>");

                            const compareDate = (""+eventStartDate).substr(0,10);
                            nextDaysKeys.forEach(function(item, index) {
                                if (compareDate == item) {
                                    nextDays[item].push(eventStartDate + ":" + event.summary + " - " + event.description);
                                }
                            })
                        }
                        eventNr ++;
                    }
                } catch(err ) {
                    console.log("err", totalEventCounter, err)
                } 
            } while (rawEvent )
            console.log("nextDays", nextDays)
            Object.entries(nextDays).forEach(([key, value]) => {
                $("#nextDays").append(
                    '<div class="column"><div class="fd-box notification is-info">'
                    +'<b>'+key + '</b> '+ JSON.stringify(value)+ '</div></div>');
            })
            
            // Get start and end dates as local time on current machine
            // console.log(event.startDate.toJSDate(), event.endDate.toJSDate());
        })
        .fail(function() {
            alert( "error" );
        })
        .always(function() {
            console.log( "complete" );
        });
    }
}

$(function() {
    console.log( "ready!" );
    BigClockDisplay.start();
    CurrentTimeDisplay.start();
    TaskListDisplay.start();
    CurrentDateDisplay.start();
    CurrentWeatherDisplay.start();
    EventCalendarDisplay.start();
    AudioPlaylist.start();
});


