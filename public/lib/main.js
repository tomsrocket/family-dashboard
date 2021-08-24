
class BigClockDisplay {
  static start() {


    var mainTimer = document.getElementById('mainTimer');
    (function draw() {

        var currentdate = new Date();
        var minutes = currentdate.getMinutes();
        mainTimer.setAttribute('value', minutes);

        setTimeout(draw, 30000);

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
        var date = datum.getDate() +"."+ (datum.getMonth()+1)+"." //+datum.getFullYear();
        var dateElement = document.getElementById('datetime');
        dateElement.innerHTML = weekday + " " + date;
    }
}

class CurrentWeatherDisplay {
    static start() {
        $.getJSON('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=51.8156514&lon=7.1770284', function(data) {
            var symbol = data['properties']['timeseries'][0]['data']['next_6_hours']['summary']['symbol_code'];
            var temperature = data['properties']['timeseries'][0]['data']['instant']['details']['air_temperature'];
            console.log("temperature", temperature);
            console.log("weather symbol", symbol);
            $("#weatherIcon").html('<img src="/images/weather-symbols-metno/'+symbol+'.svg" />');
            $("#weatherTemp").html(temperature + "°C");
        });
    }
}
class StundenplanDisplay {
    static start() {
        var stundenplan = [
            ["Englisch",    "Englisch",     "Mathe",     "Info",    "Sport",    "Sport",    "-", "Mathe"],
            ["Deutsch",     "Deutsch",      "Kunst",     "Kunst",   "Geschi",   "Geschi",  ],
            ["Mathe",       "Mathe",        "Bio",       "Bio",     "Physik",   "Physik",   "-", "Deutsch"],
            ["Reli",        "Reli",         "Englisch",  "Englisch","Deutsch",  "Deutsch",  "-", "Englisch"],
            ["Sport",       "Musik",        "Politik",   "Politik", "Mathe",    "Mathe",   ],
        ];
        StundenplanDisplay.show("#stundenplan_m", stundenplan);

        stundenplan = [
            ["X",        "X",            "Mathe",    "X",    "-" ],
            ["Sport",    "Mathe",        "X",        "X",    "X"   ],
            ["X",        "X",            "X",        "X",    "Instrumente"],
            ["Mathe",    "X",            "Sport",    "X",    "X"],
            ["X",        "Orchester",    "X",        "Mathe","Sport"],
        ];
        StundenplanDisplay.show("#stundenplan_w", stundenplan);
    }

    static show(elementId, stundenplan) {
        var d = new Date();
        var day = d.getDay();
        var weekDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];

        if (!((day >0) && (day < 6))) {
            day = 1
        }
        const heute = stundenplan[0+day-1];
        const day_display = '(' + weekDays[0+day-1] + ')'
        console.log("HEUTE", day_display, heute)
        $('.stundenplan_tag').html(day_display)
        heute.forEach(function(item,index) {
            var color = 'is-dark';
            if (item == '-') {
                color='is-warning'
            }
            $(elementId).append(
                '<div class="column"><div class="fd-box notification '+color+'">'
                + '<img src="icon/s-' + item.toLowerCase() + '.png" onerror="this.style.display=\'none\'" />'
                + item
                + '</div></div>');
        });
    }

}
class TaskListDisplay {
    static start() {

        function hideModal() {
            $("#gifModal").removeClass('is-active');
            $("#gifAnim").attr('src', '');
        }

        var taskList = [
            ["Anziehen",      "icon-shirt.svg",     "chicken.gif"],
            ["Kämmen",        "icon-comb.svg",      "monkey.gif"],
            ["Zähne",         "icon-toothbrush.svg","fox.gif"],
            ["Jacke",         "icon-jacket.svg",    "snoopy.gif"],
            ["Schuhe",        "icon-shoes.svg",     "cat.gif"],
//            ["Handschuh",     "icon-gloves.svg",    "panda.gif"],
//            ["Mütze",         "icon-snowhat.svg",   "muetze.webp"],
            ["Helm",          "icon-helmet.svg",    "helmet.webp"],
            ["Maske",         "icon-facemask.svg",    "mask-horse.webp"],
            ["Rucksack",      "icon-bag.svg",       "backpack.webp"],
        ];


        taskList.forEach(function(item, index) {
            $( "#fd-tasks" ).append(
            '<div class="todo" data-taskId="' + index + '"><b>'
            + (index+1) + '</b><img src="images/' + item[1] +'" /><p class="button is-danger">' + item[0] + '</p></div>' );
        })
        $( "#fd-tasks .todo" ).click(function(ele){
            var $ele = $( this )
            if (!$ele.hasClass( "done" )) {
                $ele.addClass( "done" );
                var taskId = $ele.attr("data-taskId");
                console.log("taskId", taskId)
                var anim = taskList[taskId][2]
                $("#gifAnim").attr('src', 'anims/' + (anim ? anim : 'tenor.gif'));
                $("#gifModal").addClass('is-active');
                setTimeout(hideModal, 3000);
            }
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
        $('#playlistContainer').click(function() {
            $('#playlist').toggleClass('hidden');
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

function getData(ajaxurl) {
    return $.ajax({
        url: ajaxurl,
        type: 'GET',
    });
};

/**
 * Holy cow .. it's not easy to find out if recurring ical events are happening today
 */
class EventCalendarDisplay {
    static async start() {

        const today = new Date();
        var todayString = today.toISOString().substr(0,10);
        var countdownEvents = [];

        function extractIconFromEvent(content) {
            if (!content.desc) {
                console.log("Warning: Content without field: 'desc':", content)
                return '';
            }
            var matches = content.desc.match(/\(Sticker_([0-9a-z]+)\)/i);
            if (matches) {
                content.desc = content.desc.replace(matches[0], '');
            }
            return matches ? 'icon/' + matches[1] + '.png' : '';
        }

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

        // generate the next 5 dates
        var otherDay = new Date(today)
        otherDay.setDate(otherDay.getDate() - 1);
        var i;
        for ( i=0; i<3; i++ ) {
            otherDay.setDate(otherDay.getDate() + 1)
            var day = otherDay.toISOString().substr(0,10);
            nextDays[day] = [];
        }
        console.log(nextDays);
        const nextDaysKeys = Object.keys(nextDays);
        console.log("nextDaysKeys", nextDaysKeys);

        await readCalendar('family');
        await readCalendar('geburtstage');
        await readCalendar('tom');
        await readCalendar('kids');

        async function readCalendar(calendarFilename) {
            const data = await getData("cal/"+calendarFilename+".ics")

            console.log("done wgetting "+calendarFilename+".ics")

            // Get the basic data out
            var jCalData = ICAL.parse(data);
            console.log("jcaldata", jCalData)

            // Fetch the VEVENT part
            var eventNr = 0;
            var totalEventCounter = 0;
            var event = null;
            do {
                try {
                    totalEventCounter++;
                    var rawEvent = jCalData[2][1 + eventNr];
                    if (rawEvent) {
                        var comp = new ICAL.Component(rawEvent);
                        event = new ICAL.Event(comp);

                        var eventStartDate = event.startDate;
                        if (event.isRecurring()) {
                            // console.log("isRecurring", event.startDate + ":" + event.summary + " - " + event.description);
                            var eventStartDate = getNextDateOfEvent(event);
                            // console.log("isRecurringDate", eventStartDate);
                        }

                        if (eventStartDate >= todayString) {
                            const compareDate = (""+eventStartDate).substr(0,10);
                            if (event.description && (("" + event.description).indexOf('(Countdown)') >= 0)) {
                                console.log("countdown", compareDate, event.description)
                                console.log("event", comp);
                                var created = comp.getFirstPropertyValue("created").toICALString();
                                countdownEvents.push({
                                    date: compareDate,
                                    title: event.summary,
                                    created: created.substr(0,4) + "-" + created.substr(4,2) + "-" + created.substr(6,2)
                                });
                            }
                            nextDaysKeys.forEach(function(item, index) {
                                if (compareDate == item) {
                                    nextDays[item].push({
                                            cal: calendarFilename,
                                            time: (""+eventStartDate).substr(11,5),
                                            title: event.summary,
                                            desc: event.description
                                        }
                                    );
                                }
                            })
                        }
                        eventNr ++;
                    }
                } catch(err ) {
                    console.log("err", totalEventCounter, err)
                }
            } while (rawEvent )

            console.log("events parsed: ", totalEventCounter)
            console.log("last event: ", event)
        }

        /**
         * paint next days
         */
        console.log("nextDays", nextDays)
        var weekDays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
        Object.entries(nextDays).forEach(([key, daysEvents]) => {

            daysEvents.sort(function(a, b){
                var x = a.time;
                var y = b.time;
                if (x < y) {return -1;}
                if (x > y) {return 1;}
                return 0;
            });
            console.log(daysEvents);

            var eventDay = new Date(key);
            var dayString = weekDays[eventDay.getDay()] + ", " + eventDay.getDate() + "." + eventDay.getMonth() + ".";
            var eventContent = '';
            if (daysEvents) {
                daysEvents.forEach(function(event, index) {
                    var calIcon = extractIconFromEvent(event);
                    eventContent += '<div class="event cal-' + event.cal + '"><b>'
                        + (calIcon ? ('<img src="' + calIcon + '" />') : '')
                        + '<span>' + event.time + '</span> '
                        + event.title + '</b><i>' + event.desc+ '</i>'
                        + '</div>'
                })
            }
            $("#nextDays").append(
                '<div class="column"><div class="fd-box fd-day notification is-info ' + (dayString.startsWith('S')? 'weekend' : '' )+ '">'
                +'<b>' + dayString + '</b> '+ eventContent + '</div></div>');
        })
        return countdownEvents;
    }
}

class GroceriesList {
    static start() {
        var lists = ["ToDo", "Haushalt"];  // "Einkaufen" gets too long, temporarily remove it
        lists.forEach(function(listName, index) {
            $.getJSON('cal/'+ listName.toLowerCase() +'.json', function(data) {
                $("#shoppingList").append('<div class="shoppingHeadline">' + listName + '</div>');
                data.forEach(function(item, index) {
                    var display = item.value;
                    if ("date" in item) {
                        const today = new Date();
                        const rangeEnd = new Date(item.date);
                        const msPerDay = 24 * 60 * 60 * 1000;
                        const timeLeft = Math.floor((today.getTime() - rangeEnd.getTime()) / msPerDay);
                        display = timeLeft + "d " + display;
                    }
                    $("#shoppingList").append('<span>' + display + '</span>');
                });
            });
        });
    }
}
class DailyImage {
    static start() {
        $.getJSON('/cal/daily-photo.json', function(data) {
            console.log("bing", data)
            const ipath = data['images'][0]['url']
            const ihost = 'https://bing.com'
            const dimage = ihost + ipath
            const dcaption = data['images'][0]['title']
            const dcopy = data['images'][0]['copyright']

            $("#daily-caption").html(dcaption);
            $("#daily-image").html('<img src="' + dimage + '" title="'+ dcopy +'" />');
        });
    }
}
class DailyJoke {
    // Dies crasht irgendwann weil es derzeit weniger Witze als Tage im Jahr gibt
    static async start() {
        const data = await getData('cal/flachwitze.txt')
        const lines = data.split("\n")
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        console.log('Day of year: ' + day);
        $("#daily-joke").html(lines[day]);
    }
}
class Countdowns {
    static start(countdowns) {

        console.log("countdowns", countdowns)

        countdowns.forEach(function(item, index) {
            var today = new Date();
            var rangeStart = new Date(item.created);
            var rangeEnd = new Date(item.date);
            var msPerDay = 24 * 60 * 60 * 1000;
            var timeLeft = Math.floor((rangeEnd.getTime() - today.getTime()) / msPerDay);
            var totalDays = Math.floor((rangeEnd.getTime() - rangeStart.getTime()) / msPerDay);
            var percent = Math.floor((totalDays-timeLeft)/totalDays * 100)
            console.log("countdown", percent, timeLeft, totalDays)
            $("#countdowns").append(item.title + ' ' + timeLeft + 'd <progress class="progress is-success" value="'+percent+'" max="100">'+percent+'%</progress>')

        })

    }
}

$(async function() {
    console.log( "ready!" );
    BigClockDisplay.start();
    CurrentTimeDisplay.start();
    TaskListDisplay.start();
    CurrentDateDisplay.start();
    CurrentWeatherDisplay.start();
    var countdownEvents = await EventCalendarDisplay.start();
    AudioPlaylist.start();
    GroceriesList.start();
    StundenplanDisplay.start();
    Countdowns.start(countdownEvents);
    DailyImage.start();
    DailyJoke.start();
});


