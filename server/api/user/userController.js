const User = require("./userModel");
const Customer = require("./../customer/customerModel");
const bcrypt = require("bcrypt");
const { response } = require("express");

exports.userRegister = (req, res) => {
  const userObj = new User();
  const customerObj = new Customer();
  const {
    name,
    email,
    password,
    mobile,
    countryCode,
    dob,
    gender,
    country,
    state,
    address,
  } = req.body;

  if(!(req.body)){
    res.json({
        status: 400,
        success: false,
        message: "Invalid data",
      });
  }
  // const favCategories = req.body.favCategories;
  // if (
  //   name == undefined ||
  //   email == undefined ||
  //   password == undefined ||
  //   mobile == undefined ||
  //   countryCode == undefined ||
  //   dob == undefined ||
  //   country == undefined ||
  //   state == undefined ||
  //   address == undefined ||
  //   gender == undefined
  // ) {
  //   res.json({
  //     status: 400,
  //     success: false,
  //     message: "Invalid data",
  //   });
  // } else {
    User.findOne({ email: email }).then((data) => {
      if (data == null) {
        userObj.name = name;
        userObj.email = email;
        userObj.password = bcrypt.hashSync(password, 10); // breaks if password is not provided
        userObj.mobile = mobile;
        userObj.countryCode = countryCode;

        userObj
          .save()
          .then((data) => {
            customerObj.userId = data._id;
            customerObj.name = data.name;
            customerObj.email = data.email;
            customerObj.mobile = data.mobile;
            customerObj.countryCode = data.countryCode;
            customerObj.dob = dob;
            customerObj.country = country;
            customerObj.state = state;
            customerObj.address = address;
            customerObj.gender = gender;
            customerObj.favCategories = favCategories;
            customerObj
              .save()
              .then((response) => {
                res.json({
                  status: 200,
                  success: true,
                  message: "User Registered Successfully",
                  data: response,
                });
              })
              .catch((err) => {
                res.json({
                  status: 400,
                  success: false,
                  message: "Failed to Register User",
                  error: err,
                });
              });
          })
          .catch((err) => {
            res.json({
              status: 400,
              success: false,
              message: "Failed to save user",
              error: err,
            });
          });
      } else {
        res.json({
          status: 400,
          success: false,
          message: "User already exist",
        });
      }
    });
  // }
}

exports.userLogin = (req, res) => {
  const { email, password } = req.body;

  if (email === undefined || password === undefined) {
    res.json({
      status: 400,
      success: false,
      message: "Email or password is incorrect",
    });
  }
  User.findOne({ email: email })
    .then((response) => {
      if (response != null) {
        if (bcrypt.compareSync(password, response.password)) {
          let logObj = {
            ip: req.ip,
            isLoggedInSuccessfully: true,
            loginTime: Date.now(),
          };
          response.loginLogs.push(logObj);
          response
            .save()
            .then((data) => {
              res.json({
                status: 200,
                success: true,
                message: "User Logged in Successfully",
                data: data,
              });
            })
            .catch((err) => {
              res.json({
                status: 400,
                success: false,
                message: "Failed to save user logs",
                error: err,
              });
            });
        } else {
          let logObj = {
            ip: req.ip,
            isLoggedInSuccessfully: false,
            loginTime: Date.now(),
          };
          response.loginLogs.push(logObj);
          response.save().then((data) => {
            res.json({
              status: 400,
              success: false,
              message: "Email or password is wrong",
            });
          });
        }
      } else {
        res.json({
          status: 400,
          success: false,
          message: "User does not exist",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 400,
        success: false,
        message: "Could not fetch User",
        error: err,
      });
    });
};
