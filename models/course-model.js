const mongoose=require("mongoose");
const courseSchema= mongoose.Schema({
    name:String,
    branch:String,
    picture:{
        data: Buffer,
        contentType: String
      }
})
module.exports = mongoose.model("course",courseSchema)