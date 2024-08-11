const express=require('express')
const sendEmail=require('../config/mailerConfig')
const app =express()
const router = express.Router()
router.get("/",(req,res)=>{
    res.send("hello from backend!")
})

router.post('/contact', async (req, res) => {
    const { text } = req.body;
    try {
      sendEmail("supratimlala123@gmail.com", "Admission", text, "");
      res.send({success:true, data: 'Email sent successfully' });
    } catch (error) {
      console.log(error.message)
      res.send({ success:false,data: 'Contact to college'});
    }
  });
module.exports=router;