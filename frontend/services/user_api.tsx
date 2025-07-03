import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1"
const BASE_URL =  "http://localhost:8000/api/v1";

const api = axios.create({
    baseURL: API_BASE_URL || BASE_URL,
    timeout: 50000
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
export const getYoutubeAuthUrlApi = async (redirect_uri: string) => {
    try {
        const response = await api.get(`/user/signin/to-youtube`, {
            params: {redirect_uri}
        });
        return response.data;
    }
    catch (error) {
        console.log("Error get auth url youtube", error)
        throw error;
    }
}
export const getYoutubeAccessToken = async (code: string, redirect_uri: string) =>  {
    try {
        const response = await api.get(`/user/signin/to-youtube/access-token`, {
            params: {code, redirect_uri}
        })
        return response.data;
    }
    catch (error) {
        console.log("error in get access token", error);
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

export const getStatisticApi = async (userId: string) => {
  try {
    const response = await api.get(`/user/${userId}/statistic`);
    console.log(response);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi gọi getStatisticApi:", error);
    throw error;
  }
};