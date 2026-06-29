import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getStudentById,
  getCourses,
  assignCourse, removeCourseFromStudent,
  addMarks, updateMarks, deleteMarks,
} from "../services/api";

function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [marks, setMarks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Marks form
  const [markForm, setMarkForm] = useState({ subject: "", marks: "" });
  const [markError, setMarkError] = useState("");
  const [editMarkId, setEditMarkId] = useState(null);
  const [showMarkModal, setShowMarkModal] = useState(false);

  // Course assign form
  const [courseId, setCourseId] = useState("");
  const [courseError, setCourseError] = useState("");
  const [showCourseModal, setShowCourseModal] = useState(false);

  const fetchStudent = async () => {
    try {
      const res = await getStudentById(id);
      setStudent(res.data.student);
      setMarks(res.data.marks || []);
      setCourses(res.data.courses || []);
    } catch {
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const res = await getCourses();
      setAllCourses(res.data.courses || []);
    } catch {
      setAllCourses([]);
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchAllCourses();
  }, [id]);

  // --- Marks ---
  const openAddMark = () => {
    setMarkForm({ subject: "", marks: "" });
    setEditMarkId(null);
    setMarkError("");
    setShowMarkModal(true);
  };

  const openEditMark = (m) => {
    setMarkForm({ subject: m.subject, marks: m.marks });
    setEditMarkId(m.id);
    setMarkError("");
    setShowMarkModal(true);
  };

  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    setMarkError("");
    try {
      if (editMarkId) {
        await updateMarks(editMarkId, markForm);
        Swal.fire("Updated!", "Marks updated.", "success");
      } else {
        await addMarks({ student_id: parseInt(id), ...markForm, marks: parseInt(markForm.marks) });
        Swal.fire("Added!", "Marks added.", "success");
      }
      setShowMarkModal(false);
      fetchStudent();
    } catch (err) {
      setMarkError(err.response?.data?.message || "Failed");
    }
  };

  const handleDeleteMark = (markId) => {
    Swal.fire({
      title: "Delete Marks?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (r) => {
      if (r.isConfirmed) {
        await deleteMarks(markId);
        Swal.fire("Deleted!", "Marks deleted.", "success");
        fetchStudent();
      }
    });
  };

  // --- Courses ---
  const handleAssignCourse = async (e) => {
    e.preventDefault();
    setCourseError("");
    try {
      await assignCourse({ student_id: parseInt(id), course_id: parseInt(courseId) });
      Swal.fire("Assigned!", "Course assigned to student.", "success");
      setCourseId("");
      setShowCourseModal(false);
      fetchStudent();
    } catch (err) {
      setCourseError(err.response?.data?.message || "Failed");
    }
  };

  const handleRemoveCourse = (cid) => {
    Swal.fire({
      title: "Remove Course?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, remove!",
    }).then(async (r) => {
      if (r.isConfirmed) {
        await removeCourseFromStudent(id, cid);
        Swal.fire("Removed!", "Course removed.", "success");
        fetchStudent();
      }
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      </>
    );
  }

  if (!student) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="alert alert-danger">Student not found.</div>
          <button className="btn btn-secondary" onClick={() => navigate("/students")}>Back</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => navigate("/students")}>
          ← Back to Students
        </button>

        {/* Student Info */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Student Details</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p><strong>Name:</strong> {student.first_name} {student.last_name}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Phone:</strong> {student.phone}</p>
                <p><strong>Gender:</strong> {student.gender}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Date of Birth:</strong> {student.date_of_birth?.substring(0, 10)}</p>
                <p><strong>Address:</strong> {student.address || "-"}</p>
                <p><strong>City:</strong> {student.city || "-"}</p>
                <p><strong>State:</strong> {student.state || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Marks */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Marks</h6>
            <button className="btn btn-sm btn-primary" onClick={openAddMark}>+ Add Marks</button>
          </div>
          <div className="card-body p-0">
            <table className="table table-sm table-bordered mb-0">
              <thead className="table-light">
                <tr><th>#</th><th>Subject</th><th>Marks</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {marks.length === 0 ? (
                  <tr><td colSpan="4" className="text-center text-muted py-3">No marks found</td></tr>
                ) : marks.map((m, i) => (
                  <tr key={m.id}>
                    <td>{i + 1}</td>
                    <td>{m.subject}</td>
                    <td>{m.marks}/100</td>
                    <td>
                      <button className="btn btn-xs btn-warning btn-sm me-1" onClick={() => openEditMark(m)}>Edit</button>
                      <button className="btn btn-xs btn-danger btn-sm" onClick={() => handleDeleteMark(m.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assigned Courses */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Assigned Courses</h6>
            <button className="btn btn-sm btn-primary" onClick={() => { setCourseError(""); setShowCourseModal(true); }}>
              + Assign Course
            </button>
          </div>
          <div className="card-body p-0">
            <table className="table table-sm table-bordered mb-0">
              <thead className="table-light">
                <tr><th>#</th><th>Course Name</th><th>Code</th><th>Duration</th><th>Fees</th><th>Assigned Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr><td colSpan="7" className="text-center text-muted py-3">No courses assigned</td></tr>
                ) : courses.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td>{c.course_name}</td>
                    <td>{c.course_code}</td>
                    <td>{c.duration}</td>
                    <td>₹{c.fees}</td>
                    <td>{c.assigned_date?.substring(0, 10)}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleRemoveCourse(c.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Marks Modal */}
      {showMarkModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editMarkId ? "Edit Marks" : "Add Marks"}</h5>
                <button className="btn-close" onClick={() => setShowMarkModal(false)}></button>
              </div>
              <form onSubmit={handleMarkSubmit}>
                <div className="modal-body">
                  {markError && <div className="alert alert-danger">{markError}</div>}
                  <div className="mb-3">
                    <label className="form-label">Subject *</label>
                    <input type="text" className="form-control" value={markForm.subject}
                      onChange={(e) => setMarkForm({ ...markForm, subject: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Marks (0–100) *</label>
                    <input type="number" className="form-control" min="0" max="100"
                      value={markForm.marks}
                      onChange={(e) => setMarkForm({ ...markForm, marks: e.target.value })} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowMarkModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editMarkId ? "Update" : "Add"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Course Modal */}
      {showCourseModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign Course</h5>
                <button className="btn-close" onClick={() => setShowCourseModal(false)}></button>
              </div>
              <form onSubmit={handleAssignCourse}>
                <div className="modal-body">
                  {courseError && <div className="alert alert-danger">{courseError}</div>}
                  <div className="mb-3">
                    <label className="form-label">Select Course *</label>
                    <select className="form-select" value={courseId}
                      onChange={(e) => setCourseId(e.target.value)} required>
                      <option value="">-- Select Course --</option>
                      {allCourses.map((c) => (
                        <option key={c.id} value={c.id}>{c.course_name} ({c.course_code})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCourseModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Assign</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StudentDetail;