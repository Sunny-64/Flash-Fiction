const mongoose = require("mongoose"); 

const categorySchema = new mongoose.Schema({
    name : {type : String, default : ""}, 
    // image : {type : String, default : ""},
    // createdBy : {type : String, default : ""}, 
    createdAt : {type : Date, default : Date.now()},
    updatedAt : {type : Date}
})

module.exports = mongoose.model("Category", categorySchema); 