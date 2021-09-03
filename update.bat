@echo off
git pull
set port=8080
set /p port="Enter Port (8080): "
echo PORT=%port% > .env
npm install