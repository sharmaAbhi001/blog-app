const { Schema, model } = require("mongoose");

const blogSchema = new Schema({

title:{
    type:String,
    required:true,
},
body:{
    type:String,
    required:true,
},
coverImageURl:{
    type:String,
},
createdBy:{
    type:Schema.Types.ObjectId,
    ref:'User'
},

}, {timestamps:true})

const Blog = model('blog',blogSchema);

module.exports = Blog;