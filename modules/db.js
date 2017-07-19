/**
 * Created by Administrator on 2017/7/17 0017.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/webchat');
var db = mongoose.connection;
db.once('open', function() {
    console.log('数据库连接成功')
});