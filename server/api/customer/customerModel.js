const mongoose = require("mongoose"); 

const customerSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId},
    name : {type : String, default : ""}, 
    email : {type : String, default : ""}, 
    mobile : {
        type : String, 
        default : "", 
        isPrivate : {type : Boolean, default : false}
    },
    dob : {
        type : Date, 
        isPrivate : {type : Boolean, default : false}
    }, 
    gender : {type : String, default : ""},
    state : {type : String, default : ""}, 
    country : {type : String, default : ""}, 
    address : {
        type : String, 
        default : "",
        isPrivate : {type : Boolean, default : false}    
    }, 
    numberOfPosts : {type : Number, default : 0},
    favCategories : [{categoryId : mongoose.Schema.Types.ObjectId}], 
    followingCount : {type : Number, default : 0}, 
    followerCount : {type : Number, default : 0}, 
    readingListCount : {type : Number, default : 0}
})

module.exports = mongoose.model("Customer", customerSchema); 