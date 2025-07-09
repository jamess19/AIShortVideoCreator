import axios from "axios";
import { Voice } from "@/lib/models";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v2"
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
export const AutoGenerateScriptApiV2 = async (request) => {
    try {
        const response = await api.post("/video_script", request);
        return response.data;
    } catch (error) {
        console.error("Error generating script:", error);
        throw error;
    }
}
export const GetVideoScriptMetadataApiV2 = async (request) => {
    try {
        console.log(`Request to get video metadata with model ${request.model}`);
        const response = await api.post("/video_script/video_metadata", request);
        return response.data;
    } catch (error) {
        console.error("Error getting video metadata:", error);
        throw error;
    }
}