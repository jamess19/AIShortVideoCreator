import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";
const api = axios.create({
    baseURL: BASE_URL,
    //timeout: 50000,
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

// Lấy url để đăng nhập Youtube -> oke
export const getYoutubeAuthUrlApi = async (redirect_uri: string) => {
    try {
        const response = await api.get("/youtube/login", {
            params: {redirect_uri}
        });
        return response.data.auth_url;
    }
    catch (error) {
        console.log("Error get auth url youtube", error)
        throw error;
    }
}

// Lấy url để đăng nhập facebook -> 
export const getFacebookthUrlApi = async (redirect_uri: string) => {
    try {
        const response = await api.get("/facebook/login-url", {
            params: {redirect_uri}
        });
        return response.data.auth_url;
    }
    catch (error) {
        console.log("Error get auth url youtube", error)
        throw error;
    }
}
// Lấy access token từ code trả về của đăng nhập youtube -> oke
export const getYoutubeAccessToken = async (code: string, redirect_uri: string) =>  {
    try {
        const response = await api.get("/youtube/callback", {
            params: {code, redirect_uri}
        })
        return response.data.access_token;
    }
    catch (error) {
        console.log("error in get access token", error);
        throw error;
    }
}

// Lấy access token từ code của facebook
export const getFacebookAccessToken = async (code: string, redirect_uri: string) =>  {
    try {
        const response = await api.get("/facebook/callback", {
            params: {code, redirect_uri}
        })
        return response.data.access_token;
    }
    catch (error) {
        console.log("error in get access token", error);
        throw error;
    }
}


// Search query -> oke
export const searchTrendingVideos = async (keyword: string) => {
    try {
    const response = await api.get(`/search/${encodeURIComponent(keyword)}`)
    return response.data; // List[ExternalItem]
    } catch (error) {
    console.error("Search trending failed:", error);
    throw error;
    }
}

// upload video
export const uploadVideoApi = async (upload_video: any, youtubeToken: string) => {
    try {
        const response = await api.post("/upload_video",upload_video,
            {headers: {
                "youtube-token": youtubeToken, // ← đúng tên header backend mong đợi
                }
            }
        )
        return response.data
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export const EditVideoApi = async (request: any) =>{
    try {
        const response = await api.put(`/video/${request.videoId}`, request);
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
export const GetVideosApi = async()  => {
    try {
        const response = await api.get("/video");
        return response.data; 
    } catch (error) {
        console.error("Error fetching videos:", error);
        throw error;
    }
}