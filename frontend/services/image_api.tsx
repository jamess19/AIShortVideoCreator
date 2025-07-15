import axios from "axios";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1";
const BASE_URL =  "http://localhost:8000/api/v1";
const api = axios.create({
    baseURL: API_BASE_URL || BASE_URL,
    timeout: 100000
});

api.interceptors.request.use(
    (config) => {
        const accessToken = sessionStorage.getItem("accessToken");
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

export const GenerateImageApi = async (request: GenerateImageRequest) => {
    try {
        const response = await api.post("/image/generate", request);
        return response.data;
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
}

export interface GenerateImageRequest {
    content: string;
    style?: string;
    image_ratio?: string;
    model?: string;
}