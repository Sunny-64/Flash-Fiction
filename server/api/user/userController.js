const User = require("./userModel");
const Customer = require("./../customer/customerModel");
const bcrypt = require("bcrypt");

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
  // const favCategories = req.body.favCategories;

  User.findOne({ email: email }).then((data) => {
    if (data == null) {
      userObj.name = name != undefined ? name : "";
      userObj.email = email != undefined ? email : "";
      userObj.password = bcrypt.hashSync(password, 10);
      userObj.mobile = mobile != undefined ? mobile : "";
      userObj.countryCode = countryCode != undefined ? countryCode : "";
      userObj.save()
        .then((data) => {
          customerObj.userId = data._id;
          customerObj.name = data.name;
          customerObj.email = data.email;
          customerObj.mobile = data.mobile;
          customerObj.countryCode = data.countryCode;
          customerObj.dob = dob != undefined ? dob : null;
          customerObj.country = country != undefined ? country : "";
          customerObj.state = state != undefined ? state : "";
          customerObj.address = address != undefined ? address : "";
          customerObj.gender = gender != undefined ? gender : "";
          // customerObj.favCategories = favCategories != undefined ? favCategories : "",
          customerObj.save()
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
            message: "Failed to Register user",
            error: err,
          });
        });
    }
    else{
        res.json({
            status : 400, 
            success : false, 
            message : "User already exist", 
        })
    }
  });
};
