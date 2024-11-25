const express = require("express");
const User = require("../models/user")
const router = express.Router();

router.get("/signup", (req,res)=>{
 return   res.render("signup");
})

router.get("/signin", (req,res)=>{
 return   res.render("signin");
});


router.post("/signin", async (req,res)=>{
    const {email,password} = req.body;
    
    try {

        const token = await User.matchPasswordAndGenerateToken(email,password);
        return res.cookie("token",token).redirect("/");
        
    } catch (error) {
        return res.render("signin",{error:"Incorrect Email Or Password"});
    }
    
});




router.post("/signup", async(req,res)=>{
    
    const {fullName,email,password} = req.body; 
     
    try {
        await User.create({
            fullName:fullName,
            email:email,
            password:password
         })

         return res.redirect("/");
    } catch (error) {
        return res.render("signin",{error:"Email id already exist!"});
    }
});


router.get("/logout", (req,res)=>{
    res.clearCookie("token").redirect("/")
})

module.exports = router;