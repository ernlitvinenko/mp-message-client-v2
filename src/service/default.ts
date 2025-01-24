// import axios from "axios";
import axios from "axios";
export const BASE_HOST = "http://localhost:8000"
export const API_URL = `${BASE_HOST}/api`

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
})

$api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    return config
})

export default $api