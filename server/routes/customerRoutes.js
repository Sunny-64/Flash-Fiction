const router = require("express").Router(); 
const customerController = require("../api/customer/customerController");
const postController = require("./../api/post/postController"); 
const readingListController = require("./../api/readingList/readingListController"); 

const multer = require("multer"); 
const path = require("path"); 
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!fs.existsSync(path.join(__dirname + "/../public/posts"))){
            fs.mkdirSync(path.join(__dirname + "/../public/posts"))
        }
        cb(null, path.join(__dirname + "/../public/posts"))
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() +Math.round(Math.random() * 1E9);
        cb(null, "post" + file.fieldname + uniqueSuffix + path.extname(file.originalname));
      }
})

const upload = multer({storage : storage});

router.use(require("./../middlewares/auth"));

// customer
router.get("/show/all", customerController.showAllCustomers); 
router.get("/show/single/:customerId", customerController.showSingleCustomer); 
// for testing use
router.delete("/delete/:customerId", customerController.deleteCustomer); 

router.patch("/update", customerController.updateCustomer);

// Posts
router.post("/post/add", upload.single('coverImage') ,postController.addPost); 
router.delete("/post/delete/:postId", postController.deletePost); 
router.patch("/post/update/:postId", upload.single("coverImage"), postController.updatePost); 

// Follow
router.post("/follow", customerController.followCustomer); 
router.post("/unfollow", customerController.unfollowCustomer);

// reading list

// creates a new reading list
router.post("/wishlist/create", readingListController.createReadingList); 
// shows all the reading lists of the user
router.get("/wishlists", readingListController.showReadingListsOfACustomer);
// deletes the reading list 
router.delete("/wishlist/delete", readingListController.deleteReadingList); 
// add stories in the reading list
router.post("/wishlist/story/add", readingListController.addItemInReadingList); 
// remove stories from the list
router.delete("/wishlist/story/remove", readingListController.removeItemFromReadingList); 

router.get("*", (req, res)=>{
    res.json({
        status : 401, 
        success : false, 
        message : "Unauthorized Access",
    })
})


module.exports = router; 