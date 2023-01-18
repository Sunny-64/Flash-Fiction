require("dotenv").config(); 

const express = require("express"); 
const dbConfig = require("./config/dbConfig"); 

const app = express(); 
const PORT = process.env.PORT; 

// Middlewares
app.use(express.urlencoded({extended : true})); 



// // Routes
app.get("/", (req, res)=>{
    res.json({
        status : 200, 
        success : true, 
        message : "Welcome to home route"
    })
})

// Admin Route
const adminRoutesPath = require("./routes/admin_routes/adminRoutes.js"); 
app.use("/admin", adminRoutesPath); 

// User Route
const userRoutePath = require("./routes/user_routes/userRoutes.js"); 
app.use("/user", userRoutePath); 


// Seeding admin everytime the project starts.

const seed = require("./common/seed"); 


app.listen(PORT, function(){
    console.log("SERVER RUNNING AT PORT -> ", PORT);
})