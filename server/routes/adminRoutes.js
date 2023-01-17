const router = require("express").Router(); 

router.get("/admin", (req, res)=>{
    res.json({
        status : 200, 
        success : true, 
        message : "welcome to admin page"
    })
})


module.exports = router; 