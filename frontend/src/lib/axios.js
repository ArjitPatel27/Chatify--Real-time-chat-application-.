import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
    withCredentials:true,
});

//for development local but for production then the url that is required will be used