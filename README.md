# Family-Dashboard

A family dashboard to run on a screen in the kitchen in the morning, showing all relevant information about the current day. Pure HTML & Javascript. Plus cronjob scripts to read Google calendar and ToDoList data.

![Example screenshot of family dashboard](preview/screenshot3.jpg)

Features:
* rain radar
* weather diagram
* vacation countdown
* class schedule
* calendar next 3 days (google calendar)
* to do list (using "OurGroceries" app api)
* picture of the day
* joke of the day
* musicplayer
* interactive "cross-off"-list
* cleaning roster

## Hardware
* Old Intel NUC Mini PC, running Ubuntu linux, booting directly into a firefox instance in kiosk mode, showing the dashboard.
* Shelly Socket, turns on the PC before we get up, and turns it off when everybody went to school, work, etc.
* Old Monitor, displays the dashboard.

## Software
* HTML
* Bulma CSS Framework
* JQuery
* Cronjobs: 1x bash shell, 1x node.js

# Documentation

## Aufrufparameter

`?nosound` als Url Parameter angeben, dann wird die Musik-Playlist nicht automatisch abgespielt, sondern man muss erst auf den Play-Button klicken.

## Kalendar
In Calendar-Events in der Beschreibung ("description") können verschiedene Kennwörter verwendet werden:

    (Countdown) => Das Event wird automatisch in der Countdown Liste angezeigt
    (Sticker_$name) => Das Icon mit Dateiname "icon/${name}.png" wird neben dem Termin angezeigt

## ToDo-Liste

Die Todo-Liste wird aus der Android App "OurGroceries" gelesen. Die Todolisten sollten die Namen "* ToDo" und "* Haushalt" haben.

# Installation

I have the dashboard running as a webpage on my hetzner webserver. The raspberry just boots up and shows the webpage via the www.

## Install server component

1. Put the files of this repo on your webserver
2. Install cronjob on server:

        15 5  *   *   *      cd ~/family-dashboard;bash ./load-calender.sh >> cronupdate.log 2>&1;node load-our-groceries.js >> cronupdate.log 2>&1


## Install raspberry PC in kitchen

Configure it to boot directly into a web browser that opens the url of your webserver.

These might help:

    firefox --kiosk http://...adresse...

    https://meine-it-welten.de/google-chrome-moegliche-parameter-zum-starten-von-chrome/
    https://peter.sh/experiments/chromium-command-line-switches/


## Configuration

This is a solo hobby project and I started making this configurable, but right now some config is still in arrays inside the *main.js* file.

* See the `*.dist` files in the main directory, and adjust them to your needs, then remove ".dist" from the filename
* See the file `lib/main.js` for Tasklist and Stundenplan config, and change them as needed.

# Development

Start dev server:

    cd public
    php -S localhost:8000


## Add item to "check-off"-list

* Find emoji @ https://www.flaticon.com/ or emojipedia
* Copy SVG to "images" path.
* Add item to list in main.js

## Generate Music-Songlist

Das Array mit den Dateinamen der Musik-Playlist kann man mit folgendem Befehl generieren:

    ls *.mp3 | jq -R -s -c 'split("\n")[:-1]'


## Flachwitze-Liste

    cal/flachwitze.txt

License is GPL 3.0, source is: https://github.com/derphilipp/Flachwitze

## Weiterführende Links

**Ourgrocercies client**

* https://github.com/sethwebster/our-groceries-client

**Ical.js**

 * APi-Dokumentation: https://mozilla-comm.github.io/ical.js/api/ICAL.Event.html#isRecurring
 * Info zum Spezialfall "recuring events": https://github.com/mozilla-comm/ical.js/issues/148


# Licenses

Images used for the TODO-List
* toothbrush-icon: Stockio.com - https://www.stockio.com/free-icon/bathroom-icons-toothbrush
* Icons: helmet, face-mask: Icon made by Freepik from www.flaticon.com - https://www.flaticon.com/free-icon/vifking-helmet_499260
* Other icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
