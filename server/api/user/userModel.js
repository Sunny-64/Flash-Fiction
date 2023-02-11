const mongoose = require("mongoose"); 

const userSchema = new mongoose.Schema({
    name : {type : String, default: "", required : true}, 
    email : {type : String, default : "", required : true, unique : true}, 
    password : {type : String, default : "", required : true}, 
    countryCode : {type : String , default : "", required : true},
    mobile : {type : String, default : "", required : true, unique : true}, 

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