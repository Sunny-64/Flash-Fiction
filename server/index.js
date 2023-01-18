require("dotenv").config(); 

const express = require("express"); 
const dbConfig = require("./config/dbConfig"); 

const app = express(); 
const PORT = process.env.PORT; 

// MIDDLEWARES
app.use(express.urlencoded({extended : true})); 


// ROUTES
app.get("/", (req, res)=>{
    res.json({
        status : 200, 
        success : true, 
        message : "Welcome to home route"
    })
})

// ADMIN ROUTE
const adminRoutesPath = require("./routes/admin_routes/adminRoutes.js"); 
app.use("/admin", adminRoutesPath); 

// USER ROUTE
const userRoutePath = require("./routes/user_routes/userRoutes.js"); 
app.use("/user", userRoutePath); 


// SEEDING ADMIN everytime the project starts.

const seed = require("./common/seed"); 




app.listen(PORT, function(){
    console.log("SERVER RUNNING AT PORT -> ", PORT);
})