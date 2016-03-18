var util = require('util'),
    twitter = require('twitter'),
    fs = require('fs');

var twit = new twitter({//アカウント認証
    consumer_key:'',
    consumer_secret:'',
    access_token_key:'',
    access_token_secret:'',
});
var num = 100, stat;
var word = process.argv[2];//コマンドの第三引数に検索ワードをいれる

// エラーハンドリング
process.on('uncaughtException', function(err) {
    console.log(err);
});

//クライアントへのレスポンス
var app = require('http').createServer();
app.on('request', function(req, res) {
    console.log(req.url);
    fs.readFile('./index.html', 'utf8', function(err, text){
        console.log("-----------------readFile------------------");
        if(err){
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('not found!');
            return res.end();
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(text);
        res.end();
    });
    if(req.url == "/style.css"){
        fs.readFile('./style.css', 'utf8', function (err, data){
            if(err){
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write("not found css");
                res.end();
            }
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            console.log("そいや");
            res.end();
        }); 
    }
    
}).listen(3000);//ポート

var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket){
    socket.on('search', function(text, fn){
        fn(text + " was successfully sent");
        searchWord(text, num);
        cnctStream(text);       
    });
});

function getTweet(data){
    try{
        var hasPic = data.entities && data.entities.media && data.entities.media[0].media_url;
        if(hasPic){
            var pic = "<a href='" + data.entities.media[0].media_url + "' />";
            console.log(data.user.name + '  |  ' +  data.user.screen_name + "\n" + data.text);
            console.log("うらる：" + data.entities.media[0].media_url);
            console.log("タグ付きうらる：" + pic);
            //io.sockets.emit('msg', data.user.name + '  |  ' +  data.user.screen_name + "\n" + data.text);
            io.sockets.emit('msg',  "<li><a href='" + data.entities.media[0].media_url + "' >" + 　
                                        "<img src='" + data.entities.media[0].media_url + "' height='200' />" + 
                                    "</a></li>");
        }
        console.log();
    }catch(er){console.log(er);}
}

//ストリーミング接続して新しく検索ワードに当てはまるツイートを取得する
function cnctStream(text){
    twit.stream( 'statuses/filter', { track : text }, function(stream,er) {
        console.log("\nストリーミング接続しました。" + text + "を検索します。\n");
        // フィルターされたデータのストリームを受け取り、ツイートのテキストを表示する
        stream.on( 'data', function( data ) {
            getTweet(data);
        });
    }); 
}


function searchWord(text, num){
    twit.get('search/tweets', {q : text, count : num}, function(error, data, response) {
        console.log(text + "を検索します。");
        for(i = 0; i < num; i++){
            stat = data.statuses[i];
            getTweet(stat);
        }
    });
}


// console.log('Server running at http://127.0.0.1:3000/');