const mongoose = require("mongoose"); 

const readingListSchema = new mongoose.Schema({
    customerId : {type : mongoose.Schema.Types.ObjectId}, 
    listName : {type : String}, 
    totalItems : {type : Number, default : 0}, 
    stories : [
        {
            storyId : {type : mongoose.Schema.Types.ObjectId, ref : 'Post',}, 
            addedOn : {type : Date}
        }
    ],
    createdAt : {type : Date, default : Date.now()}
})

module.exports = new mongoose.model("ReadingList", readingListSchema); 



