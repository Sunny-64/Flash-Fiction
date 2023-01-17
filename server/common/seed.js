const mongoose = require("mongoose"); 
const bcrypt = require("bcrypt"); 


const adminSchema = new mongoose.Schema({
    email : {type : String},
    password : {type : String}, 
    isAdmin : {type : Boolean, default : true}, 
    createdAt : {type : Date, default : Date.now()}
}); 

const Admin = mongoose.model("Admin", adminSchema); 

const adminObj = new Admin({
    email : process.env.ADMIN_EMAIL, 
    password : bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10), 
    isAdmin : true, 
})

Admin.findOne({email : adminObj.email})
.then(data => {
    if(data == null){
        let adminObj2 = new Admin(adminObj); 
        adminObj.save()
        .then(res => {
            console.log("Admin Registered successfully"); 
        })
        .catch(err=>{
            console.log("Error : ", err); 
        })
    }
})
.catch(err =>{
    console.log("Error : ", err); 
})