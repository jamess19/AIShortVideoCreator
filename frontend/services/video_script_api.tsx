import axios from "axios";
import { Voice } from "@/lib/models";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1"
const BASE_URL =  "http://localhost:8000/api/v1";
const api = axios.create({
    baseURL: API_BASE_URL || BASE_URL,
    timeout: 50000
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
export const AutoGenerateScriptApi = async (request) => {
    try {
        const response = await api.post("/video_script", request);
        return response.data;
    } catch (error) {
        console.error("Error generating script:", error);
        throw error;
    }
}
export const GetVideoScriptMetadataApi = async (request) => {
    try {
        const response = await api.post("/video_script/video_metadata", request);
        return response.data;
    } catch (error) {
        console.error("Error getting video metadata:", error);
        throw error;
    }
}
export const GetVoicesApi = async () => {
    try {
        const response = await api.get("/video_script/voice");
        return response.data as Voice[];
    } catch (error) {
        console.error("Error fetching voices:", error);
        throw error;
    }
}
export const GetVoiceByIdApi = async (voiceId: string) => {
    try {
        const response = await api.get(`/video_script/voice/${voiceId}`);
        return response.data as Voice;
    } catch (error) {
        console.error("Error fetching voice by ID:", error);
        throw error;
    }
}