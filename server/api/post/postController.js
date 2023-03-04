const Customer = require("./../customer/customerModel");
const Post = require("./postModel");
const Review = require("./review/reviewModel");
const path = require("path");
const fs = require("fs");

// Add Post
exports.addPost = async (req, res) => {
  // , coverImage
  const customerId = req.decodedUser._id
  const { title, story, description, categoryId } = req.body;
  // console.log(customerId)
  if (req.body === undefined) {
    res.json({
      status: 400,
      success: false,
      message: "No Data provided",
    });
  }
  // create new object of Post model
  const postObj = new Post();
  postObj.title = title;
  postObj.story = story;
  postObj.description = description;
  postObj.categoryId = categoryId;
  postObj.customerId = customerId;
  // postObj.coverImage = req.file.filename === undefined ? "" : req.file.filename;
  try {
    // Save post
    const post = await postObj.save();
    // find the owner of the post
    const customer = await Customer.findOne({ _id: customerId });
    // console.log(customer)
    if (customer === null) {
      res.json({
        status: 404,
        success: false,
        message: "Customer not found",
      });
    } else {
      customer.numberOfPosts++;
      // save the updated values
      const updatedCustomer = await customer.save();
      res.json({
        status: 200,
        success: true,
        message: "Post added successfully",
        data: post,
      });
    }
  } catch (err) {
    res.json({
      status: 500,
      success: false,
      message: "Post failed ",
      err,
    });
  }
};

// Delete a post
// add customer verification
exports.deletePost = async (req, res) => {
  const postId = req.params.postId;
  try {
    // check if post exists
    const post = await Post.findOne({ _id: postId });
    if (post === null) {
      res.json({
        status: 404,
        success: false,
        message: "Post not found",
      });
    } else {
      // find the post owner
      const customer = await Customer.findOne({ _id: post.customerId });
      if (customer === null) {
        res.json({
          status: 404,
          success: false,
          message: "Customer not found",
        });
      } else {
        customer.numberOfPosts--;
        // delete post if the owner found
        const deletedPost = await Post.deleteOne({ _id: postId });
        // delete count is 1 if the post is deleted
        if (deletedPost.deletedCount === 1) {
          // update the no. of post
          const deletedReviews = await Review.deleteMany({postId : postId});
          
          const updatedCustomer = await customer.save();
          if (updatedCustomer != null) {
            res.json({
              status: 200,
              success: true,
              message: "post deleted successfully",
              data: deletedPost,
              deletedReviews : deletedReviews
            });
          } else {
            res.json({
              status: 400,
              success: false,
              message: "customer update failed",
            });
          }
        }
      }
    }
  } catch (err) {
    res.json({
      status: 500,
      success: false,
      message: "Error while saving " + err,
    });
  }
};

// shows all the posts
exports.showAllPosts = async (req, res) => {
  try {
    // find the post
    const posts = await Post.find();
    // if posts is not empty
    if (posts != null) {
      res.json({
        status: 200,
        success: true,
        message: "Fetched all posts",
        data: posts,
      });
    } else {
      res.json({
        status: 404,
        success: false,
        message: "Posts not found",
      });
    }
  } catch (err) {
    res.json({
      status: 400,
      success: false,
      message: "Failed to fetch data",
      err,
    });
  }
};

// Show single user

exports.showSinglePost = async (req, res) => {
  // for finding any single post also make a check if data is not null
  const postId = req.params.postId;
  try {
    // find post
    const post = await Post.findOne({ _id: postId });
    // check if it exists
    if (post != null) {
      res.json({
        status: 200,
        success: true,
        message: "Fetched all posts",
        data: post,
      });
    } else {
      res.json({
        status: 404,
        success: false,
        message: "Not Found",
      });
    }
  } catch (err) {
    res.json({
      status: 500,
      success: false,
      message: "Failed to fetch data ",
      err,
    });
  }
};

// post update api

exports.updatePost = async (req, res) => {

  const customerId = req.decodedUser._id
  const { title, story, description, categoryId } = req.body;
  if (req.body === undefined || req.body === null) {
    res.json({
      status: 400,
      success: false,
      message: "No Data provided",
    });
  }
  if (req.params === undefined || req.params === null) {
    res.json({
      status: 400,
      success: false,
      message: "Post Id missing",
    });
  }
  // create new object of Post model
  const postObj = await Post.findOne({ _id: req.params.postId });
  if (postObj === null) {
    res.json({
      status: 404,
      success: false,
      message: "post not found",
    });
  } else {
    postObj.title = title === undefined ? postObj.title : title;
    postObj.story = story === undefined ? postObj.story : story;
    postObj.description = description === undefined ? postObj.description : description;
    postObj.categoryId = categoryId === undefined ? postObj.categoryId : categoryId;
    postObj.customerId = customerId === undefined ? postObj.customerId : customerId;
    postObj.updatedAt = Date.now();
    postObj.updatedBy = "user";
    if (req.file !== undefined) {
      let prevPostImage = postObj.coverImage;
      if (fs.existsSync(path.join(__dirname + "/../../public/posts/" + prevPostImage))) {
        fs.rmSync(path.join(__dirname + "/../../public/posts/" + prevPostImage));
      }
      postObj.coverImage = req.file.filename;
    } else {
      postObj.coverImage = postObj.coverImage;
    }
    try {
      // Save post
      const post = await postObj.save();
      // find the owner of the post
      res.json({
        status: 200,
        success: true,
        message: "Post updated successfully",
        data: post,
      });
    } catch (err) {
      res.json({
        status: 500,
        success: false,
        message: "Failed to update the post",
        err,
      });
    }
  }
};


// Add Review to a post
exports.postReview = async (req, res) => {

  const customerId = req.decodedUser._id
  const { rating, review, postId} = req.body;

  if (rating === undefined && review === undefined) {
    res.json({
      status: 400,
      success: false,
      message: "Rating and Review are empty",
    });
  } else {
    try {
      const checkPost = await Review.findOne({
        $and: [{ postId: postId }, { customerId: customerId }],
      });
      const customerExists = await Customer.findOne({_id : customerId}); 
      if (checkPost !== null) {
        res.json({
          status: 401,
          success: false,
          message: "Rating by this Customer already exist",
        });
      }
      else if(customerExists === null){
        res.json({
          status : 400, 
          success : false, 
          message : "Customer doest not exist"
        })
      } 
      else {
        const reviewObj = new Review();
        reviewObj.customerId = customerId;
        reviewObj.postId = postId;
        reviewObj.rating = rating === undefined ? null : rating;
        reviewObj.review = review === undefined ? null : review;
        const reviewData = await reviewObj.save();
        if (reviewData === null) {
          res.json({
            status: 500,
            success: false,
            message: "Failed to add review",
          });
        } else {
          // formula = total no. of each start * rating / total no. of ratings
          const fiveStarRatings = await Review.find({
            rating: { $eq: 5 },
          }).count();
          const fourStarRatings = await Review.find({
            rating: { $eq: 4 },
          }).count();
          const threeStarRatings = await Review.find({
            rating: { $eq: 3 },
          }).count();
          const twoStarRatings = await Review.find({
            rating: { $eq: 2 },
          }).count();
          const oneStarRatings = await Review.find({
            rating: { $eq: 1 },
          }).count();
          let noOfRatings =
            fiveStarRatings +
            fourStarRatings +
            threeStarRatings +
            twoStarRatings +
            oneStarRatings;

          let totalRating =
            (fiveStarRatings * 5 +
              fourStarRatings * 4 +
              threeStarRatings * 3 +
              twoStarRatings * 2 +
              oneStarRatings) /
            noOfRatings;
          // total no. of reviews
          const reviewCount = await Review.find({
            review: { $nin: [null] },
          }).count();

          // update the ratings and review count in post
          const post = await Post.find({ _id: postId });
          if (post === null) {
            res.json({
              status: 404,
              success: false,
              message: "Post not found",
            });
          } else {
            // Could also use the update query instead.
            const updatedPost = await Post.updateOne(
              { _id: postId },
              {
                $set: {
                  rating: totalRating,
                  reviewCount: reviewCount,
                  updatedAt : Date.now()
                },
              }
            );
            if (updatedPost.matchedCount === 1 && updatedPost.modifiedCount === 1) {
              res.json({
                status: 200,
                success: true,
                message: "Review Added successfully",
                data: reviewData,
              });
            } else {
              res.json({
                status: 500,
                success: true,
                message: "Couldn't update the reviewCount in post",
              });
            }
          }
        }
      }
    } catch (err) {
      res.json({
        status: 500,
        success: false,
        message: "There was an Error " + err,
      });
    }
  }
};

// Show all Reviews
exports.showReviewsOfAPost = async (req, res) => {
  const postId = req.params.postId; 
  try{
    const post = await Post.findOne({_id : postId}); 
    if(post === null){
      res.json({
        status : 404, 
        success : false, 
        message : "Post not found"
      })
    }
    else{
      const reviews = await Review.find({postId : postId}); 
      res.json({
        status : 200, 
        success : true,
        message : "Reviews fetched", 
        data : reviews
      })
    }
  } catch(err){
    res.json({
      status : 500, 
      success : false, 
      message : "There was an error "+ err
    })
  }
}

// Review update
exports.updateReview = async (req, res) => {
  const reviewId = req.params.reviewId; 
  const {review, rating} = req.body; 
  try{
    const data = await Review.findOne({_id : reviewId}); 
    if(data !== null){
      data.review = review === undefined ? data.review : review; 
      data.rating = rating === undefined ? data.rating : rating; 
      data.updatedAt = Date.now(); 
      const updatedReview = await data.save(); 
      res.json({
        status : 200, 
        success : true, 
        message : "Review updated successfully", 
        data : updatedReview
      })
    }
    else{
      res.json({
        status : 404, 
        success : false, 
        message : "Review not found",
        data : data
      })
    }
  } catch(err){
    res.json({
      status : 500, 
      success : false, 
      message : 'There was an error ' + err, 
    })
  }
}
// Review Delete
// customer verification ?
exports.deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId
  try{
    const review = await Review.findOne({_id : reviewId});
    if(review === null){
      res.json({
        status : 404, 
        success : false, 
        message : "Review not found"
      })
    }
    else{
      const deletedReview = await Review.deleteOne({_id : reviewId}); 
      console.log(deletedReview)
      if(deletedReview.deletedCount === 1){
        res.json({
          status : 200, 
          success : true, 
          message : "Deleted Successfully", 
          data : deletedReview
        })
      }
    }
  } catch(err){
    res.json({
      status : 500, 
      success : false, 
      message : "There was an error "+ err
    })
  }
}



// post report

//  #admin controls

// post block api

// post share * after making chatting collection