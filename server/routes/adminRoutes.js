const router = require("express").Router(); 
const categoryController = require("./../api/category/categoryController"); 
const customerController = require("./../api/customer/customerController"); 
const adminController = require("./../api/admin/adminController"); 
const multer = require("multer"); 
const path = require("path"); 
const fs = require("fs");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!fs.existsSync(path.join(__dirname + "/../public/category"))){
            fs.mkdirSync(path.join(__dirname + "/../public/category"))
        }
        cb(null, path.join(__dirname + "/../public/category"))
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() +Math.round(Math.random() * 1E9);
        cb(null, "category" + file.fieldname + uniqueSuffix + path.extname(file.originalname));
      }
})

const upload = multer({storage : storage});

router.get("/admin", (req, res)=>{
    res.json({
        status : 200, 
        success : true, 
        message : "welcome to admin page"
    })
})

router.post("/login", adminController.adminLogin); 

router.use(require("./../middlewares/adminAuth")); 
// Category CRUD
router.post("/category/add", upload.single("image"), categoryController.addCategory); 
router.get("/category/show/all", categoryController.showAllCategory);
router.get("/category/show/single/:categoryId",categoryController.showSingleCategory);
router.put("/category/update",upload.single("image"),categoryController.updateCategory);
router.delete("/category/delete/:categoryId", categoryController.deleteCategory); 

// User info and operations
router.get("/customer/show/all", customerController.getAllCustomers); 
router.get("/customer/show/blocked", customerController.getBlockedCustomers); 
router.get("/customer/show/single/:customerId", customerController.showSingleCustomer); 
router.patch("/customer/block", customerController.blockCustomer); 


module.exports = router; 