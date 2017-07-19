/**
 * Created by Administrator on 2017/7/15.
 */
var db=require('../modules/db.js');
var User=require('../modules/Users.js');
var formidable = require('formidable');
var fs=require('fs');
var path=require('path');
exports.regist=function(req,res){
    if (req.url == '/regist' && req.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
           //console.log(fields)
            User.find({name:fields.name},function(err,result){
                if(err){
                    res.send({code:'-3',msg:'注册失败'});
                    console.log(err)
                    return;
                }
                if(result.length!=0){
                    res.send({code:'-2',msg:'用户名被占用'});
                    return;
                }
                if(fields.password!=fields.repassword){
                    res.send({code:'-1',msg:'两次密码输入不一致'});
                    return;
                }
                User.create({name:fields.name,password:fields.password},function(err,result){
                    if(err){
                        res.send({code:'-3',msg:'注册失败'});
                        console.log(err)
                        return;
                    }

                    var readable = fs.createReadStream( 'E:/study/webchat/public/touxiang/moren.jpg' );
                    // 创建写入流
                    var writable = fs.createWriteStream( 'E:/study/webchat/public/touxiang/'+fields.name+'.jpg' );
                    // 通过管道来传输流
                    readable.pipe( writable );
                    res.send({code:'1',msg:'注册成功'});
                })

            })
        });

        return;
    }
}


exports.login=function(req,res){
    if (req.url == '/login' && req.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
           //console.log(fields)
            User.find({name:fields.name},function(err,result){
                if(err){
                    res.send({code:-3,msg:'登录失败'})
                    return;
                }
                if(result.length==0){
                    res.send({code:-2,msg:'你还没注册'})
                    return;
                }
                if(result[0].password!=fields.password){
                    res.send({code:-1,msg:'密码错误'})
                    return;
                }
                req.session.login=true;
                req.session.name=fields.name;
                res.send({code:1,msg:'登录成功'})
            })
        });

        return;
    }
}

exports.addhaoyou=function(req,res){
    if (req.url == '/addhaoyou' && req.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
          // console.log(fields)
            if(fields.addHaoYouName==req.session.name){
                res.send({code:'-4',msg:'不能添加自己为好友'});
                return;
            }
            User.find({name:fields.addHaoYouName},function(err,result){
                if(err){
                    res.send({code:'-3',msg:'添加好友失败'});
                    return;
                }
                if(result.length==0){
                    res.send({code:'-2',msg:'查无此人'});
                    return;
                }
                User.find({name:fields.name},function(err,result){
                    if(err){
                        res.send({code:'-3',msg:'添加好友失败'});
                        return;
                    }

                    if(objOf(result[0].haoyou,fields.addHaoYouName)==1){
                        res.send({code:'-1',msg:fields.addHaoYouName+'已是你的好友'});
                        return;
                    }

                    var datetime=new Date().toLocaleString();
                    result[0].haoyou.push({hyname:fields.addHaoYouName,hytime:datetime});
                    result[0].save(function(err,result2){
                        if(err){
                            res.send({code:'-3',msg:'添加好友失败'});
                            return;
                        }

                        User.find({name:fields.addHaoYouName},function(err,result3){
                            if(err){
                                res.send({code:'-3',msg:'添加好友失败'});
                                return;
                            }
                            result3[0].haoyou.push({hyname:fields.name,hytime:datetime});
                            result3[0].save();
                        })
                       // console.log(result2)
                        res.send({code:'1',msg:'添加好友成功'});
                    })

                })
            })
        });

        return;
    }
}

exports.sendInfo=function(req,res){
    if (req.url == '/sendInfo' && req.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
           // console.log(fields)
            User.find({name:fields.name},function(err,result){
                if(err){
                    res.send({code:'-3',msg:'发送失败'});
                    console.log(err);
                    return;
                }
                    var index=objIndex(result[0].liantian,fields.sendname)==-1?result[0].liantian.length:objIndex(result[0].liantian,fields.sendname);

                    if(objOf2(result[0].liantian,fields.sendname,'ltname')==-1){
                        result[0].liantian.push({ltname:fields.sendname})
                    }
                    //var weidu=result[0].liantian[index].weidu+1;
                    //result[0].liantian[index].weidu=weidu;
                    result[0].liantian[index].ltcontent.push({ltneiron:fields.content,lttime:fields.time,whosend:fields.name})
                    result[0].save(function(err,result1){
                        if(err){
                            res.send({code:'-3',msg:'发送失败'});
                            console.log(err);
                            return
                        }
                        User.find({name:fields.sendname},function(err,result2){
                            if(err){
                                res.send({code:'-3',msg:'发送失败'});
                                console.log(err);
                                return
                            }
                            var index2=objIndex(result2[0].liantian,fields.name)==-1?result2[0].liantian.length:objIndex(result2[0].liantian,fields.name);
                            //console.log(index)
                            if(objOf2(result2[0].liantian,fields.name)==-1){
                                result2[0].liantian.push({ltname:fields.name})
                            }
                            var weidu2=result2[0].liantian[index2].weidu+1;
                            result2[0].liantian[index2].weidu=weidu2;

                            result2[0].liantian[index2].ltcontent.push({ltneiron:fields.content,lttime:fields.time,whosend:fields.name});
                            result2[0].save();
                        })
                        //console.log(result1);
                        res.send({code:'1',msg:'发送成功'});

                    })


                //console.log(result)
            })

        });

        return;
    }
}

function objOf(arr,str){
    var indexOf=-1;
    for (var i=0;i<arr.length;i++){
        if(arr[i].hyname ==str){
            indexOf= 1;
            return indexOf;
        }
    }
    return indexOf
}

exports.clearweidu=function(req,res){
    if (req.url == '/clearweidu' && req.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            //console.log(fields)
            User.find({name:fields.whoclear},function(err,result){
                if(err){
                    console.log(err);
                    return;
                }

                var index=objIndex(result[0].liantian,fields.clearwho);
                //console.log(result[0].liantian[index].weidu)
                result[0].liantian[index].weidu=0;
                result[0].save(function(err,result2){
                    if(err){
                        console.log(err);
                        return;
                    }
                    //console.log(result[0].liantian[index].weidu);
                    res.send({code:'1'});
                })

                //console.log(index)

            })
        });

        return;
    }
}



exports.temptouxiang=function(req,res){
    if (req.url == '/temptouxiang' && req.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();
        form.uploadDir = __dirname+"/../public/touxiang";
        form.parse(req, function(err, fields, files) {
            var extname=files.file. name
            var filepath=path.extname(extname);
            var oldPath=files.file.path;
            var newPath="E:/study/webchat/public/touxiang/"+req.session.name+'.jpg'
            fs.rename(oldPath, newPath, function(err){
                if(err){
                    console.log('sb');
                    return;
                }
                res.send(newPath)
            })

        });

        return;
    }
}
exports.decliaotian=function(req,res){
    if (req.url == '/decliaotian' && req.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
           // console.log(fields)
            User.find({name:fields.name},function(err,result){
                if(err){
                    res.send({code:'-3',msg:'删除失败'});
                    return;
                }
                var index=objIndex(result[0].liantian,fields.decwho);
                result[0].liantian.splice(index,1);
                result[0].save(function(err,result2){
                    if(err){
                        res.send({code:'-3',msg:'删除失败'});
                        return;
                    }
                    res.send({code:'1',msg:'删除成功'});
                })
                //console.log(result)
                //console.log(index)
            })
        });

        return;
    }
}
exports.dechaoyou=function(req,res){
    if (req.url == '/dechaoyou' && req.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            //console.log(fields)
            User.find({name:fields.name},function(err,result){
                if(err){
                    res.send({code:'-3',msg:'删除失败'})
                    return;
                }
                var hyindex=objhyIndex(result[0].haoyou,fields.decwho);
                var ltndex=objIndex(result[0].liantian,fields.decwho);
                result[0].haoyou.splice(hyindex,1);
                result[0].liantian.splice(ltndex,1);
                result[0].save(function(err,result1){
                    if(err){
                        res.send({code:'-3',msg:'删除失败'})
                        return;
                    }
                    User.find({name:fields.decwho},function(err,result2){
                        if(err){
                            res.send({code:'-3',msg:'删除失败'})
                            return;
                        }
                        var hyindex2=objhyIndex(result2[0].haoyou,fields.name);
                        var ltndex2=objIndex(result2[0].liantian,fields.name);
                        result2[0].haoyou.splice(hyindex2,1);
                        result2[0].liantian.splice(ltndex2,1);
                        result2[0].save(function(err,result3){
                            if(err){
                                res.send({code:'-3',msg:'删除失败'})
                                return;
                            }
                            res.send({code:'1',msg:'删除成功'})
                        })
                    })

                })
                //console.log(hyindex,ltndex)
                //console.log(result)

            })
        });

        return;
    }
}
function objOf2(arr,str){
    var indexOf=-1;
    for (var i=0;i<arr.length;i++){
        if(arr[i].ltname ==str){
            indexOf= 1;
            return indexOf;
        }
    }
    return indexOf
}
function objIndex(arr,str){
    var indexOf=-1;
    for (var i=0;i<arr.length;i++){
        if(arr[i].ltname==str){
            indexOf= i;
            return indexOf;
        }
    }
    return indexOf
}

function objhyIndex(arr,str){
    var indexOf=-1;
    for (var i=0;i<arr.length;i++){
        if(arr[i].hyname==str){
            indexOf= i;
            return indexOf;
        }
    }
    return indexOf
}

