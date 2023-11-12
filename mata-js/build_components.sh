#!/bin/sh
touch ./components.js
cat ./components/collapse.js > ./components.js
echo -e "\n" >> ./components.js
cat ./components/tabs.js >> ./components.js
echo -e "\n" >> ./components.js
cat ./components/anchor.js >> ./components.js
echo -e "\n" >> ./components.js
cat ./components/calendar.js >> ./components.js
echo -e "\n" >> ./components.js
cat ./components/image-roller.js >> ./components.js
echo -e "\n" >> ./components.js
cat ./components/toolbar.js >> ./components.js
echo -e "\n" >> ./components.js
cat ./components/pagination_and_footer.js >> ./components.js