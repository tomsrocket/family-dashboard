#!/bin/bash

echo -e "\e[37;42mcronjob run $(date '+%Y-%m-%d %H:%M:%S')\e[0m"

./load-calender.sh

# load daily photo from bing
wget -O public/cal/daily-photo.json "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=de-DE"

node load-our-groceries.js
node load-spotify.js