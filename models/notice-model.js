const mongoose=require("mongoose");
const noticeSchema= mongoose.Schema({
    heading:String,
    body:String,
    date:String
})
module.exports = mongoose.model("cismnotice",noticeSchema)