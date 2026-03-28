import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  return await api.post("/auth/register", data);
};

export const login = async (data: { email: string; password: string }) => {
  return await api.post("/auth/login", data);
};

export type CoursePayload = {
  title: string;
  teacher: string;
  price: string;
  image?: string;
  description?: string;
};

export const getCourses = async () => {
  return await api.get("/course");
};

export const getCourseById = async (id: string) => {
  return await api.get(`/course/${id}`);
};

export const createCourse = async (data: CoursePayload) => {
  return await api.post("/course", data);
};

export const updateCourse = async (id: string, data: Partial<CoursePayload>) => {
  return await api.patch(`/course/${id}`, data);
};

export const deleteCourse = async (id: string) => {
  return await api.delete(`/course/${id}`);
};
