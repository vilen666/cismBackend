const courseModel = require("../models/course-model")
const path=require("path")
const fs= require("fs")
const sharp=require("sharp")

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
        res.send({ success: true, data: "There was error trying to fetch courses" })
    }

}
module.exports.uploadCourse=async (req, res) => {
  try {
    const webpBuffer = await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toBuffer();
      let course=await courseModel.findOne({name:req.body.name})
      if(!course)
      {
      await courseModel.create({
        name: req.body.name,
        branch: req.body.branch,
        picture: {
          data: webpBuffer,
          contentType: req.file.mimetype,
          filename: req.file.filename
        }
      })}
      else{
        await findByIdAndUpdate({_id:course._id},{
          name: req.body.name,
        branch: req.body.branch,
        picture: {
          data: webpBuffer,
          contentType: req.file.mimetype,
          filename: req.file.filename
        }
        })
      }
      res.send({ success: true, data: 'File uploaded and saved to database successfully' });
  }
  catch (err) {
    res.send({ success: false, data: err.message })
  }

}