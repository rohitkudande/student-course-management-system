import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getStudents, createStudent, updateStudent, deleteStudent,
} from "../services/api";

const emptyForm = {
  first_name: "", last_name: "", email: "", phone: "",
  gender: "", date_of_birth: "", address: "", city: "", state: "",
};

function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0 });
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchStudents = async (p = page) => {
    setLoading(true);
    try {
      const res = await getStudents(p, limit);
      setStudents(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const openAddModal = () => {
    setForm(emptyForm);
    setEditId(null);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (s) => {
    setForm({
      first_name: s.first_name, last_name: s.last_name, email: s.email,
      phone: s.phone, gender: s.gender,
      date_of_birth: s.date_of_birth ? s.date_of_birth.substring(0, 10) : "",
      address: s.address || "", city: s.city || "", state: s.state || "",
    });
    setEditId(s.id);
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      if (editId) {
        await updateStudent(editId, form);
        Swal.fire("Updated!", "Student updated successfully.", "success");
      } else {
        await createStudent(form);
        Swal.fire("Created!", "Student added successfully.", "success");
      }
      closeModal();
      fetchStudents(page);
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the student.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteStudent(id);
          Swal.fire("Deleted!", "Student has been deleted.", "success");
          const newPage = students.length === 1 && page > 1 ? page - 1 : page;
          setPage(newPage);
          fetchStudents(newPage);
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
          <h4>All Students</h4>
          <button className="btn btn-primary" onClick={openAddModal}>+ Add Student</button>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>City</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr><td colSpan="7" className="text-center text-muted">No students found</td></tr>
                  ) : students.map((s) => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.first_name} {s.last_name}</td>
                      <td>{s.email}</td>
                      <td>{s.phone}</td>
                      <td>{s.gender}</td>
                      <td>{s.city || "-"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-1"
                          onClick={() => navigate(`/students/${s.id}`)}
                        >View</button>
                        <button
                          className="btn btn-sm btn-warning me-1"
                          onClick={() => openEditModal(s)}
                        >Edit</button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(s.id)}
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Total: {pagination.totalRecords} students | Page {pagination.currentPage} of {pagination.totalPages}
              </small>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(page - 1)}>Prev</button>
                  </li>
                  {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                    </li>
                  ))}
                  <li className={`page-item ${page >= (pagination.totalPages || 1) ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? "Edit Student" : "Add New Student"}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {formError && <div className="alert alert-danger">{formError}</div>}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">First Name *</label>
                      <input type="text" name="first_name" className="form-control"
                        value={form.first_name} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Last Name *</label>
                      <input type="text" name="last_name" className="form-control"
                        value={form.last_name} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input type="email" name="email" className="form-control"
                        value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone *</label>
                      <input type="text" name="phone" className="form-control"
                        placeholder="10 digits" value={form.phone} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Gender *</label>
                      <select name="gender" className="form-select" value={form.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date of Birth *</label>
                      <input type="date" name="date_of_birth" className="form-control"
                        value={form.date_of_birth} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <input type="text" name="address" className="form-control"
                        value={form.address} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">City</label>
                      <input type="text" name="city" className="form-control"
                        value={form.city} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">State</label>
                      <input type="text" name="state" className="form-control"
                        value={form.state} onChange={handleChange} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {editId ? "Update Student" : "Add Student"}
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

export default Students;