import axios from "axios";
import { io } from "socket.io-client";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_HOST
});

export const setAuthToken =(token: string | null) => {
    if(token){
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    else{
        delete api.defaults.headers.common["Authorization"];
    }
}


export const uploadFile = async (file: File) => {
    const token = localStorage.getItem('accessToken');
    console.group(token)
    if (!token) {
        throw new Error("Authentication token is missing.");
    }

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('file_name', file.name); // Add file name
        formData.append('file_type', file.name.split('.').pop()?.toUpperCase() || '');formData.append('file', file);
        console.log("FLAAAAAAAAAAAG")

        const response = await api.post('/files/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,  // Make sure the token is included here
            },
        });
        return response.data;  // Return the API response
    } catch (error) {
        console.error('File upload failed', error);
        throw error;  // Throw the error for the component to handle
    }
};

export const fetchUserFiles = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    
    if (refreshToken) {
      
      const response = await api.post("/users/api/token/refresh/", { refresh: refreshToken });

      
      const newAccessToken = response.data.access;
      
      
      localStorage.setItem("accessToken", newAccessToken);
      
      
      api.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
    }
    try {
        const response = await api.get('/files/listFiles/');
        return response.data;
    } catch (error) {
        console.error("Error fetching user files:", error);
        throw error;
    }
};

export const generateQuiz = async (fileID: number) =>{

    const token = localStorage.getItem('accessToken');
    console.group(token)
    if (!token) {
        throw new Error("Authentication token is missing.");
    }

    try{
        const quizData = await api.get(`quiz/generateQuiz/${fileID}`)
        return quizData.data
    }catch (error){
        console.error("Failed to retrieve quiz!", error);
        throw error;
    }

}

export const updateScore = async (fileID: number|null, score: number)=>{
    const token = localStorage.getItem('accessToken');
    console.group(token)
    if (!token) {
        throw new Error("Authentication token is missing.");
    }

    try{
        const response = api.post('/files/updateScore/', {fileID, score});
        console.log(response);
    }catch(error){
        console.log(error);
        throw error;
    }
}

export const deleteFile = async (fileID: number) => {
    const token = localStorage.getItem('accessToken');
    console.group(token);
    if (!token) {
        throw new Error("Authentication token is missing.");
    }

    try {
        const response = await api.delete(`/files/delete/${fileID}/`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Include the authentication token
            },
        });
        return response.data; // Return the response data if needed
    } catch (error) {
        console.error("File deletion failed", error);
        throw error; // Throw the error for the component to handle
    }
};

export const createWebSocketConnection = (lobbyCode: string, setLobbyData: (data: any) => void) => {
  const socket = io(`ws://${process.env.NEXT_PUBLIC_HOST}/ws/lobby/${lobbyCode}/`); // replace with your backend URL
  
  // On receiving data from the server
  socket.on('lobby_data', (data) => {
    setLobbyData(data);  // Store received data to state
  });

  // Handle socket connection error
  socket.on('connect_error', (err) => {
    console.error("WebSocket connection error:", err);
  });

  return socket;
};


export default api;