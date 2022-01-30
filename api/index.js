const express = require("express");
const redis = require("redis");
const cors = require("cors");
const app = express();
const client = redis.createClient();
(async () => {
    client.on("error", err=> console.log("Redis Client Error", err))    ;
    await client.connect();
    console.log("api server: Success to connect to redis")
})()
const PORT = 3001;

app.use(cors({origin: "http://localhost:8080"}));

app.get("/book", async(req, res) =>{
    const books = JSON.parse(await client.get("books"));
    return res.send({
        success: true,
        value: books
    })
})

app.listen(PORT, () => {
    console.log(`Server Port : ${PORT}`);
})