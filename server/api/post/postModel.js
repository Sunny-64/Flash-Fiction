const mongoose = require("mongoose"); 

const postSchema = new mongoose.Schema({
    customerId : {type : mongoose.Schema.Types.ObjectId}, 
    title : {type : String, required : true},
    story : {type : String, required : true}, 
    description : {type : String, required : true}, 
    coverImage : {type : String, default : ""},
    rating : {type : Number, default : 0}, 
    reviewCount : {type : Number, default : 0}, 
    shareCount : {type : Number, default : 0}, 
    categoryId : {type : mongoose.Schema.Types.ObjectId}, 
    reportsCount : {type : Number, default : 0}, 

    isCustomerBlocked : {type : Boolean, default : false},
    // isPrivate : {type : Boolean, default : false},
    // isPostDraft
    status : {type : Boolean, default : false},
    createdAt : {type : Date, default : Date.now()}, 
    updatedAt : {type : Date, default : Date.now()}, 
    updatedBy : {type : String}
})

module.exports = mongoose.model("Post", postSchema); 