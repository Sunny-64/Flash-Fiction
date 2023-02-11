require("dotenv").config(); 
const express = require("express"); 
const dbConfig = require("./config/dbConfig"); 
const colors = require('colors')

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
const adminRoutesPath = require("./routes/adminRoutes.js"); 
app.use("/admin", adminRoutesPath); 

// USER ROUTE
const userRoutesPath = require("./routes/userRoutes.js"); 
app.use("/user", userRoutesPath); 

// CUSTOMER ROUTE
const customerRoutesPath = require("./routes/customerRoutes"); 
app.use("/customer",customerRoutesPath)

// POST ROUTE
const postRoutesPath = require("./routes/postRoutes");
app.use("/post", postRoutesPath); 


// SEEDING ADMIN everytime the project starts.
const seed = require("./common/seed"); 
// Seeding dummy users
const SeedDummyUser = require("./common/seedDummyUsers"); 



app.listen(PORT, function(){
    console.log(`SERVER RUNNING AT PORT -> ${PORT} `.bgGreen.bold);
})