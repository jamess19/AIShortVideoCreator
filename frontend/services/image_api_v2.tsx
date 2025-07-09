import axios from "axios";
import { GenerateImageRequest } from "./image_api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v2";
const BASE_URL =  "http://localhost:8000/api/v2";
const api = axios.create({
    baseURL: API_BASE_URL || BASE_URL,
    timeout: 50000
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

export const GenerateImageApiV2 = async (request: GenerateImageRequest) => {
    try {
        console.log(`Request to generate image with model ${request.model}`);
        const response = await api.post("/image/generate", request);
        return response.data;
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
}
