const express = require('express');
const cheerio = require('cheerio');
const superagent = require('superagent');

const app = express();
app.listen(3000, function () {
    console.log('app is listening at port 3000');
});

//mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/spider-lj',{useMongoClient:true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connect db.")
});

//模型
const loupan = mongoose.model('loupan',{
    src: String,
    alt: String
});

function getPageCount(url){
    console.log('爬取总页数...' + url);
    superagent.get(url)
        .end(function (err, sres) {
            if (err) {
                console.log(err);
            }
            if(sres.text){
                const $ = cheerio.load(sres.text);
                const pageCount = JSON.parse($('.list-wrap .page-box').attr('page-data')).totalPage;

                for(let i = 1;i <= pageCount;i++){
                    i === 1? getPageAsync(url) : getPageAsync(`${url}pg${i}/`);
                }
            }
        });
}

function getPageAsync(url){
    console.log('爬取中...' + url + '\n');
    superagent.get(url)
        .end(function (err, sres) {
            if (err) {
                console.log(err);
            }
            if(sres.text){
                const $ = cheerio.load(sres.text);
                const items = [];
                $('.house-lst .pic-panel img').each(function (index, element) {
                    console.log(index);
                    const tagsArr = [];
                    const typesArr = [];
                    const $element = $(element);
                    const $info_1 = $($('.house-lst .info-panel .col-1')[index]);
                    const $info_2 = $($('.house-lst .info-panel .col-2')[index]);
                    const $eleInfo = {
                        src: $element.attr('data-original'),
                        alt: $element.attr('alt'),
                        name: $info_1.find('h2 a').text(),
                        where: $info_1.find('.where .region').text(),
                        area: $info_1.find('.area').text() + $info_1.find('.area span').text(),
                        tags: $info_1.find('.other span').map(function (ele) {
                            tagsArr.push($(ele).text());
                        },function () {
                            return tagsArr;
                        }),
                        types: $info_1.find('.type span').map(function (ele) {
                            typesArr.push($(ele).text());
                        },function () {
                            return typesArr;
                        }),
                        price: $info_2.find('.price .num').text()
                    };
                    loupan.create($eleInfo, function (err) {
                        if(err) console.log(err);
                    });
                    items.push($eleInfo);
                });
                console.log(items);
            }
        });
}

app.get('/', function (req, res, next) {
    getPageCount('https://nj.fang.lianjia.com/loupan/');
});


