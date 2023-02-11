const mongoose = require("mongoose"); 

const customerSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId},
    profilePicture : {type : String, default : "default-profile-icon.png"}, 
    name : {type : String, required : true}, 
    email : {type : String, required : true, unique : true}, 
    countryCode : {type : String, required : true},
    mobile : {type : String, required : true, unique : true},
    dob : {type : Date}, 
    gender : {type : String, required : true},
    state : {type : String, required : true}, 
    country : {type : String, required : true}, 
    address : {type : String, required : true}, 
    numberOfPosts : {type : Number, default : 0},
    favCategories : [mongoose.Schema.Types.ObjectId], 
    followingCount : {type : Number, default : 0}, 
    followerCount : {type : Number, default : 0}, 
    reportsCount : {type : Number, default : 0},
    readingListCount : {type : Number, default : 0},

    isBlocked : {type : Boolean, default : false}, 

    createdAt : {type : Date, default : Date.now()},
    updatedAt : {type : Date},
    // updatedBy : {type : }
})

module.exports = mongoose.model("Customer", customerSchema); 