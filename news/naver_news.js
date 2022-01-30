const fetch = require("node-fetch");
const redis = require("redis");

const client = redis.createClient();
(async() => {
    
    client.on("error", err => console.log("Redis Client Error", err));

    await client.connect();
    console.log("Success to connect redis")
})();

const query = encodeURI("자바스크립트")
const baseURL = `https://openapi.naver.com/v1/search/book.json?query=${query}&display=100&sort=count`;

async function naverNews() {

    let onPage = 1;
    
    const isExists = await client.exists("books");
    if(!isExists) {
        let allBooks = []
        while(onPage < 100  ){
            const res = await fetch(`${baseURL}&start=${onPage}`, {
                method: "GET",
                headers: {
                    "X-Naver-Client-Id": "OitIfYzOkUvKm8Y6AnEf",
                    "X-Naver-Client-Secret": "A7Zrk_qiDs"
                }
            });
            const news = await res.json();
            if(!Array.isArray(news.items)) console.log(`start: ${onPage}에서 news.items가 배열형태가 아님`)
            allBooks.push(...news.items);
            onPage += 100;
        }
        allBooks.forEach(book => {
            book.title = book.title.replaceAll("<b>", "");
            book.title = book.title.replaceAll("</b>", "");
            book.description = book.description.replaceAll("<b>", "");
            book.description = book.description.replaceAll("</b>", "");
        })
        console.log(`${allBooks.length}건의 책 정보를 가져왔습니다.`)

        client.setEx("books", 36000, JSON.stringify(allBooks));

        console.log("Success")

    } else {
        console.log("이미 존재하는데요?")
    }

}

// const searchBooks = async () => {

// };
module.exports.naverNews = naverNews;