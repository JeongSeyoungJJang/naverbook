const fetch = require("node-fetch");
const redis = require("redis");
const cheerio = require("cheerio");
const dotenv = require("dotenv");
dotenv.config();
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
                    "X-Naver-Client-Id": process.env['X-Naver-Client-Id'],
                    "X-Naver-Client-Secret": process.env['X-Naver-Client-Secret']
                }
            });
            const news = await res.json();
            if(!Array.isArray(news.items)) console.log(`start: ${onPage}에서 news.items가 배열형태가 아님`)
            allBooks.push(...news.items);
            onPage += 100;
        }
        // await allBooks.forEach(async book => {
        //     const bookContent = await fetch(book.link);
        //     const bookContentHTML = bookContent.body._outBuffer.toString("utf-8");
        //     const $ = cheerio.load(bookContentHTML);
        //     book.title = $('meta[property="og:title"]').attr('content');
        //     book.description = $('meta[property="og:description"]').attr('content');
        // })
        console.time("buffer")
        for(const book of allBooks ){
            try {
                const bookContent = await fetch(book.link,{
                    headers:{
                        "Content-Type": "text/plain;charset=UTF-8",
                        "Accept": "*/*",
                        "Accept-Encoding": "gzip, deflate, br"
                    }
                });
                const bookContentBuffer = await bookContent.buffer();
                const $ = cheerio.load(bookContentBuffer);
                const description = $('#bookIntroContent')[0] ? $('#bookIntroContent')[0].children[0].children.filter(child=>child.type === 'text').map(node=>{
                        if(!node.prev) {//처음
                            return node.parent.type === 'tag' ? `<${node.parent.name}>${node.data}` : node.data;
                        } else if(!node.next) {//마지막
                            return node.parent.type === 'tag' ? `${node.data}</${node.parent.name}>` : node.data;
                        } else {
                            return `<${node.next.name}>${node.data}</${node.prev.name}>`
                        }
                }) : "설명 없음"
                book.title = $('meta[property="og:title"]').attr('content');
                book.description = Array.isArray(description) ? description.join("") : description;
                
            } catch (error) {
                console.log(error);
                
            }
        }
        console.timeEnd("buffer")
        client.setEx("books", 3600, JSON.stringify(allBooks)).then(()=>{
            console.log(`${allBooks.length}건의 책 정보를 저장하였습니다.`)
        });
    } else {
        console.log("이미 존재하는데요?")
    }

}

// const searchBooks = async () => {

// };
module.exports.naverNews = naverNews;