const mongoose = require("mongoose"); 

mongoose.set("strictQuery", false); 
const url = process.env.MONGODB_URI; 
mongoose.connect(url)
.then(data => {
    console.log("Database connected"); 
})
.catch(err=>{
    console.log("There was an Error when connecting to database : ", err); 
})