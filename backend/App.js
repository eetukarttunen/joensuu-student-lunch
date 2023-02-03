var express = require('express');
var http = require('http');

var app = express();
app.get('/', function(req, res) {
    res.send("Resting up");
});

app.listen(3001, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", 3001);
})