const Category = require("./categoryModel");

exports.addCategory = (req, res) => {
  const categoryObj = new Category();
  const { name, image } = req.body;

  if (name.trim() == "") {
    res.json({
      status: 400,
      success: false,
      message: "Empty Category",
    });
  }

  categoryObj.name = name.toLowerCase();

  Category.findOne({ name: name })
    .then((data) => {
      if (data == null) {
        categoryObj.save().then((result) => {
          res.json({
            status: 200,
            success: true,
            message: "Category added successfully",
            data: result,
          });
        });
      } else {
        res.json({
          status: 400,
          success: false,
          message: "Category Already exists",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 400,
        success: false,
        error: "There was an error " + err,
      });
    });
};

exports.showAllCategory = (req, res) => {
  Category.find()
    .then((data) => {
      res.json({
        status: 200,
        success: true,
        message: "Showing All Categories",
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        status: 400,
        success: false,
        message: "There was an error while fetching data",
        error: err,
      });
    });
};

exports.showSingleCategory = (req, res) => {
  Category.findOne({ _id: req.params.categoryId})
    .then((data) => {
      res.json({
        status: 200,
        success: true,
        message: "Showing All Categories",
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        status: 400,
        success: false,
        message: "There was an error while fetching data",
        error: err,
      });
    });
};

exports.updateCategory = (req, res) => {
  const { categoryId, name } = req.body;

  Category.findOne({ _id: categoryId })
    .then((response) => {
      if (response == null) {
        res.json({
          status: 400,
          success: false,
          message: "Category does not exist",
        });
      } else {
        response.name = name.trim().toLowerCase();
        response.updatedAt = Date.now();
        response
          .save()
          .then((data) => {
            res.json({
              status: 200,
              success: true,
              message: "Category Updated",
              data: data,
            });
          })
          .catch((err) => {
            res.json({
              status: 500,
              success: false,
              message: "There was an Error " + err,
            });
          });
      }
    })
    .catch((err) => {
      res.json({
        status: 500,
        success: false,
        message: "There was an Error " + err,
      });
    });
};

exports.deleteCategory = (req, res) => {
  const categoryId = req.params.categoryId;
  Category.findOne({ _id: categoryId }).then((response) => {
    if (response != null) {
      Category.deleteOne({ _id: categoryId })
        .then((data) => {
          res.json({
            status: 200,
            success: true,
            message: "Category deleted successfully",
            data: data,
          });
        })
        .catch((err) => {
          res.json({
            status: 400,
            success: false,
            message: "There was an Error " + err,
          });
        });
    }
    else{
        res.json({
            status : 400, 
            success : false, 
            message : "Category not found"
        })
    }
  });
};
