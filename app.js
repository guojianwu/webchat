/**
 * Created by Administrator on 2017/7/15.
 */
var express = require('express');
var app=express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var session = require('express-session');

var router=require('./routers/router.js');
var getApi=require('./routers/getApi.js');
var postApi=require('./routers/postApi.js');



app.set('view engine','ejs');
app.use(express.static('./public'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))







app.get('/',router.showIndex)
app.get('/chat',router.showChat)
app.get('/main',router.showMain)



app.post('/regist',postApi.regist)
app.post('/login',postApi.login);
app.post('/addhaoyou',postApi.addhaoyou);
app.post('/sendInfo',postApi.sendInfo);
app.post('/clearweidu',postApi.clearweidu);
app.post('/temptouxiang',postApi.temptouxiang);
app.post('/decliaotian',postApi.decliaotian);
app.post('/dechaoyou',postApi.dechaoyou);



app.get('/getsession',getApi.getsession)
app.get('/loginout',getApi.loginout)
app.get('/getuserinfo',getApi.getuserinfo)


io.on('connection', function(socket){
    //console.log('一个客户端连接')
    socket.on('chat',function(msg){
        io.emit(msg.sendwho,msg)
        //console.log(msg);
    })
});
server.listen(3000);