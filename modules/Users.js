/**
 * Created by Administrator on 2017/7/17 0017.
 */
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    name: String,
    password:String,
    //nicheng:{type:String,default:''},
    haoyou:[{hyname:String,hytime:String}],
    liantian:[
        {
            ltname:String,
            weidu:{type:Number,default:0},
            ltcontent:[
                {
                    ltneiron:String,
                    lttime:String,
                    whosend:String
                }
            ]
        }
    ],
    shuoshuo:[
        {
            sscontent:String,
            sstime:String,
            sszan:[
                {zanname:String}
            ],
            pinglun:[{plname:String,plcontent:String}]
        }
    ]
});
var User = mongoose.model('user', userSchema);

module.exports=User;