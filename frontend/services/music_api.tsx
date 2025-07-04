import axios from "axios";
import { MusicTrack } from "@/lib/models";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1";
const BASE_URL =  "http://localhost:8000/api/v1"; // Fallback base URL
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

export const GetMusicTracksApi = async () => {
    try {
        const response = await api.get("/music_track");
        return response.data as MusicTrack[];
    } catch (error) {
        console.error("Error fetching music tracks:", error);
        throw error;
    }
}