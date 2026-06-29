import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import Courses from "./pages/Courses";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/students" element={<PrivateRoute><Students /></PrivateRoute>} />
        <Route path="/students/:id" element={<PrivateRoute><StudentDetail /></PrivateRoute>} />
        <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;