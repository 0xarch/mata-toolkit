#!/bin/sh
touch main.js

cat base.js > main.js
echo -e "\n" >> main.js
cat constructor.js >> main.js
echo -e "\n" >> main.js
cat palette.js >> main.js
echo -e "\n" >> main.js
cat em3et.js >> main.js

sh ./build_components.sh
