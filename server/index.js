const keys = require("./keys");

// Express app setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgress Client Setup
const {Pool} = require("pg");

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

const startPostgres = async () => {
  pgClient.on("error", () => console.log("Lost PG connection."));

  pgClient
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.log(err));
};

// Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
  socket: {host: keys.redisHost, port: keys.redisPort, reconnectStrategy: 1000},
});
const redisPublisher = redisClient.duplicate();

const startRedis = async () => {
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  await redisClient.connect();
  await redisPublisher.connect();
};

// Express router config

const configRouter = () => {
  app.get("/", (req, res) => {
    res.send("Hi");
  });

  app.get("/values/all", async (req, res) => {
    const values = await pgClient.query("SELECT * FROM values");

    res.send(values.rows);
  });

  app.get("/values/current", async (req, res) => {
    const values = await redisClient.hGetAll("values");
    res.send(values);
  });

  app.post("/values", async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
      return res.status(422).send("Index too high");
    }

    redisClient.hSet("values", index, "Nothing yet!");
    redisPublisher.publish("insert", index);

    pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

    res.send({working: true});
  });
};

const startApp = async () => {
  startPostgres();
  startRedis();
  configRouter();

  app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
  });
};

startApp();
