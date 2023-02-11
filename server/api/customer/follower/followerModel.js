const mongoose = require("mongoose"); 

const followerSchema = new mongoose.Schema({
    followedTo : {type : mongoose.Schema.Types.ObjectId, required : true}, 
    followedBy : {type : mongoose.Schema.Types.ObjectId, required : true}, 
    createdAt : {type : Date, default : Date.now()}, 
})

module.exports = new mongoose.model("Follow", followerSchema);