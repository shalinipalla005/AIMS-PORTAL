require("dotenv").config();

const nodemailer = require("nodemailer");
const OTPModel = require("./modals/otp.modal");
const config = require("./config.json");
const mongoose = require('mongoose');
const User = require("./modals/user.modal");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");
const Course = require("./modals/course.modal");

mongoose.connect(config.connectionString, {
  useNewUrlParser: true,
});

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Add in .env
    pass: process.env.EMAIL_PASS, // Add in .env
  },
});

// Test the transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to Gmail:", error);
  } else {
    console.log("Connected to Gmail:", success);
  }
});
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

//create account
// app.post("/create-account", async (req, res) => {
//   const { fullName, email, password, department, category, fa } = req.body;

//   if (!fullName || !email || !password || !department || !category) {
//     return res.status(400).json({ error: true, message: "All fields are required" });
//   }

//   const isUser = await User.findOne({ email });
//   if (isUser) {
//     return res.status(400).json({ error: true, message: "User already exists" });
//   }

//   const user = new User({ fullName, email, password, department, category, fa });
//   await user.save();

//   const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "36000m" });
//   res.json({ error: false, user, accessToken, message: "Registration successful" });
// });

// Login Account
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is Required!!" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is Required!!" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  if (userInfo.email === email && userInfo.password === password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });
    return res.json({
      error: false,
      message: "Login SuccessFul",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id });
  console.log({ user });
  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.json({
    user,
    message: ""
  });
});

// Route to send OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: true, message: "Email is required" });

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: true, message: "User with this email already exists." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

  // Save OTP in the database
  await OTPModel.create({ email, otp, createdAt: new Date() });

  // Send email with OTP
  transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    },
    (err) => {
      if (err) return res.status(500).json({ error: true, message: "Failed to send OTP" });
      res.json({ error: false, message: "OTP sent successfully" });
    }
  );
});

// Send Login OTP
app.post("/send-login-otp", async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ error: true, message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: true, message: "User not found" });

  if (user.email === email && user.password === password) {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    // Save OTP in the database
    await OTPModel.create({ email, otp, createdAt: new Date() });

    // Send email with OTP
    transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Login OTP",
        text: `Your OTP for login is: ${otp}. It is valid for 5 minutes.`,
      },
      (err) => {
        if (err) return res.status(500).json({ error: true, message: "Failed to send OTP" });
        res.json({ error: false, message: "OTP sent successfully" });
      }
    )
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
});

// Route to Verify OTP
app.post("/verify-login-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) return res.status(400).json({ error: true, message: "Email and OTP are required" });

  const validOtp = await OTPModel.findOne({ email, otp });
  if (!validOtp || new Date() - new Date(validOtp.createdAt) > 5 * 60 * 1000) {
    return res.status(400).json({ error: true, message: "Invalid or expired OTP" });
  }

  // Remove used OTP
  await OTPModel.deleteOne({ _id: validOtp._id });

  const user = await User.findOne({ email });
  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "36000m" });
  // console.log(accessToken);
  res.json({ error: false, user, accessToken, message: "OTP verified successfully" });
});

// Route to verify OTP and create account
app.post("/verify-otp", async (req, res) => {
  const { email, otp, fullName, password, department, category, fa } = req.body;

  if (!email || !otp || !fullName || !password || !category) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  const validOtp = await OTPModel.findOne({ email, otp });
  if (!validOtp || new Date() - new Date(validOtp.createdAt) > 5 * 60 * 1000) {
    return res.status(400).json({ error: true, message: "Invalid or expired OTP" });
  }

  await OTPModel.deleteOne({ _id: validOtp._id });

  const isUser = await User.findOne({ email });
  if (isUser) return res.status(400).json({ error: true, message: "User already exists" });

  const user = new User({ fullName, email, password, department, category, fa });
  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "36000m" });
  // console.log(accessToken);
  res.json({ error: false, user, accessToken, message: "Signup successful" });
});

// Admin Route to Add New Course
//Changed
app.post("/add-course", authenticateToken, async (req, res) => {
  const { title, courseCode, instructor, Credits } = req.body;
  // Validate input
  if (!title || !courseCode || !instructor || !Credits) {
    return res.status(400).json({ error: true, message: "All fields (title, courseCode, instructor) are required." });
  }
  const existingCourse = await Course.findOne({ courseCode });
  if (existingCourse) {
    return res.status(400).json({ error: true, message: "Course with this code already exists." });
  }

  try {
    const course = new Course({
      title,
      courseCode,
      instructor,
      Credits,
    });

    await course.save();
    return res.json({
      error: false,
      message: "Course added Successfully",
      course,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server Error",
    });
  }
});

// Route to fetch all users (Admin-only)
app.get("/all-users", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    // Ensure only admin can access this route
    if (user.category !== "Admin") {
      return res.status(403).json({ error: true, message: "Access denied. Admins only." });
    }

    // Fetch all users and exclude sensitive fields like passwords
    const users = await User.find().select("-password");

    res.status(200).json({ error: false, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: true, message: "Failed to fetch users" });
  }
});

app.get("/view-user/:id", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { id } = req.params;

  try {
    // Fetch user by ID
    const userDetails = await User.findById(id).select("-password");
    // console.log(userDetails)

    if (!userDetails) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    res.status(200).json({ error: false, userDetails });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: true, message: "Failed to fetch user details" });
  }
});

// Route to add a new user (Admin-only)
app.post("/add-user", authenticateToken, async (req, res) => {
  console.log(req.body);
  const { fullName, email, password, category, department, fa } = req.body;
  const { user } = req.user;

  try {
    // Ensure only admins can access this route
    if (user.category !== "Admin") {
      return res.status(403).json({ error: true, message: "Access denied. Admins only." });
    }

    // Validate input
    if (!fullName) return res.status(400).json({ error: true, message: "Full name is required" });
    if (!email) return res.status(400).json({ error: true, message: "Email is required" });
    if (!password) return res.status(400).json({ error: true, message: "Password is required" });
    if (!category) return res.status(400).json({ error: true, message: "Category is required" });
    if (!department) return res.status(400).json({ error: true, message: "Department is required" });

    if (category === "Instructor" && typeof fa !== "boolean") {
      return res.status(400).json({ error: true, message: "Faculty Advisor (fa) must be a boolean value" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: true, message: "User with this email already exists" });
    }

    // Create a new user
    const newUser = new User({ fullName, email, password, category, department, fa: category === "Instructor" ? fa : undefined });
    await newUser.save();

    // Send email to the user
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to the AIMS",
      text: `Hello ${fullName},\n\nYour account has been successfully created.\n\nLogin Details:\nEmail: ${email}\nPassword: ${password}\nDepartment: ${department}\nCategory: ${category}${category === "Instructor" ? `\nFaculty Advisor: ${fa ? "Yes" : "No"}` : ""
        }\n\nThank you,\nThe Team`,
    };
    await transporter.sendMail(mailOptions);

    res.status(201).json({ error: false, message: "User added successfully, and email sent", newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: true, message: "Failed to add user" });
  }
});

// Endpoint to get all instructors
app.get("/instructors", authenticateToken, async (req, res) => {
  try {
    // Fetch all users with 'Instructor' category
    const instructors = await User.find({ category: "Instructor" });

    res.status(200).json({
      error: false,
      instructors,
    });
  } catch (error) {
    console.error("Failed to fetch instructors:", error);
    res.status(500).json({ error: true, message: "Failed to fetch instructors" });
  }
});

app.get("/available-courses", authenticateToken, async (req, res) => {
  const { user } = req.user;

  // Get query parameters
  const { page = 1, limit = 10, courseCode } = req.query;

  // Create a query object to filter by courseCode if provided
  const query = {};

  if (courseCode) {
    query.courseCode = courseCode;
  }

  try {
    // Get courses the user has already requested or enrolled in
    const enrolledCourses = await Course.find({
      "enrolledStudents.studentId": user._id,
    }).select("courseCode");

    const requestedCourses = enrolledCourses.map(course => course.courseCode);

    // Exclude courses that the student has already enrolled in or requested
    const availableCourses = await Course.find({
      courseCode: { $nin: requestedCourses } // Exclude requested/enrolled courses
    })
      .skip((page - 1) * limit) // Skip courses for previous pages
      .limit(Number(limit)) // Limit the number of courses per page
      .populate("instructor") // Populate instructor's fullName
      .exec();

    // Calculate the total number of available courses
    const totalCourses = await Course.countDocuments({
      courseCode: { $nin: requestedCourses }
    });

    // Respond with paginated available courses
    res.json({
      error: false,
      courses: availableCourses,
      totalCourses,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCourses / limit),
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error fetching available courses:", error);
    res.status(500).json({ error: true, message: "Failed to fetch available courses" });
  }
});

// Enroll courses to students
app.post("/enroll-course", authenticateToken, async (req, res) => {
  const { courseId } = req.body;
  const { user } = req.user; // Extract user from authenticated token

  try {
    // Ensure user has a department before proceeding
    if (!user.department) {
      return res.status(400).json({ message: 'User does not have a department' });
    }

    // Find the course by courseId
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const response = await fetch('http://localhost:8000/facultyadvisor', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": req.headers.authorization,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch faculty advisor');
    }

    const json = await response.json();
    const instructors = json.instructors;

    const facultyadvisor = instructors.find((instructor) => instructor.department === user.department);
    if (!facultyadvisor) {
      return res.status(404).json({ message: 'No faculty advisor found for this department' });
    }

    const newStudent = {
      studentId: user._id,
      name: user.fullName,
      email: user.email,
      department: user.department,
      faculty: facultyadvisor._id,
      status: "Pending",
    };

    course.enrolledStudents.push(newStudent);

    await course.save();
    res.status(200).json({ message: 'Successfully enrolled student in course' });
  } catch (error) {
    console.error('Error enrolling student:', error.message);
    res.status(500).json({ message: 'Error enrolling student', error: error.message });
  }
});

app.get("/enrolled-courses", authenticateToken, async (req, res) => {
  const { user } = req.user; // Extract user from authenticated token

  try {
    // Find courses where the student is in the enrolledStudents array
    const courses = await Course.find({
      "enrolledStudents.studentId": user._id,
    }).select("title courseCode instructor enrolledStudents");

    // Filter enrolledStudents to show only the current user's enrollment details
    const enrolledCourses = courses.map((course) => {
      const studentDetails = course.enrolledStudents.find(
        (student) => student.studentId.toString() === user._id.toString()
      );

      return {
        title: course.title,
        courseCode: course.courseCode,
        instructor: course.instructor,
        status: studentDetails.status,
      };
    });

    res.status(200).json({ error: false, enrolledCourses });
  } catch (error) {
    console.error("Failed to fetch enrolled courses:", error);
    res.status(500).json({ error: true, message: "Failed to fetch courses" });
  }
});

// for Instructor
app.get("/instructor/pending-enrollments", authenticateToken, async (req, res) => {
  const { user } = req.user; // Extract instructor info from token

  try {
    const courses = await Course.find({ instructor: user._id }).select(
      "title courseCode enrolledStudents"
    );

    // Filter students with pending requests
    const pendingEnrollments = courses.map((course) => ({
      courseId: course._id,
      courseTitle: course.title,
      courseCode: course.courseCode,
      pendingStudents: course.enrolledStudents.filter(
        (student) => student.status === "Pending",

      ),
    }));

    res.status(200).json({ error: false, pendingEnrollments });
  } catch (error) {
    console.error("Failed to fetch pending enrollments:", error);
    res.status(500).json({ error: true, message: "Failed to fetch requests" });
  }
});

app.post("/instructor/update-enrollment", authenticateToken, async (req, res) => {
  const { courseId, studentId, status } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: true, message: "Course not found" });
    }

    // Check if the current user is the instructor
    if (course.instructor.toString() !== req.user.user._id.toString()) {
      return res
        .status(403)
        .json({ error: true, message: "Unauthorized to update this course" });
    }

    // Update the student's status
    const student = course.enrolledStudents.find(
      (s) => s.studentId.toString() === studentId
    );

    if (student) {
      student.status = status; // Update to "Approved" or "Rejected"
      await course.save();

      return res
        .status(200)
        .json({ error: false, message: `Student ${status} successfully` });
    }

    res.status(404).json({ error: true, message: "Student not found" });
  } catch (error) {
    console.error("Failed to update enrollment:", error);
    res.status(500).json({ error: true, message: "Failed to update status" });
  }
});

//FA approval
app.post("/facultyadvisor", authenticateToken, async (req, res) => {
  try {
    const instructors = await User.find({ fa: "true", category: "Instructor" });
    res.status(200).json({
      error: false,
      instructors,
    });
  } catch (error) {
    console.error("Failed to fetch instructors:", error);
    res.status(500).json({ error: true, message: "Failed to fetch instructors" });
  }
});

app.get("/getApproved", authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    const courses = await Course.find({ "enrolledStudents.faculty": user._id });
    const pendingEnrollments = courses.map((course) => ({
      courseId: course._id,
      courseTitle: course.title,
      courseCode: course.courseCode,
      pendingStudents: course.enrolledStudents.filter(
        (student) => student.status === "Pending for FA"
      ),
    }));
    res.status(200).json({ error: false, pendingEnrollments });
  } catch (error) {
    console.error("Failed to fetch pending enrollments:", error);
    res.status(500).json({ error: true, message: "Failed to fetch requests" });
  }
});

app.post("/UpdateStatus", authenticateToken, async (req, res) => {
  const { courseId, studentId, status, faculty } = req.body;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: true, message: "Course not found" });
    }
    console.log(req.user.user);
    console.log("Req", req.user.user._id);
    const hi = req.user.user;
    if (!hi || !hi._id) {
      return res.status(401).json({ error: true, message: "User not authenticated" });
    }
    console.log(faculty);
    if (faculty.toString() !== req.user.user._id.toString()) {
      return res
        .status(403)
        .json({ error: true, message: "Unauthorized to update this course" });
    }

    const student = course.enrolledStudents.find(
      (s) => s.studentId.toString() === studentId
    );

    if (student) {
      student.status = status;
      await course.save();

      return res
        .status(200)
        .json({ error: false, message: `Student ${status} successfully` });
    }

    res.status(404).json({ error: true, message: "Student not found" });
  } catch (error) {
    console.error("Failed to update enrollment:", error);
    res.status(500).json({ error: true, message: "Failed to update status" });
  }
});

app.get('/FetchCourses', authenticateToken, async (req, res) => {
  try {
    const { user } = req.user;
    console.log("User from request:", user);

    if (user.category !== "Instructor") {
      return res.status(400).json({ success: false, error: "Not an Instructor" });
    }

    const courses = await Course.find({ instructor: user._id });
    console.log("Courses from DB:", courses);

    if (!courses || courses.length === 0) {
      return res.status(404).json({ success: false, message: "No courses found" });
    }

    res.status(200).json({
      success: true,
      courses,
      user,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).send({ success: false, msg: 'Failed to fetch courses' });
  }
});

app.get("/users", authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    if (!user || user.category !== "Admin") {
      return res
        .status(403)
        .json({ error: true, message: "Unauthorized to View the List" });
    }
    const users = await User.find();
    console.log(users);
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ success: false, msg: 'Failed to fetch courses' });
  }
})

app.get('/FetchStudents/:id', authenticateToken, async (req, res) => {
  try {
    const courseCode = req.params.id;
    const students = await Course.find({
      courseCode: courseCode,
    }).select("enrolledStudents");
    console.log(students);
    res.status(200).send({ error: false, students, msg: "Students Fetched" })
  }
  catch (e) {
    console.error("Error fetching students:", error);
    res.status(500).send({ error: true, msg: 'Failed to fetch students' });
  }
});
app.listen(port, () => {
  console.log(`Listening in port : ${port}`);
});

module.exports = app;