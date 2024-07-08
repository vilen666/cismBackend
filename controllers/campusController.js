const path = require("path")
const fs = require("fs")
const sharp = require("sharp")
const campusModel = require("../models/campus-model")
const { log } = require("console")
const { json } = require("express")
module.exports.fetchCampusNames = async (req, res) => {
    try {
        let campuses = await campusModel.find().select('name')
        res.send({ success: true, campuses, data: "Campus successfully fetched" })
    } catch (err) {
        console.log(err.message);
        res.send({ success: false, data: "There was error trying to fetch campus details" })
    }
}
module.exports.fetchCampus = async (req, res) => {
    try {
        console.log(req.body.name);
        let campusPictures=await campusModel.findOne({name:req.params.name}).select("pictures")
        let pictures=campusPictures.pictures.map(item=>(
            {
                contentType: item.contentType,
                data: item.data.toString('base64') // Convert buffer to base64 string
              }
        ))
        if(!campusPictures){
            throw new Error("err")
        }
        console.log(req.body.name);
        res.send({ success: true, pictures,data: "Course successfully fetched" })
    }
    catch (err) {
        res.send({ success: false, data: "There was error trying to fetch Details" })
    }
}

module.exports.uploadCampus = async (req, res) => {
    try {
        console.log("hrllo")
        let files = await Promise.all(req.files.map(async (file) => {
            const webpBuffer = await sharp(file.buffer)
        .webp({ quality: 80 })
        .toBuffer();
            return (
                {
                    contentType: file.mimetype,
                    data: webpBuffer
                })
        }))
        let campus = await campusModel.findOne({ name: req.body.name })
        if (!campus) {
            await campusModel.create({
                name: req.body.name,
                pictures: files
            })
        }
        else {
            campus.pictures= [...campus.pictures,...files]
            await campusModel.findByIdAndUpdate({ _id: campus._id }, {
                name: campus.name,
                pictures: campus.pictures
            })
        }
        res.send({ success: true, data: "Succesfully Uploaded" })
    }
    catch (err) {
        res.send({ success: false, data: "There was error trying to Upload" })
    }

}

module.exports.updateCampus= async (req,res)=>{
    try {
        let campus=await campusModel.findOne({name:req.body.name})
        let oldpictures=JSON.parse(req.body.pictures)
        pictures=[...oldpictures.map(item=>{
            return({
                contentType:item.contentType,
                data:Buffer.from(item.data, 'base64')
            })
        }),...(await Promise.all(req.files.map(async (file) => {
            const webpBuffer = await sharp(file.buffer)
        .webp({ quality: 80 })
        .toBuffer();
            return (
                {
                    contentType: file.mimetype,
                    data: webpBuffer
                })
        })))]
        campus=await campusModel.findByIdAndUpdate({_id:campus._id},{pictures})
        res.send({ success: true, data: "Succesfully Updated" })
    } catch (error) {
        res.send({ success: false, data: "There was error trying to Update" })
    }
}