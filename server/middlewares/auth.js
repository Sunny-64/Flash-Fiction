const jwt = require("jsonwebtoken"); 

module.exports = (req, res) => {
    const token = req.headers['authorization']; 
    if(token === undefined || token === ""){
        res.json({
            status : 401, 
            success : false, 
            message : "Unauthorized"
        })
    }
    else{
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
            if(err){
                res.json({
                    status : 400, 
                    success : false, 
                    message : err
                })
            }
            else{
                req.decoded = decoded; 
                next(); 
            }
        })
    }
}