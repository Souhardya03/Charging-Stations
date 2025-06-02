import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: true,
})

export const login = (data) => api.post('/login', data,{
  withCredentials: true,
}).then((res) => res)

export const register = (data) => api.post('/register', data).then((res) => res)

export const logout = () => api.post('/logout').then((res) => res)
