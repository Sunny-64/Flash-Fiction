const Customer = require("./customerModel");
const User = require("./../user/userModel");
const Post = require("./../post/postModel");
const Review = require("./../post/review/reviewModel");
const Follow = require("./follower/followerModel");
const fs = require("fs");
const path = require("path");
// Universal

exports.showAllCustomers = async (req, res) => {
  try{
    const customersData = await Customer.find({ isBlocked: false }); 
    const total_results = await Customer.find({ isBlocked: false }).countDocuments(); 
    if (customersData != null) {
      res.json({
        status: 200,
        success: true,
        message: "Successfully fetched all users",
        total_results: total_results,
        data: customersData,
      });
    }
    else{
      res.json({
        status : 404, 
        success : false, 
        message : "Customers not found", 
      })
    }
  }catch(err){
    res.json({
      status : 500, 
      success : false, 
      message : "error " + err
    })
  }
};

exports.showSingleCustomer = async (req, res) => {
  const customerId = req.params.customerId;
  try{
    const customer = await Customer.findOne({ _id: customerId }); 
    if(customer === null){
      res.json({status : 400, success : false, messsage : "User does not exist"}); 
    }
    else{
      res.json({status : 200, success : true, message : "customer found", data : customer}); 
    }
    
  }
  catch(err){
    res.json({status : 500, success : false, error : err.message}); 
  }
}

// never delete the user ** this api is for testing purposes 
// delete customer
exports.deleteCustomer = async (req, res) => {
  // user and customer both will be deleted from here
  const customerId = req.decodedUser._id;
  try {
    const customerData = await Customer.findOne({ _id: customerId });
    if (customerData === null) {
      res.json({
        status: 404,
        success: false,
        message: "Customer not found",
      });
    } else {
      // delete all of the user's activity
      const deletedPosts = await Post.deleteMany({ _id: customerId });
      const deletedReviews = await Review.deleteMany({ _id: customerId });
      const deletedCustomer = await Customer.deleteOne({ _id: customerId });
      const deletedUser = await User.deleteOne({ _id: customerData.userId });
      if (
        deletedCustomer.deletedCount === 1 &&
        deletedUser.deletedCount === 1
      ) {
        data = {
          deletedPostStatus: deletedPosts,
          deletedReviewsStatus: deletedReviews,
          deletedCustomerStatus: deletedCustomer,
          deletedUserStatus: deletedUser,
        };
        res.json({
          status: 200,
          success: true,
          message: "User deleted successfully",
          data: data,
        });
      } else {
        res.json({
          status: 400,
          success: false,
          message: "Failed to delete user",
        });
      }
    }
  } catch (err) {
    res.json({
      status: 500,
      success: false,
      message: "There was an error " + err,
      err,
    });
  }
};

// update customer
exports.updateCustomer = async (req, res) => {
  const {
    name,
    countryCode,
    mobile,
    dob,
    gender,
    state,
    country,
    address,
  } = req.body;
  if (req.body === undefined) {
    res.json({
      status: 400,
      success: false,
      message: "Invalid Data",
    });
  } else {
    try {
      const customerData = await Customer.findOne({ _id: req.decodedUser._id });
      if (customerData === null) {
        res.json({
          status: 404,
          success: false,
          message: "Customer not found",
        });
      } else {
        customerData.name = name === undefined ? customerData.name : name;
        // customerData.countryCode = countryCode === undefined ? customerData.countryCode : countryCode;
        // customerData.mobile = mobile === undefined ? customerData.mobile : mobile;
        customerData.dob = dob === undefined ? customerData.dob : dob;
        customerData.gender =
          gender === undefined ? customerData.gender : gender;
        customerData.state = state === undefined ? customerData.state : state;
        customerData.country =
          country === undefined ? customerData.country : country;
        customerData.address =
          address === undefined ? customerData.address : address;
        if (req.file !== undefined) {
          let prevProfileImg = postObj.coverImage;
          if (
            fs.existsSync(
              path.join(__dirname + "/../../public/user/" + prevProfileImg)
            )
          ) {
            fs.rmSync(
              path.join(__dirname + "/../../public/user/" + prevProfileImg)
            );
          }
          customerData.profilePicture = req.file.filename;
        } else {
          customerData.profilePicture = customerData.profilePicture;
        }
        customerData.updatedAt = Date.now();
        const updatedCustomerData = await customerData.save();
        res.json({
          status: 200,
          success: true,
          message: "customer data updated",
          data: updatedCustomerData,
        });
      }
    } catch (err) {
      res.json({
        status: 500,
        success: false,
        message: "There was an err " + err,
        error: err,
      });
    }
  }
};

// follow

exports.followCustomer = async (req, res) => {
  const followedBy = req.decodedUser._id
  const { followedTo } = req.body;
  if (followedBy === followedTo) {
    res.json({
      status: 400,
      success: false,
      message: "Invalid follow request",
    });
  } else {
    try {
      const followData = await Follow.findOne({
        followedBy: followedBy,
        followedTo: followedTo,
      });
      if (followData !== null) {
        res.json({
          status: 400,
          success: false,
          message: "User has already been followed",
        });
      } else {
        // find the followed to user
        const followedToCustomer = await Customer.findOne({
          _id: followedTo,
        });

        const followedByCustomer = await Customer.findOne({
          _id: followedBy,
        });

        // check if customer exist
        if (followedByCustomer === null && followedToCustomer === null) {
          res.json({
            status: 400,
            success: false,
            message: "Customer does not exist",
          });
        }
        // check if customer exist
        if (followedByCustomer === null && followedToCustomer === null) {
          res.json({
            status: 400,
            success: false,
            message: "Customer does not exist",
          });
        } else {
          // create new follow obj
          const followObj = new Follow();
          followObj.followedBy = followedBy;
          followObj.followedTo = followedTo;

          const saveFollowObj = await followObj.save();

          // find the current following count of followed by customer
          const customerFollowingCount = await Follow.find({
            followedBy: followedByCustomer._id,
          }).count();

          // find the current follower count of followed to customer
          const customerFollowerCount = await Follow.find({
            followedTo: followedToCustomer._id,
          }).count();

          // increase the customer followed by's following count by 1
          followedByCustomer.followingCount = customerFollowingCount;

          // increase the customer followed to's follower count by 1
          followedToCustomer.followerCount = customerFollowerCount;

          // save the updated results
          const updateFollowedByCustomer = await followedByCustomer.save();
          const updateFollowedToCustomer = await followedToCustomer.save();
          res.json({
            status: 200,
            success: true,
            message: "Followed Back successfully",
          });
        }
      }
    } catch (err) {
      res.json({
        status: 500,
        success: false,
        message: "There was an error " + err,
        err,
      });
    }
  }
};

exports.unfollowCustomer = async (req, res) => {
  const customerId = req.decodedUser._id; 
  const {unfollowCustomerId} = req.body; 
  if(customerId === unfollowCustomerId){
    res.json({
      status : 400, 
      success : false, 
      message : "Invalid customer"
    })
  }
  else{
  try{
    const findFollowObj = await Follow.findOne({followedBy : customerId, followedTo : unfollowCustomerId}); 
    if(findFollowObj === null){
      res.json({
        status : 404, 
        success : false, 
        message : "User not followed"
      })
    }
    else{
      const deleteFollowObj = await Follow.deleteOne({followedBy : customerId, followedTo : unfollowCustomerId}); 
      if(deleteFollowObj.deletedCount === 1){
        res.json({
          status : 200, 
          success : true,
          message : "unfollowed successfully", 
          data : deleteFollowObj
        })
      }
      else{
        res.json({
          status : 400, 
          success : false, 
          message : "Failed to unfollow", 
        })
      }
    }
  } catch(err) {
    res.json({
      status: 500,
      success: false,
      message: "There was an error " + err,
      err,
    });
  }
}
}

// reading list / wishlist

// block other users

// report user

// only for Admin

exports.blockCustomer = async (req, res) => {
  const customerId = req.body.customerId;
  try{
    if (customerId == undefined) {
      res.json({
        status: 200,
        success: true,
        message: "Provide customer id",
      });
    }
    else{
      const customerData = await Customer.findOne({ _id: customerId });
      if(customerData !== null){
        const userData = await User.findOne({_id : customerData.userId}); 
        if(userData !== null){
          userData.status = false; 
          userData.isBlocked = true; 
          customerData.status = false;  
          customerData.isBlocked = true; 
          const updatedUser = await userData.save(); 
          const updatedCustomer = await customerData.save(); 
          res.json({
            status : 200, 
            success : true, 
            message : "Successfully blocked the user", 
            data : updatedCustomer
          })
        }
        else{
          res.json({
            status : 404, 
            success : false, 
            message : "User not found"
          })
        }
      }
      else{
        res.json({
          status : 404, 
          success : false, 
          message : "user not found"
        })
      }
    }
  } 
  catch(err){
    res.json({
      status : 500, 
      success : false, 
      message : "There was an error"
    })
  }
};

exports.getBlockedCustomers = async (req, res) => {
  try{
    const blockedCustomers = await Customer.find({ isBlocked: true }); 
    const total_results = await Customer.find({ isBlocked: true }).countDocuments();
    if(blockedCustomers === null){
      res.json({status: 400, success: true,
        message: "No Data found.",
      });
    }
    else{
      res.json({
        status : 200, success : true, 
        message : "Blocked customers list", 
        total_results : total_results,
        data : blockedCustomers, 
      })
    }
  }
  catch(err){
    console.log(err); 
    res.json({
      status : 500, 
      success : false, 
      message : err
    })
  }
}

exports.getAllCustomers = async (req, res) => {
  try{
    const getCustomers = await Customer.find()
    const total_results = await Customer.countDocuments(); 
    if(getCustomers !== null){
      res.json({
        status: 200,
        success: true,
        message: "Successfully Fetched All blocked customers",
        total_results: total_results,
        data: getCustomers,
      });
    }
    else {
      res.json({
        status: 400,
        success: true,
        message: "No Data found.",
      });
    }
  }
  catch(err){
    console.log(err) 
    res.json({
      status : 500, 
      success : false, 
      message : "error " + err
    })
  }
}
