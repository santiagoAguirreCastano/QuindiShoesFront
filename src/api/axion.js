import axios from "axios";


const axiosClient = axios.create({
  baseURL: "https://quindishoes-backend-def.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});



axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use((response) => {
  const nuevoToken = response.headers["x-renewed-token"];
  console.log("Token recibido en header:", nuevoToken); // <-- Agrega esto
  if (nuevoToken) {
    localStorage.setItem("token", nuevoToken);
  }
  return response;
});

export default axiosClient;