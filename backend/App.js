var express = require('express');
var http = require('http');
const menuService = require("./services/menuService");
const cors = require('cors'); // Import the cors package
const app = express();

app.use(cors());

app.use(express.static('build'))

app.get("/menus", async (req, res) => {
  try {
    const data = await menuService.getData();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/', function(req, res) {
    res.send("Resting up");
});

app.listen(3001, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", 3001);
})