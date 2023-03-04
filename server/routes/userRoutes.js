const router = require("express").Router(); 
const userController = require("../api/user/userController");
const multer = require("multer"); 
const path = require("path"); 
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!fs.existsSync(path.join(__dirname + "/../public/user"))){
            fs.mkdirSync(path.join(__dirname + "/../public/user"))
        }
        cb(null, path.join(__dirname + "/../public/user"))
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() +Math.round(Math.random() * 1E9);
        cb(null, "user" + file.fieldname + uniqueSuffix + path.extname(file.originalname));
      }
})

const upload = multer({storage : storage});

router.get("/", (req, res) => {
    res.json({
        status : 200, 
        success : true, 
        message : "Welcome to the user routes"
    })
})

router.post("/register", upload.single("profilePicture"), userController.userRegister);
router.post("/login", userController.userLogin);
router.get("/verify/:email", userController.verify);

module.exports = router; 


