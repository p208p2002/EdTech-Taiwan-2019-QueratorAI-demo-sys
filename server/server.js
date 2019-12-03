const path = require('path');
const express = require('express')
const app = express()
const port = 6000
// For Static File
app.use(express.static('build'))
// 404 Redirect to App(Front End Route will handle next)
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname+'/build/index.html'))
  });
app.listen(port, () => console.log(`listening on port ${port}!`))
