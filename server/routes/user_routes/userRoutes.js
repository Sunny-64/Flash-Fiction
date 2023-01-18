const router = require("express").Router(); 
const userController = require("./../../api/user/userController");

router.get("/", (req, res) => {
    res.json({
        status : 200, 
        success : true, 
        message : "Welcome to the user routes"
    })
})

router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);
module.exports = router; 