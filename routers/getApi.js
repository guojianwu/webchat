/**
 * Created by Administrator on 2017/7/15.
 */
var db=require('../modules/db.js');
var User=require('../modules/Users.js');
exports.getsession=function(req,res){
    var login=req.session.login?true:false;
    var name=req.session.login?req.session.name:'';
    res.send({sessionLogin:login,sessionNmae:name})

}
exports.loginout=function(req,res){
    req.session.login=false;
    req.session.name='';
    res.send({code:'1',msg:'退出成功'})

}
exports.getuserinfo=function(req,res){
   var name=req.query.name;
    //console.log(name)
   User.find({name:name},function(err,result){
       if(err){
           res.send({code:'-1',msg:'查询用户信息失败'});
           return;
       }
       //console.log(result)
       res.send({code:'1',msg:result});
   })

}