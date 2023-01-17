require("dotenv").config(); 

const express = require("express"); 
const dbConfig = require("./config/dbConfig"); 



const app = express(); 
const PORT = process.env.PORT; 

app.get("/", (req, res)=>{
    res.json({
        status : 200, 
        success : true, 
        message : "Welcome to home route"
    })
})

// Routes
const adminRoutesPath = require("./routes/adminRoutes.js"); 
app.use("/admin", adminRoutesPath); 



const seed = require("./common/seed"); 


app.listen(PORT, function(){
    console.log("SERVER RUNNING AT PORT -> ", PORT);
})