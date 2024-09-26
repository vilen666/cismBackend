const adminModel = require("../models/admin-model")
const noticeModel = require("../models/notice-model")
const bcrypt = require("bcrypt")
module.exports.fetchAll = async (req, res) => {
    try {
        let notice = await noticeModel.find()
        if (notice)
            return res.send({ data: notice, success: true })
        throw new Error()
    }
    catch (err) {
        res.send({ success: false, data: "No notice Found" })
    }
}

module.exports.addNotice = async (req, res) => {
    try {
        
        // Retrieve the admin document
        let admin = await adminModel.findOne();
        let { pass, heading, body } = req.params;

        // Check if admin exists
        if (!admin) {
            throw new Error("Admin not found");
        }

        // Compare the password
        const isMatch = await bcrypt.compare(pass, admin.password);
        if (!isMatch) {
            throw new Error("Password incorrect");
        }

        // Create the notice
        const now = new Date();
        const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
        let notice = await noticeModel.create({ date: formattedDate, heading, body });

        // Check if the notice was created successfully
        if (notice) {
            return res.send({ success: true, data: "Notice Added" });
        } else {
            throw new Error("Failed to create notice");
        }
    } catch (error) {
        res.send({ success: false, data: error.message });
    }
};

module.exports.deleteNotice=async (req,res)=>{
    console.log(req.params);
    let {id}=req.params
    try {
        let notice=await noticeModel.findByIdAndDelete({_id:id})
        if(notice){
            res.send({success:true,data:"Deleted Successfully"})
        }
        else{
            throw new Error("Could not Delete")
        }
    } catch (error) {
        res.send({success:false,data:error.message})
    }
    
}

module.exports.fetchFew=async (req,res) => {
    try {
        let response=await noticeModel.find().limit(10).select("heading")
        if(response){
            res.send({success:true,data:response})
        }
        else{
            throw new Error("Could not fetch notice")
        }
    } catch (error) {
        res.send({success:false,data:error.message})
    }
}