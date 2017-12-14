const express = require('express');
const cheerio = require('cheerio');
const superagent = require('superagent');

const app = express();
app.listen(8080, function () {
    console.log('app is listening at port 8080');
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
    name: String,
    discount: String,
    where: String,
    area: String,
    tags: [String],
    types: [String],
    price: String
});

function getPageCount(url){
    console.log('爬取总页数...' + url);
    superagent.get(url)
        .end(function (err, sres) {
            if (err) {
                console.log(err);
            }
            const $ = cheerio.load(sres.text);
            const pageCount = JSON.parse($('.list-wrap .page-box').attr('page-data')).totalPage;

            for(let i = 1;i <= pageCount;i++){
                i === 1? getPageAsync(url) : getPageAsync(`${url}pg${i}/`);
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
            const $ = cheerio.load(sres.text);
            const tagArr = [];
            const typeArr = [];
            const items = [];
            $('.house-lst .pic-panel img').each(function (index, element) {
                const $element = $(element);
                const $info_1 = $($('.house-lst .info-panel .col-1')[index]);
                const $info_2 = $($('.house-lst .info-panel .col-2')[index]);

                $info_1.find('.other span').each(function (i, item) {
                    tagArr[i] = $(item).text().replace(/(\t)|(\n)|(\s+)/g,'');
                });

                $info_1.find('.type span').each(function (i, item) {
                    typeArr[i] = $(item).text().replace(/(\t)|(\n)|(\s+)/g,'');
                });

                const $eleInfo = {
                    src: $element.attr('data-original'),
                    name: $info_1.find('h2 a').text(),
                    discount: $info_1.find('h2 .redTag .text').text(),
                    where: $info_1.find('.where .region').text(),
                    area: $info_1.find('.area').text().replace(/(\t)|(\n)|(\s+)/g,''),
                    tags: tagArr,
                    types: typeArr,
                    price: $info_2.find('.price .average').text().replace(/(\t)|(\n)|(\s+)/g,'')
                };

                loupan.create($eleInfo, function (err) {
                    if(err) console.log(err);
                });

                items.push($eleInfo);
            });
            console.log(items);
        });
}

app.get('/', function (req, res, next) {
    getPageCount('https://nj.fang.lianjia.com/loupan/');
});


