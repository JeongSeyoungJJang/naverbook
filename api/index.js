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
    try {
        const isExist = await client.get("books");
        if(!isExist) console.log("캐싱된 책 정보가 없습니다.");
        const books = JSON.parse(await client.get("books"));
        console.log(`책 ${books.length}건`);
        return res.send({
            success: true,
            value: books
        })
    } catch (error) {
        console.log(error);
        return res.send({success: false, message: error.message});
    }
})

app.listen(PORT, () => {
    console.log(`Server Port : ${PORT}`);
})