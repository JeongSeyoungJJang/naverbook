const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const redis = require("redis");
const cfenv = require("cfenv");
const dotenv = require("dotenv");
dotenv.config();

console.log(cfenv.getAppEnv());
app.use(express.json());

const redisCred = cfenv.getAppEnv().getServiceCreds("redis");
const client = redis.createClient(process.env.redisURI);

(async() => {
    
    client.on("error", err => console.log("Redis Client Error", err));

    await client.connect();
    console.log("Success to connect redis")
})();

app.post("/", (req, res) => {
    const method = req.body.method;
    const dynamic = req.body.dynamic;
    return dynamic === 'func' ? res.send(cfenv.getAppEnv()[method]()) : res.send(cfenv.getAppEnv()[method]);
})

app.get("/redis", async(req,res)=>{
    const key = req.body.key;
    return res.send(await client.get(key));
})

app.post("/redis", async(req, res)=> {
    const { key, value} = req.body;
    return res.send(await client.set(key, value));
    
})
app.listen(PORT, () => {
    console.log(`Server Port : ${PORT}`)
})