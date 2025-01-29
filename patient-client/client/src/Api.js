import axios from 'axios'

export const Api = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000'
})

Api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

Api.interceptors.response.use(async function (response) {
  return response
}, async function (error) {
  if (error.response && error.response.status === 401) {
    delete Api.defaults.headers.common.authorization
    localStorage.removeItem('token')
    window.location = '/authentication'
  } else if (error.response && (error.response.status === 504 || error.response.status === 500)) {
    alert('Unfortunately, something went wrong on our end. Try again in a moment.')
  }
  return Promise.reject(error)
})
