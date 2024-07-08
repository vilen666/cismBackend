const mongoose = require('mongoose');

const campusSchema = mongoose.Schema({
    name:String,
  pictures: [
    {
      contentType: String,
      data: Buffer
    }
  ]
});

const campusModel = mongoose.model('campus', campusSchema);

module.exports = campusModel;