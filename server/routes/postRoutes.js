const router = require("express").Router(); 
const postController = require("./../api/post/postController")

router.get("/", (req, res) => {
    res.json({
        status : 200, 
        success : true, 
        message : "Welcome to post route"
    })
})

router.get("/all", postController.showAllPosts); 
router.get("/:postId", postController.showSinglePost);

// review
router.post("/review/add", postController.postReview); 
router.get("/reviews/:postId", postController.showReviewsOfAPost);
router.delete("/review/delete/:reviewId", postController.deleteReview);
router.patch("/review/update/:reviewId", postController.updateReview)



module.exports = router; 