import axios from "axios";


const BASE_URL = "http://localhost:8000/api/v1";
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 50000
});

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
    width: number;
    height: number;
}