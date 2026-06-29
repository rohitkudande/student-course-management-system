import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  getCourses, createCourse, updateCourse, deleteCourse,
} from "../services/api";

const emptyForm = {
  course_name: "", course_code: "", duration: "", fees: "", description: "",
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getCourses();
      setCourses(res.data.courses || []);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const openAddModal = () => {
    setForm(emptyForm);
    setEditId(null);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (c) => {
    setForm({
      course_name: c.course_name, course_code: c.course_code,
      duration: c.duration, fees: c.fees, description: c.description || "",
    });
    setEditId(c.id);
    setFormError("");
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      const payload = { ...form, fees: parseFloat(form.fees) };
      if (editId) {
        await updateCourse(editId, payload);
        Swal.fire("Updated!", "Course updated successfully.", "success");
      } else {
        await createCourse(payload);
        Swal.fire("Created!", "Course added successfully.", "success");
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the course.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCourse(id);
          Swal.fire("Deleted!", "Course has been deleted.", "success");
          fetchCourses();
        } catch (err) {
          Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
        }
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>All Courses</h4>
          <button className="btn btn-primary" onClick={openAddModal}>+ Add Course</button>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Course Name</th>
                  <th>Code</th>
                  <th>Duration</th>
                  <th>Fees</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr><td colSpan="7" className="text-center text-muted">No courses found</td></tr>
                ) : courses.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.course_name}</td>
                    <td><span className="badge bg-secondary">{c.course_code}</span></td>
                    <td>{c.duration}</td>
                    <td>₹{c.fees}</td>
                    <td>{c.description || "-"}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-1" onClick={() => openEditModal(c)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? "Edit Course" : "Add New Course"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {formError && <div className="alert alert-danger">{formError}</div>}
                  <div className="mb-3">
                    <label className="form-label">Course Name *</label>
                    <input type="text" name="course_name" className="form-control"
                      value={form.course_name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Course Code *</label>
                    <input type="text" name="course_code" className="form-control"
                      value={form.course_code} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Duration *</label>
                    <input type="text" name="duration" className="form-control"
                      placeholder="e.g. 6 months" value={form.duration} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fees (₹) *</label>
                    <input type="number" name="fees" className="form-control"
                      min="1" value={form.fees} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-control" rows="3"
                      value={form.description} onChange={handleChange}></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {editId ? "Update Course" : "Add Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Courses;