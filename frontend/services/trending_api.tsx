import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL  + "/api/v1"
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

export const GetTrendingContentsInYoutubeApi = async (keyword: string, limit: number) => {
    try {
        const response = await api.get("/trending/youtube",{
            params: { keyword: keyword, limit: limit }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching trending YouTube contents:", error);
        throw error;
    }
}
export const GetTrendingContentsInWikipediaApi = async (keyword: string, limit: number) => {
    try {
        const response = await api.get("/trending/wikipedia",{
            params:{keyword: keyword, limit: limit}
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching trending Wikipedia contents:", error);
        throw error;
    }
}