# Family-Dashboard

A family web dashboard that runs on our screen in the kitchen

Images used for the TODO-List 
* toothbrush-icon: Stockio.com - https://www.stockio.com/free-icon/bathroom-icons-toothbrush
* helmet-icon: Icon made by Freepik from www.flaticon.com - https://www.flaticon.com/free-icon/viking-helmet_499260

## Documentation 

In Calendar-Events in der Beschreibung ("description") können verschiedene Kennwörter verwendet werden: 
  
    (Countdown) => Das Event wird automatisch in der Countdown Liste angezeigt
    (Sticker_$name) => Das Icon mit dem Namen $name wird neben dem Termin angezeigt

Ical.js 

 * APi-Dokumentation: https://mozilla-comm.github.io/ical.js/api/ICAL.Event.html#isRecurring
 * Info zum Spezialfall "recuring events": https://github.com/mozilla-comm/ical.js/issues/148

### Generate Music-Songlist

Das Array mit den Dateinamen der Musik-Playlist kann man mit folgendem Befehl generieren: 

    ls *.mp3 | jq -R -s -c 'split("\n")[:-1]'

## Raspberry installieren

    firefox --kiosk http://...adresse...

    https://meine-it-welten.de/google-chrome-moegliche-parameter-zum-starten-von-chrome/
    https://peter.sh/experiments/chromium-command-line-switches/

## Ourgrocercies client

https://github.com/sethwebster/our-groceries-client

