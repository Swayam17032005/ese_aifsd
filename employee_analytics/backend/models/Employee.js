const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  department: {
    type: String,
    required: [true, 'Please add a department']
  },
  skills: {
    type: [String],
    required: [true, 'Please add at least one skill']
  },
  performanceScore: {
    type: Number,
    required: [true, 'Please add a performance score'],
    min: 0,
    max: 100
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
