const express = require("express");
const NodeCache = require("node-cache");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
const cache = new NodeCache({ stdTTL: 1000 });

app.get("/todos/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (cache.has(id)) {
      return res.status(200).json({
        name: "casching",
        data: cache.get(id),
      }); // display data
    } else {
      return res.status(404).json({
        message: "data not cahing",
      });
    }
  } catch (err) {
    throw new Error(err);
  }
});

app.get("/key", (req, res) => {
  try {
    let mykeys = cache.keys();
    let arr = [];
    for (let i = 0; i < mykeys.length; i++) {
      mykeys[i];
      arr.push(cache.get(mykeys[i]));
    }
    return res.status(200).send(arr);
  } catch (err) {
    throw new Error(err);
  }
});

app.post("/search", (req, res) => {
  const { state, value } = req.body;
  try {
    let mykeys = cache.keys();
    let arr = [];
    for (let i = 0; i < mykeys.length; i++) {
      mykeys[i];
      arr.push(cache.get(mykeys[i]));
    }

    const results = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].title.indexOf(value) != -1) {
        results.push(arr[i]);
      }
    }

    return res.status(200).send({
      data: results,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/todos", async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/todos/`
    );
    for (let i = 0; i < data.length; i++) {
      await cache.set(data[i].id, data[i]); // insert data1
    }
    return res.status(200).json(" save data to caching is success!!!");
  } catch ({ response }) {
    return res.sendStatus(response);
  }
});
const start = (port) => {
  try {
    app.listen(port);
    console.log("server is running");
  } catch (err) {
    console.error(err);
    process.exit();
  }
};
start(3000);
