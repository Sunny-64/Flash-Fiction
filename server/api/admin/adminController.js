const mongoose = require("mongoose"); 
const Admin = require("./adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
// login function
exports.adminLogin = async (req, res) => {
     const {email, password} = req.body; 
     if(email === undefined || password === undefined){
        res.json({status : 400, message : "email or password is not valid"}); 
     }
     else{
        try{
            const admin = await Admin.findOne({email : email}); 
            if(admin !== null){
                if(bcrypt.compareSync(password, admin.password)){
                    const loginObj = {
                        ip : req.ip, 
                        loginTime : Date.now(), 
                        isLoggedInSuccessfully : true
                    }
                    admin.loginLogs.push(loginObj); 
                    const saveLogs = await admin.save();
                    const payload = saveLogs.toJSON();  
                    const token = jwt.sign(payload, process.env.ADMIN_TOKEN_SECRET_KEY); 
                    res.json({
                        status : 200, 
                        success : true, 
                        message : "Admin logged in successfully", 
                        token : token
                    })
                }
                else{
                    res.json({
                        status : 400, 
                        success : false, 
                        message : "Email or password is wrong"
                    })
                }
            }
        }
        catch(err){
            res.json({status : 500, error : err.message}); 
        }
     }
}