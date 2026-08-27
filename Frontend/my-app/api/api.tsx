import axios from "axios"
import App from "next/app"


const API = 'http://127.0.0.1:8000/api/'

export const instance = axios.create(
    {
        baseURL:`${API}`,
        headers: { 'Content-Type': 'application/json' }
    }
)

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

