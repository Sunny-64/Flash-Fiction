const Customer = require("./customerModel");
const User = require("./../user/userModel");
const Post = require("./../post/postModel");
const Review = require("./../post/review/reviewModel");
const Follow = require("./follower/followerModel");
const fs = require("fs");
const path = require("path");
// Universal

exports.showAllCustomers = (req, res) => {
  Customer.find({ isBlocked: false })
    .then((data) => {
      if (data != null) {
        res.json({
          status: 200,
          success: true,
          message: "Successfully fetched all users",
          total_results: data.length,
          data: data,
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 400,
        success: false,
        message: "Error while fetching users",
        error: err,
      });
    });
};

exports.showSingleCustomer = (req, res) => {
  const customerId = req.params.customerId;
  Customer.findOne({ _id: customerId })
    .then((data) => {
      if (data != null) {
        res.json({
          status: 200,
          success: true,
          message: "Successfully fetched User",
          total_results: data.length,
          data: data,
        });
      } else {
        res.json({
          status: 400,
          success: true,
          message: "User id missing",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 400,
        success: false,
        message: "Error while fetching user",
        error: err,
      });
    });
};

// delete customer
exports.deleteCustomer = async (req, res) => {
  // user and customer both will be deleted from here
  const customerId = req.params.customerId;
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
    customerId,
  } = req.body;
  if (req.body === undefined) {
    res.json({
      status: 400,
      success: false,
      message: "Invalid Data",
    });
  } else {
    try {
      const customerData = await Customer.findOne({ _id: customerId });
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
  const { followedTo, followedBy } = req.body;
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
  const {customerId, unfollowCustomerId} = req.body; 
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
// block other users

// report user

// reading list / wishlist

// only for Admin

exports.blockCustomer = (req, res) => {
  const customerId = req.body.customerId;
  if (customerId == undefined) {
    res.json({
      status: 200,
      success: true,
      message: "Provide customer id",
    });
  } else {
    Customer.findOne({ _id: customerId })
      .then((data) => {
        if (data != null) {
          data.isBlocked = true;
          data
            .save()
            .then((response) => {
              User.findOne({ _id: response.userId })
                .then((userData) => {
                  if (userData != null) {
                    userData.status = false;
                    res.json({
                      status: 200,
                      success: true,
                      message: "Successfully blocked the customer",
                      total_results: data.length,
                      data: data,
                    });
                  } else {
                    res.json({
                      status: 200,
                      success: true,
                      message: "No Data found.",
                    });
                  }
                })
                .catch((err) => {
                  res.json({
                    status: 400,
                    success: false,
                    message: "There was an error",
                    error: err,
                  });
                });
            })
            .catch((err) => {
              res.json({
                status: 400,
                success: false,
                message: "There was an error",
                error: err,
              });
            });
        } else {
          res.json({
            status: 200,
            success: true,
            message: "No Data found.",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: 400,
          success: false,
          message: "There was an error",
          error: err,
        });
      });
  }
};

exports.getBlockedCustomers = (req, res) => {
  Customer.find({ isBlocked: true })
    .then((data) => {
      if (data != null) {
        res.json({
          status: 200,
          success: true,
          message: "Successfully Fetched All blocked customers",
          total_results: data.length,
          data: data,
        });
      } else {
        res.json({
          status: 200,
          success: true,
          message: "No Data found.",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 400,
        success: false,
        message: "There was an error while fetching customers",
        error: err,
      });
    });
};

exports.getAllCustomers = (req, res) => {
  Customer.find()
    .then((data) => {
      if (data != null) {
        res.json({
          status: 200,
          success: true,
          message: "Successfully Fetched All blocked customers",
          total_results: data.length,
          data: data,
        });
      } else {
        res.json({
          status: 200,
          success: true,
          message: "No Data found.",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 400,
        success: false,
        message: "There was an error while fetching customers",
        error: err,
      });
    });
};
