ECHO "---Iniciando redeploy---"
cd workspace
npm i
pm2 stop index.js
pm2 start index.js

