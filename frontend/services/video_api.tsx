import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
});
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const cleanToken = accessToken.replace(/"/g, '');
            config.headers.Authorization = `Bearer ${cleanToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const CreateVideoApi = async (request : any) => {
    try {
        const response = await api.post("/video", request);
        return response.data;
    } catch (error) {
        console.error("Error creating video:", error);
        throw error;
    }
}