// require("dotenv").config(); 
const express = require("express"); 


const app = express(); 
const PORT = 3000; 

app.get("/", (req, res)=>{
    res.json({
        status : 200, 
        success : true, 
        message : "Welcome to home route"
    })
})

app.listen(PORT, function(){
    console.log("SERVER RUNNING AT PORT -> ", PORT);
})