const User = require("./../api/user/userModel");
const Customer = require("./../api/customer/customerModel");

const bcrypt = require("bcrypt");


const favCategories = ["63cad2fdbb2430dda60fc0c5"];

const userObj = new User({
    name : "DummyUser1",
    email : "DummyUser@1gmail.com",
    password : bcrypt.hashSync("1234", 10),
    mobile : "79846235",
    countryCode : "+91"
})

User.findOne({ email: userObj.email })
.then(data => {
    if(data == null){
        let dummyUser = new User(userObj)
        dummyUser.save()
        .then(response => {
            const customerObj = new Customer({
                userId : response._id,
                name : response.name,
                email : response.email,
                mobile : response.mobile,
                countryCode : response.countryCode,
                dob : "2004-10-1",
                country : "India",
                state : "punjab",
                address : "Village hidden in the leaf",
                gender : "male",
                favCategories : favCategories,
                profilePicture : "default-profile-icon.png"
            });
            customerObj.save()
            .then(customerData => {
                console.log("Customer Saved successfully")
            })
            .catch(err => {
                console.log("Failed to Save customer data ", err); 
            })
        })
        .catch(err => {
            console.log("Failed to Save user data" , err); 
        })
    }
    // else{
    //     console.log("user already exists")
    // }
});

const userObj2 = new User({
    name : "DummyUser2",
    email : "DummyUser@2gmail.com",
    password : bcrypt.hashSync("1234", 10),
    mobile : "798462354",
    countryCode : "+91"
})

User.findOne({ email: userObj2.email })
.then(data => {
    if(data == null){
        let dummyUser = new User(userObj2)
        dummyUser.save()
        .then(response => {
            const customerObj = new Customer({
                userId : response._id,
                name : response.name,
                email : response.email,
                mobile : response.mobile,
                countryCode : response.countryCode,
                dob : "2004-10-1",
                country : "Ninja world",
                state : "Land of fire",
                address : "Village hidden in the sand",
                gender : "male",
                favCategories : favCategories,
                profilePicture : "default-profile-icon.png"
            });
            customerObj.save()
            .then(customerData => {
                console.log("Customer Saved successfully")
            })
            .catch(err => {
                console.log("Failed to Save customer data ", err); 
            })
        })
        .catch(err => {
            console.log("Failed to Save user data ", err); 
        })
    }
    // else{
    //     console.log("user already exists")
    // }
});

const userObj3 = new User({
    name : "DummyUser3",
    email : "DummyUser@3gmail.com",
    password : bcrypt.hashSync("1234", 10),
    mobile : "988462354",
    countryCode : "+91"
})

User.findOne({ email: userObj3.email })
.then(data => {
    if(data == null){
        let dummyUser = new User(userObj3)
        dummyUser.save()
        .then(response => {
            const customerObj = new Customer({
                userId : response._id,
                name : response.name,
                email : response.email,
                mobile : response.mobile,
                countryCode : response.countryCode,
                dob : "2004-10-1",
                country : "Japan",
                state : "Tokyo",
                address : "Tokyo street 11",
                gender : "female",
                favCategories : favCategories,
                profilePicture : "default-profile-icon.png"
            });
            customerObj.save()
            .then(customerData => {
                console.log("Customer Saved successfully")
            })
            .catch(err => {
                console.log("Failed to Save customer data ", err); 
            })
        })
        .catch(err => {
            console.log("Failed to Save user data ", err); 
        })
    }
    // else{
    //     console.log("user already exists")
    // }
});


