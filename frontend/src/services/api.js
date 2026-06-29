import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

// Students
export const getStudents = (page = 1, limit = 5) =>
  API.get(`/students?page=${page}&limit=${limit}`);
export const getStudentById = (id) => API.get(`/students/${id}`);
export const createStudent = (data) => API.post("/students", data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// Courses
export const getCourses = () => API.get("/courses");
export const getCourseById = (id) => API.get(`/courses/${id}`);
export const createCourse = (data) => API.post("/courses", data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// Student-Courses
export const assignCourse = (data) => API.post("/student-courses/assign", data);
export const getCoursesByStudent = (student_id) =>
  API.get(`/student-courses/${student_id}`);
export const removeCourseFromStudent = (student_id, course_id) =>
  API.delete(`/student-courses/${student_id}/${course_id}`);

// Marks
export const addMarks = (data) => API.post("/marks", data);
export const getMarksByStudent = (student_id) =>
  API.get(`/marks/${student_id}`);
export const updateMarks = (id, data) => API.put(`/marks/${id}`, data);
export const deleteMarks = (id) => API.delete(`/marks/${id}`);