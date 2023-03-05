const Customer = require("./../customer/customerModel");
const ReadingList = require("./readingListModel");

exports.createReadingList = async (req, res) => {
  const customerId = req.decodedUser._id;
  const { listName } = req.body;

  try {
    const customer = await Customer.findOne({ _id: customerId });
    const readingList = await ReadingList.findOne({ listName: listName });
    if (customer === null) {
      // if customer does not exist
      res.json({ status: 404, success: false, message: "customer not found" });
    } else if (readingList !== null) {
      res.json({ status: 400, success: false, message: "List already exist" });
    } else {
      // if customer exists
      const readingListObj = new ReadingList();
      readingListObj.customerId = customerId;
      readingListObj.listName = listName;

      // save reading list
      const saveReadingList = await readingListObj.save();

      // update the reading list count
      customer.readingListCount += 1;
      await customer.save();
      res.json({
        status: 200,
        success: true,
        message: "Reading list created",
        data: saveReadingList,
      });
    }
  } catch (err) {
    res.json({ status: 500, success: false, message: err.message });
  }
};

exports.showReadingListsOfACustomer = async (req, res) => {
  const customerId = req.decodedUser._id;
  try {
    const customer = await Customer.findOne({ _id: customerId });
    if (customer !== null) {
      const readingLists = await ReadingList.find({ customerId: customerId }).populate("stories.storyId");
      const totalResults = await ReadingList.find({customerId: customerId,}).countDocuments();
      res.json({
        status: 200,
        success: true,
        message: "Reading lists of user",
        totalResults: totalResults,
        data: readingLists,
      });
    } else {
      res.json({ status: 400, success: false, message: "Customer not found" });
    }
  } catch (err) {
    res.json({ status: 500, success: false, error: err.message });
  }
};

exports.deleteReadingList = async (req, res) => {
  const customerId = req.decodedUser._id; 
  const {listId} = req.body; 
  try{
    const customer = await Customer.findOne({_id : customerId}); 
    if(customer === null){
      res.json({status : 400, success : false, message : "Customer not found"}); 
    }
    else{
      const readingList = await ReadingList.findOne({_id : listId}); 
      if(readingList === null){
        res.json({status : 404, success : false, message : "Reading list not found"}); 
      }
      else{
        const deleteList = await ReadingList.deleteOne({_id : listId}); 
        res.json({status : 200, success : true, message : "List deleted successfully"});
      }
    }
  }catch(err){
    res.json({status : 500, success : false, error : err.message}); 
  }
}


// stories items
exports.addItemInReadingList = async (req, res) => {
  const customerId = req.decodedUser._id;
  const { storyId, listId } = req.body;
  const customer = await Customer.findOne({ _id: customerId });

  try {
    if (customer === null) {
      // if customer does found
      res.json({ status: 404, success: false, message: "customer not found" });
    } else {
      // if customer found
      // find if reading list exist
      const readingList = await ReadingList.findOne({ _id: listId });
      if (readingList === null) {
        // if reading list found
        res.json({ status: 404, success: false, message: "List not found" });
      } else {
        // list obj
        const storyExists = await readingList.stories.find(story => story.storyId.equals(storyId)); 
        if(!storyExists){
        
        const listItemObj = {
          storyId: storyId,
          addedOn: Date.now(),
        };
        // add reading items into the array
        readingList.stories.push(listItemObj);
        readingList.totalItems += 1;
        // save reading list
        const saveReadingList = await readingList.save();
        res.json({
          status: 200,
          success: true,
          message: "Story added in the list",
          data: saveReadingList,
        });
      }
      else{
        res.json({status : 400, success : false, message : "Story already exists"});
      }
      }
    }
  } catch (err) {
    res.json({ status: 500, success: false, error: err.message });
  }
};

exports.removeItemFromReadingList = async (req, res) => {
  const customerId = req.decodedUser._id; 
  const {storyId, listId} = req.body; 
  try{
    const readingList = await ReadingList.findOne({_id : listId}); 
    const readingListItem = await ReadingList.aggregate([
      {
        '$unwind': {
          'path': '$stories'
        }
      }, {
        '$match': {
          'stories.storyId': storyId
        }
      }
    ])
    if(readingList && readingListItem === null){
      res.json({status : 404, success : false, message : "item not found"}); 
    }
    else{
      const deleteItem = await ReadingList.updateOne(
        { _id : listId}, 
        {$pull : {stories : {storyId : storyId}},  $inc : {totalItems : -1}}
      ); 
      res.json({status : 200, success : true, message : "story removed successfully"}); 
    }
  }catch(err){
    res.json({status : 500, success : false, error : err.message}); 
  }
}