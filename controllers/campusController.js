const path = require("path")
const fs = require("fs")
const sharp = require("sharp")
const campusModel = require("../models/campus-model")
const { json } = require("express")
module.exports.fetchCampusNames = async (req, res) => {
    try {
        let campuses = await campusModel.find().select('name id')
        res.send({ success: true, campuses, data: "Campus successfully fetched" })
    } catch (err) {
        res.send({ success: false, data: "There was error trying to fetch campus details" })
    }
}

module.exports.fetchCampus = async (req, res) => {
    try {
        let campusPictures=await campusModel.findOne({name:req.params.name}).select("pictures")
        let pictures=campusPictures.pictures.map(item=>(
            {
                _id:item._id,
                contentType: item.contentType,
                data: item.data.toString('base64') // Convert buffer to base64 string
              }
        ))
        if(!campusPictures){
            throw new Error("err")
        }
        else{
            res.send({ success: true, pictures,data: "Course successfully fetched" })

        }
    }
    catch (err) {
        res.send({ success: false, data: "There was error trying to fetch Details" })
    }
}
module.exports.uploadCampus = async (req, res) => {
    try {
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

module.exports.deleteCampus=async (req,res)=>{
    try{let campus = await campusModel.findByIdAndDelete({_id:req.params.id})
    console.log(req.params);
    
    if(campus){
        res.send({success:true,data:`${campus.name} deleted Successfully`})
    }
    else{
        throw new Error("Could not delete")
    }}
    catch(error){
        res.send({success:false,data:error.message})
    }
}

module.exports.updateCampusName=async (req,res)=>{
    try {        
        let campus=await campusModel.findOne({name:req.params.name}).select("-pictures")
        if(campus){
            campus = await campusModel.findByIdAndUpdate({_id:campus._id},{name:req.params.newName})
            res.send({success:true,data:"Updated name"})
        }
        else{
            throw new Error()
        }
    } catch (error) {
        res.send({success:false,data:"Unable to update name"})
    }
}

module.exports.deleteImg=(req,res)=>{
    let {_id,picId} =req.body
    try {
        picId.forEach(async (item)=>{
            await campusModel.findByIdAndUpdate({_id},
                { $pull: { pictures: { _id: item } } }
            )
        })
         res.send({success:true,data:"Sucessfully Updated"})
    } catch (error) {
        res.send({success:false,data:"Unable to delete Image"})
    }
}