# QG Express
給QG React用的伺服器
- 404轉送
- 靜態資源

## Runtime require
- node : 10.16.3
- npm : 6.9.0

## First use
```
npm install
```

## Normal use
```
node server.js
```

## Run as background
install forever
```
npm install forever -g
```
run as background
```
forever start server.js
```
stop server
```
forever list
forever stop 0
```