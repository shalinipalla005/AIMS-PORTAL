const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Course Schema
const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
    unique: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  Credits: {
    type: Number,
    required: true,
  },
  enrolledStudents: [
    {
      studentId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      department:{
        type:String,
        required:true,
      },
      faculty:{
         type:String,
         required:true,
      },
      instructor:{
        type:String,
      },
      status: {
        type: String,
        enum: ["Pending","Pending for FA", "Approved","Enrolled","Rejected"],
        default: "Not enrolled.",
      },
    },
  ],

}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create Course model and export it
module.exports = mongoose.model('Course', courseSchema);
/**/