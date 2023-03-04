const bcrypt = require("bcrypt"); 
const Admin = require("./../api/admin/adminModel"); 

const adminObj = new Admin({
    email : process.env.ADMIN_EMAIL, 
    password : bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10), 
    isAdmin : true, 
})

Admin.findOne({email : adminObj.email})
.then(data => {
    if(data == null){
        let adminObj2 = new Admin(adminObj); 
        adminObj2.save()
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