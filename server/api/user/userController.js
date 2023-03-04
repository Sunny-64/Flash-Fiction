require("dotenv").config();
const User = require("./userModel");
const Customer = require("./../customer/customerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// functions
function sendVerificationMail(email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "flashfic.official@gmail.com",
    to: email,
    subject: "Verification",
    text: `Click on the following link to verify`,
    html: `Click <a href="http://localhost:3000/user/verify/${email}">here</a> to verify.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } 
    // else {
    //   // console.log("Email sent: " + info.response);
    // }
  });
}

exports.verify = async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email: email });
    if (user !== null) {
      user.isVerified = true;
      user.save();
      res.json({
        status: 200,
        success: true,
        message: "User has been verified, now you can login",
      });
    } else {
      res.json({ status: 404, success: false, message: "User not found" });
    }
  } catch (err) {
    res.json({ status: 500, success: false, error: err.message });
  }
};

exports.userRegister = async (req, res) => {
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
  if (req.body == undefined) {
    res.json({
      status: 400,
      success: false,
      message: "Invalid data",
    });
  } else {
    try {
      const user = await User.findOne({ email: email });
      if (user === null) {
        // user fields...
        const userObj = new User();
        userObj.name = name.trim();
        userObj.email = email.trim();
        userObj.password = bcrypt.hashSync(
          password.trim(),
          parseInt(process.env.SALT_ROUNDS)
        );
        userObj.mobile = mobile.trim();
        userObj.countryCode = countryCode.trim();
        const saveUser = await userObj.save();

        // customer fields
        const customerObj = new Customer();
        customerObj.userId = saveUser._id;
        customerObj.name = saveUser.name;
        customerObj.email = saveUser.email;
        customerObj.mobile = saveUser.mobile;
        customerObj.countryCode = saveUser.countryCode;
        customerObj.dob = dob;
        customerObj.country = country.trim();
        customerObj.state = state.trim();
        customerObj.address = address.trim();
        customerObj.gender = gender.trim();
        customerObj.favCategories = favCategories;

        if (req.file !== undefined) {
          customerObj.profilePicture =
            req.file.filename === undefined
              ? "default-profile-icon.png"
              : req.file.filename;
        } else {
          customerObj.profilePicture = "default-profile-icon.png";
        }
        const saveCustomer = await customerObj.save();

        sendVerificationMail(saveUser.email);

        res.json({status: 200, success: true, message: "verification email sent"});
      } else {
        if (user.isVerified) {
          res.json({status: 400, success: false, message: "user already exist",
          });
        } else {
          res.json({status: 400, success: false,message: "User not verified"});
        }
      }
    } catch (err) {
      res.json({ status: 500, success: false, error: err.message });
    }
  }
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (email === undefined || password === undefined) {
    res.json({
      status: 400,
      success: false,
      message: "Email or password is incorrect",
    });
  } else {
    try {
      let user = await User.findOne({ email: email });
      if (user !== null) {
        if (user.isVerified) {
          if (bcrypt.compareSync(password, user.password)) {
            let logObj = {
              ip: req.ip,
              isLoggedInSuccessfully: true,
              loginTime: Date.now(),
            };
            user.loginLogs.push(logObj);
            const saveUser = await user.save();
            const customer = await Customer.findOne({ userId: saveUser._id });
            let payload = customer.toJSON();

            let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY);
            res.json({
              status: 200,
              success: true,
              message: "User Logged in Successfully",
              data: token,
            });
          } else {
            let logObj = {
              ip: req.ip,
              isLoggedInSuccessfully: false,
              loginTime: Date.now(),
            };
            user.loginLogs.push(logObj);
            const saveLogs = await user.save();
            res.json({
              status: 400,
              success: false,
              message: "email or password is incorrect",
            });
          }
        } else {
          // if user is not verified
          sendVerificationMail(user.email);
          res.json({status : 401, success : false, message : "user not verified, check mail to verify"});
        }
      } else {
        res.json({ status: 404, success: false, message: "user not found" });
      }
    } catch (err) {
      res.json({ status: 500, success: false, error: err.message });
    }
  }
};
