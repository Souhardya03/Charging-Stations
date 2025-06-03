import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: true,
})

export const login = (data) => api.post('/login', data).then((res) => res)

export const register = (data) => api.post('/register', data).then((res) => res)

export const logout = () => api.post('/logout',{
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
}).then((res) => res)
