import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      alert("Registration Successfull...!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow" style={{ width: "400px" }}>
        <div className="card-body p-4">
          <h4 className="card-title text-center mb-4">Student Management System</h4>
          <h5 className="text-center text-muted mb-4">Register</h5>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text" name="username" className="form-control"
                placeholder="Enter username" value={form.username}
                onChange={handleChange} required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email" name="email" className="form-control"
                placeholder="Enter email" value={form.email}
                onChange={handleChange} required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password" name="password" className="form-control"
                placeholder="Min 6 characters" value={form.password}
                onChange={handleChange} required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="text-center mt-3 mb-0">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;