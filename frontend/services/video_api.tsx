import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v2";
const BASE_URL = "http://localhost:8000/api/v1"; 
const api = axios.create({
    baseURL: API_BASE_URL || BASE_URL,
    timeout: 100000
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

// upload video
export const uploadVideoToYoutubeApi = async (request: any) => {
    try {
        const response = await api.post("/video/upload/to-youtube", request)
        return response.data
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export const EditVideoApi = async (request: any) =>{
    try {
        const response = await api.put(`/video/${request.public_id}`, request);
        return response.data;
    } catch (error) {
        console.error("Error updating video:", error);
        throw error;
    }
}
export const GetVideoByIdApi = async (videoId: string) => {
    try {
        const response = await api.get(`/video/${videoId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching video by ID:", error);
        throw error;
    }
}
export const GetVideosApi = async(request: any)  => {
    try {
        const url = `/video?${new URLSearchParams(request).toString()}`;
        const response = await api.get(url);
        return response.data; 
    } catch (error) {
        console.error("Error fetching videos:", error);
        throw error;
    }
}