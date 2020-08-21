#!/bin/bash
# Chromium starten mit Startverzoegerung udw.
echo `date +%Y-%m-%d:%H:%M:%S`' ----------------- Startup!' &>> /home/pi/actionlog.log
echo `date +%Y-%m-%d:%H:%M:%S`' Milliseconds: '`date +%s` &>> /home/pi/actionlog.log

echo `date +%Y-%m-%d:%H:%M:%S`' Uregistering Shutdowns ' &>> /home/pi/actionlog.log
sudo shutdown -c 

echo `date +%Y-%m-%d:%H:%M:%S`' Waiting for WLAN' &>> /home/pi/actionlog.log
sleep 10 

echo `date +%Y-%m-%d:%H:%M:%S`' Starting Browser in Background' &>> /home/pi/actionlog.log
# chromium-browser ---incognito --kiosk http://fdash.input23.de
firefox 'http://fdash.input23.de?'`date +%s` &


echo `date +%Y-%m-%d:%H:%M:%S`' Wait 90 min' &>> /home/pi/actionlog.log
sleep 90m

echo `date +%Y-%m-%d:%H:%M:%S`' Close Browser Window' &>> /home/pi/actionlog.log
xdotool search --sync --onlyvisible --class "Firefox" windowactivate key F4
sleep 10

echo `date +%Y-%m-%d:%H:%M:%S`' Powering down' &>> /home/pi/actionlog.log
sudo poweroff  
