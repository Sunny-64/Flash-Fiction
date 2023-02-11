const User = require("./userModel");
const Customer = require("./../customer/customerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

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
    image, 
  } = req.body;

  const favCategories = req.body.favCategories;
  if(req.body == undefined){
    res.json({
          status: 400,
          success: false,
          message: "Invalid data",
        });
  }
  else {
    User.findOne({ email: email }).then((data) => {
      if (data == null) {
        userObj.name = name.trim();
        userObj.email = email.trim();
        userObj.password = bcrypt.hashSync(password.trim(), 10); 
        userObj.mobile = mobile.trim();
        userObj.countryCode = countryCode.trim();
        userObj.save()
          .then((data) => {
            customerObj.userId = data._id;
            customerObj.name = data.name;
            customerObj.email = data.email;
            customerObj.mobile = data.mobile;
            customerObj.countryCode = data.countryCode;
            customerObj.dob = dob;
            customerObj.country = country.trim();
            customerObj.state = state.trim();
            customerObj.address = address.trim();
            customerObj.gender = gender.trim();
            customerObj.favCategories = favCategories;
            // console.log(req.file.filename)
            if(req.file !== undefined){

              customerObj.profilePicture = req.file.filename === undefined ? "default-profile-icon.png" : req.file.filename; 
            }
            else{
              customerObj.profilePicture = "default-profile-icon.png"
            }
            customerObj.save()
              .then((response) => {
                jwt.sign(response.toJSON(), process.env.SECRET_KEY, (err, token) => {
                  // console.log(token, err)
                  if(err === null){
                    req.headers.authorization = token; 
                    console.log(token)
                  }
                  else{
                    //handle error
                    res.json({
                      status : 401, 
                      success : false, 
                      message : "Unauthorized access"
                    })
                  }
                }); 
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
            // console.log(err);
            res.json({
              status: 400,
              success: false,
              message: "Failed to save user " + err,
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
  }
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

