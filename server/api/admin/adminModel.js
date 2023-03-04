const mongoose = require("mongoose"); 

const adminSchema = new mongoose.Schema({
    email : {type : String, required : true, unique : true},
    password : {type : String}, 
    isAdmin : {type : Boolean, default : true}, 
    noOfCategoriesCreated : {type : Number, default : 0}, 
    noOfUsersBlocked : {type : Number, default : 0}, 

    loginLogs : [
        {
            ip : {type : String}, 
            loginTime : {type : Date}, 
            isLoggedInSuccessfully : {type : Boolean}
        }
    ],
    createdAt : {type : Date, default : Date.now()}
}); 

module.exports = new mongoose.model("Admin", adminSchema); 