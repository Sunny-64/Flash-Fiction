const Category = require("./categoryModel");
const fs = require("fs");
const path = require("path");

exports.addCategory = (req, res) => {
  const categoryObj = new Category();
  const { name } = req.body;

  if (name.trim() == "") {
    res.json({
      status: 400,
      success: false,
      message: "Empty Category",
    });
  }

  categoryObj.name = name.toLowerCase();
  categoryObj.image = req.file.filename;

  Category.findOne({ name: name })
    .then((data) => {
      if (data == null) {
        categoryObj.save()
        .then((result) => {
          res.json({
            status: 200,
            success: true,
            message: "Category added successfully",
            total_results: result.length,
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
        total_results: data.length,
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
  Category.findOne({ _id: req.params.categoryId })
    .then((data) => {
      if (data == null) {
        res.json({
          status: 400,
          success: false,
          message: "Data not found",
        });
      } else {
        res.json({
          status: 200,
          success: true,
          message: "Showing Category",
          total_results: data.length,
          data: data,
        });
      }
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
  const { categoryId, name, image } = req.body;
  if (req.body == null) {
    res.json({
      status: 400,
      success: false,
      message: "Invalid data",
    });
  } else {
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
          const prevImage = response.image;
          fs.rmSync(
            path.join(__dirname + "/../../public/category/" + prevImage));
          response.image = req.file.filename;
          response.updatedAt = Date.now();
          response.save()
            .then((data) => {
              res.json({
                status: 200,
                success: true,
                message: "Category Updated",
                total_results: data.length,

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
  }
};

exports.deleteCategory = (req, res) => {
  const categoryId = req.params.categoryId;
  Category.findOne({ _id: categoryId }).then((response) => {
    if (response != null) {
      fs.rmSync(path.join(__dirname + "/../../public/category/" + response.image));
      Category.deleteOne({ _id: categoryId })
        .then((data) => {
          res.json({
            status: 200,
            success: true,
            message: "Category deleted successfully",
            total_results : data.length, 
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
    } else {
      res.json({
        status: 400,
        success: false,
        message: "Category not found",
      });
    }
  });
};
