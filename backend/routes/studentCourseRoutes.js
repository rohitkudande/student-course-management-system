const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const studentCourseCntrl = require("../controllers/studentCourseCntrl");

// All routes require authentication
//router.post("/student-courses/assign", auth, studentCourseCntrl.assignCourseToStudent);

router.post("/assign", auth, studentCourseCntrl.assignCourseToStudent);
router.get("/:student_id", auth, studentCourseCntrl.getCoursesByStudentId);
router.delete("/:student_id/:course_id", auth, studentCourseCntrl.deleteCourseFromStudent);

module.exports = router;