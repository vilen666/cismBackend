const cors = require('cors');
const db=require("./config/mongoose-connect")
let express = require("express")
let app = express();
const cookieParser=require("cookie-parser")
app.use(cookieParser())
require("dotenv").config();
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use(cors({
    origin: function (origin, callback) {
        // Check if the origin is in the list of allowed origins
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
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
        console.log(`You are live at http://localhost:${process.env.PORT}/`)
    }
})