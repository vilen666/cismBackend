const cors = require('cors');
const db=require("./config/mongoose-connect")
let express = require("express")
let app = express();
const cookieParser=require("cookie-parser")
app.use(cookieParser())
require("dotenv").config();
app.use(cors(
    {
        origin:process.env.ORIGIN,
        credentials:true
    }
));
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const adminRouter = require("./routes/adminRouter")
const indexRouter = require("./routes/indexRouter")
app.use("/",indexRouter)
app.use("/admin",adminRouter)

app.listen(process.env.PORT,(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log(`You are live at http://localhost:${process.env.PORT}/ you can access from : ${process.env.ORIGIN}`)
    }
}) 