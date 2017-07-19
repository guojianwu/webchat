/**
 * Created by Administrator on 2017/7/15.
 */
var db=require('../modules/db.js');
var User=require('../modules/Users.js');

exports.showIndex=function(req,res){
    if(req.session.login){
        res.redirect('/main');
        return;
    }
    res.render('index')
}
exports.showChat=function(req,res){
    if(!req.session.login){
        res.redirect('/');
        return;
    }
    res.render('chat')
}
exports.showMain=function(req,res){
    if(!req.session.login){
        res.redirect('/');
        return;
    }
    res.render('main')
}