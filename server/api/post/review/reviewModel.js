const mongoose = require("mongoose"); 

const reviewSchema = new mongoose.Schema({
    customerId : {type : mongoose.Schema.Types.ObjectId},
    postId : {type : mongoose.Schema.Types.ObjectId},
    rating : {type : Number},
    review : {type : String, default : null}, 

    status : {type : Boolean, default : false}, 
    createdAt : {type : Date, default : Date.now()}, 
    updatedAt : {type : Date}
})

module.exports = new mongoose.model("Review", reviewSchema); 