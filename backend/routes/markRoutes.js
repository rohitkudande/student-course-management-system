const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const markCntrl = require("../controllers/markCntrl");

// All routes require authentication

router.post("/", auth, markCntrl.addMarks);

router.get("/:student_id", auth, markCntrl.getStudentMarks);

router.put("/:id", auth, markCntrl.updateMarks);

router.delete("/:id", auth, markCntrl.deleteMarks);

module.exports = router;