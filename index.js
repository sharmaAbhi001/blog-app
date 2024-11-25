require('dotenv').config();
const dotenv = require('dotenv')
const express = require("express");
const userRouter = require("./routes/user");
const blogRouter =require("./routes/blog")
const mongoose = require("mongoose")
const path = require("path");
const cookieParser = require("cookie-parser");
const checkForAuthenticationCookie = require("./middlewares/authontication");

const Blog =require("./models/blog")

const app = express();
const PORT = process.env.PORT|| 8000;

app.set('view engine', 'ejs');
app.set("views",path.resolve("./views"))

mongoose.connect(process.env.mongoURL).then( ()=> console.log("connected mongodb"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")))


app.get("/",async(req,res)=>{
    const allBlogs = await Blog.find({});
    res.render("home",{
        blogs:allBlogs,
        user:req.user,
    });
});


app.use("/user",userRouter);
app.use("/blog",blogRouter)

app.listen(PORT,()=> console.log(`server started on Port ${PORT}`));



