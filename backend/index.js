var express = require('express');
const menuService = require("./services/menuService");
const cors = require('cors'); // Import the cors package
const app = express();
app.use(cors());

app.use(express.json())

app.get('/api', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
});


app.get("/api/menus", async (req, res) => {
  try {
    const data = await menuService.getData();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

const port = process.env.PORT || 3001
app.listen(port, () => console.log("Servu pyörii"));