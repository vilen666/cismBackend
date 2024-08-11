const courseModel = require("../models/course-model")
const path=require("path")
const fs= require("fs")
const sharp=require("sharp")
const upload=require("../config/multerConfig")
module.exports.fetchCourses = async (req, res) => {
    try {
        let branches = await courseModel.distinct("branch")
        let courses = await courseModel.find()
        courses = courses.map(course => ({
            _id: course._id,
            name: course.name,
            branch: course.branch,
            picture: {
              contentType: course.picture.contentType,
              data: course.picture.data.toString('base64') // Convert buffer to base64 string
            }
          }));
        res.send({ success: true, courses, branches, data: "Course successfully fetched" })
    }
    catch (err) {
        res.send({ success: false, data: "There was error trying to fetch courses" })
    }

}
module.exports.uploadCourse=async (req, res) => {
  try {
    let webpBuffer;
    let course=null;
    if(req.body._id)
    {
      course=await courseModel.findById({_id:req.body._id})
    }
    if(req.file){
       webpBuffer= await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toBuffer();
    }
      if(!course)
      {
      await courseModel.create({
        name: req.body.name,
        branch: req.body.branch,
        picture: {
          data: webpBuffer,
          contentType: req.file.mimetype,
          filename: req.file.filename
        }})
      res.send({ success: true, data: 'File uploaded and saved to database successfully' });
    }
      else{

        if(req.file){
          await courseModel.findByIdAndUpdate({_id:course._id},{
            name: req.body.name,
          branch: req.body.branch,
          picture: {
            data: webpBuffer,
            contentType: req.file.mimetype,
            filename: req.file.filename
          }
          })
        }
        else{
          await courseModel.findByIdAndUpdate({_id:course._id},{
            name: req.body.name,
          branch: req.body.branch,
          })
        }
      res.send({ success: true, data: 'Course updated and saved to database successfully' });
    }
  }
  catch (err) {
    console.log(err);
    
    res.send({ success: false, data: err.message })
  }

}
module.exports.courseDelete=async (req,res)=>{
  try {
    let course=await courseModel.findByIdAndDelete({_id:req.body._id})
    
    res.send({success:true,data:`${course.name} deleted Successfully`})
  } catch (error) {
    res.send({success:false,data:"Unable to delete"})
  }
}