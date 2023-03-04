const mongoose = require("mongoose"); 

// saves individual message good for querying in two different databases. 
/* //  alternate chat mode 

    const chatSchema = new mongoose.Schema({
    participants : [user1, user2], 
    messages : {
        senderId : {type : mongoose.Schema.Types.ObjectId}, 
        message : {type : String}, 
        createdAt : {type : Date, default : Date.now()}
    }
    createdAt : {type : Date, default : Date.now()}
}) 
*/
const chatSchema = new mongoose.Schema({
    senderId : {type : mongoose.Schema.Types.ObjectId}, 
    recipientId : {type : mongoose.Schema.Types.ObjectId}, 
    message : {type : String}, 

    createdAt : {type : Date, default : Date.now()}
})

module.exports = new mongoose.model("Chat", chatSchema); 