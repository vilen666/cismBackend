const express = require('express')
const app = express()
const router = express.Router()
const path = require("path")
const fs = require('fs'); 
const sharp=require("sharp")
require("dotenv").config()
let isLoggedIn = require("../middlewares/isLoggedIn")
let { login, register, edit, fetchData } = require("../controllers/authController")
let courseModel = require("../models/course-model")
let { fetchCourses,uploadCourse,courseDelete } = require("../controllers/courseController")

if (process.env.NODE_ENV === "development") router.post("/register", register)

router.get("/", fetchData)
router.post("/edit", isLoggedIn, edit)
router.post("/login", login)
router.get("/logout", (req, res) => {
  res.clearCookie("token",{
    httpOnly:true,
    secure:true,
    sameSite:"None"
  })
  res.send({ success: true })
})

router.get("/portal", isLoggedIn, (req, res) => {
  res.send({ success: true })
})




const upload = require("../config/multerConfig")
const multerHandler = require("../middlewares/multerHandler")
router.get("/courses", fetchCourses)
router.post("/courses/upload",isLoggedIn,upload.single("image"),multerHandler, uploadCourse)
router.post("/courses/delete",isLoggedIn,courseDelete)


const {uploadCampus,fetchCampusNames,fetchCampus, updateCampus,updateCampusName, deleteCampus, deleteImg}=require("../controllers/campusController")
router.post("/campus/upload", upload.array('images'), multerHandler, uploadCampus)
router.get("/campus/names",fetchCampusNames)
router.get("/campus/:name",fetchCampus)
router.get("/campus/campusDelete/:id",isLoggedIn,deleteCampus)
router.get("/campus/updateName/:name/:newName",isLoggedIn,updateCampusName)
router.post("/campus/update",isLoggedIn,upload.array('newPictures'),multerHandler,updateCampus)
router.post("/campus/deleteImg",isLoggedIn,deleteImg)
module.exports = router;