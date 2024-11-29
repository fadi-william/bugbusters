import axios from "axios";
export { AxiosError } from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Add an interceptor to include the JWT token in the headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
