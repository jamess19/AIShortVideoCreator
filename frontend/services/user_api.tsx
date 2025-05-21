import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
});

export const LogInApi = async (signInRequest) => {
    try {
        const response = await api.post("/user/signin", signInRequest);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}
export const RegisterApi = async (signUpRequest) => {
    try {
        const response = await api.post("/user", signUpRequest);
        return response.data;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
}