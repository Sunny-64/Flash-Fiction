const mongoose = require("mongoose"); 

const userSchema = new mongoose.Schema({
    name : {type : String, default: ""}, 
    email : {type : String, default : ""}, 
    password : {type : String, default : ""}, 
    countryCode : {type : String , default : ""},
    mobile : {type : String, default : ""}, 

    loginLogs : [{
        ip : {type : String, default : ""}, 
        loginTime : {type : Date , default : Date.now()}, 
        isLoggedInSuccessfully : {type : Boolean}
    }],
    
    status : {type : Boolean, default : true}, 
    createdAt : {type : Date, default : Date.now()}, 
    updatedAt : {type : Date}
})


module.exports = mongoose.model("User", userSchema); 