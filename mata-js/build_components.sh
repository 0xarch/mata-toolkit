#!/bin/sh
touch ./components.js
cat ./components/collapse.js > ./components.js
echo -e "\n" >> ./components.js
cat ./components/tabs.js >> ./components.js
echo -e "\n" >> ./components.js
cat ./components/anchor.js >> ./components.js
echo -e "\n" >> ./components.js
cat ./components/calendar.js >> ./components.js