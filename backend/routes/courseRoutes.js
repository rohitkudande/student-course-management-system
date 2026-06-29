const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const courseCntrl = require("../controllers/courseCntrl");

// All routes require authentication

router.post("/", auth, courseCntrl.createCourse);

router.get("/", auth, courseCntrl.getAllCourses);

router.get("/:id", auth, courseCntrl.getCourseById);

router.put("/:id", auth, courseCntrl.updateCourse);

router.delete("/:id", auth, courseCntrl.deleteCourse);

module.exports = router;