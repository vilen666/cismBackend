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
let { fetchCourses,uploadCourse } = require("../controllers/courseController")

if (process.env.NODE_ENV === "development") router.post("/register", register)

router.get("/", fetchData)

router.post("/edit", isLoggedIn, edit)

router.post("/login", login)

router.get("/portal", isLoggedIn, (req, res) => {
  res.send({ success: true })
})

router.get("/logout", (req, res) => {
  res.clearCookie("token")
  res.send({ success: true })
})

router.get("/courses", fetchCourses)

const upload = require("../config/multerConfig")
const multerHandler = require("../middlewares/multerHandler")
router.post("/courses/upload", uploadCourse)

const {uploadCampus,fetchCampusNames,fetchCampus, updateCampus}=require("../controllers/campusController")
router.post("/campus/upload", upload.array('images'), multerHandler, uploadCampus)
router.get("/campus/names",fetchCampusNames)
router.get("/campus/:name",fetchCampus)
router.post("/campus/update",isLoggedIn,upload.array('newPictures'),multerHandler,updateCampus)

module.exports = router;