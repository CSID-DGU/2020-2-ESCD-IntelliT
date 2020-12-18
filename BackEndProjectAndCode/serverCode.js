const https = require('https');
const fs = require('fs');
const url = require('url');
const request = require('request');

const options = {
  hostname: 'team-a.miniform.kr',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('fullchain.pem')
};

options.agent = new https.Agent(options);

let openid;
let data;

function myFunc(arg) {
  let info;

  const mysql      = require('mysql');
  const connection = mysql.createConnection({
  host     : '34.64.192.134',
  user     : 'root',
  password : '998',
  database : 'sys'
  });

  connection.connect();

  connection.query('SELECT * from zTest', (dbErr, rows, fields) => {
    if (dbErr) throw dbErr;
    info = rows[arg];
  });

  connection.end();

  request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+data.appid+'&secret='+data.secret, function (error2, response2, body2) {
    let token = JSON.parse(body2).access_token;
    let options = {
      uri: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='+token,
      method: 'POST',
      body:{
         "touser": openid,
         "template_id": info.template_id,
         "page": "index",
         "miniprogram_state":"developer",
         "lang":"en_US",
         "data": {
            "character_string1": {
               "value": info.count
            },
            "thing2": {
               "value": info.name
            }
         }
      },
      json:true //json으로 보낼경우 true로 해주어야 header값이 json으로 설정됩니다.
    };
    request.post(options, function(error3,response3,body3){  console.log(body3); });
  });
}

https.createServer(options, (req, res) => {
  //res.writeHead(200);
  //res.end('hello world\n');
  data = url.parse(req.url,true).query;
  request('https://api.weixin.qq.com/sns/jscode2session?appid='+data.appid+'&secret='+data.secret+'&js_code='+data.code+'&grant_type=authorization_code', function (error, response, body) {
    openid = JSON.parse(body).openid;
    var val = {'openid': openid};
    var jsonDatas = JSON.stringify(val);
    res.writeHead(200, { 'Content-Type': 'application/json;characterset=utf-8' });
    res.write(jsonDatas);
    res.end();
    for(var i = 0; i < 2; ++i){
      setTimeout(myFunc, 5000 * (i + 1), i);
    }

    }
  );
}).listen(80);