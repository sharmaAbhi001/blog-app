const jwt = require("jsonwebtoken");

const secrate = "Abhi@@@@@123";


const createTokenForUser = (user)=>{
 const payload ={
    _id:user._id,
    email:user.email,
    profileImageURL:user.profileImageURL,
    role:user.role,
 }

 const token = jwt.sign(payload,secrate);
 return token;
}


const validateToken = (token)=> {
const payload = jwt.verify(token,secrate);
return payload;
}


module.exports = {
    createTokenForUser,
    validateToken
};