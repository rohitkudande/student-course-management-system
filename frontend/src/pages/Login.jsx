import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Login Success...!");
      navigate("/students");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow" style={{ width: "400px" }}>
        <div className="card-body p-4">
          <h4 className="card-title text-center mb-4">Student Management System</h4>
          <h5 className="text-center text-muted mb-4">Login</h5>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
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
                placeholder="Enter password" value={form.password}
                onChange={handleChange} required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-center mt-3 mb-0">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;