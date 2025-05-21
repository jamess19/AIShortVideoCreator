import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
});

export const AutoGenerateScriptApi = async (request) => {
    try {
        const response = await api.post("/video_script", request);
        return response.data;
    } catch (error) {
        console.error("Error generating script:", error);
        throw error;
    }
}