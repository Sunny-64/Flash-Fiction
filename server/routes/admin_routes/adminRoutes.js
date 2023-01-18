const router = require("express").Router(); 
const categoryController = require("../../api/category/categoryController"); 

router.get("/admin", (req, res)=>{
    res.json({
        status : 200, 
        success : true, 
        message : "welcome to admin page"
    })
})

// Category CRUD
router.post("/category/add", categoryController.addCategory); 
router.get("/category/showAll", categoryController.showAllCategory);
router.get("/category/showSingle/:categoryId",categoryController.showSingleCategory);
router.post("/category/update",categoryController.updateCategory);
router.delete("/category/delete/:categoryId", categoryController.deleteCategory); 



module.exports = router; 