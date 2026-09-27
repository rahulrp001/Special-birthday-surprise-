import axios from 'axios'

// Single place that knows the backend's address. Every component imports
// from here instead of writing URLs directly, so the address only ever
// needs to change in one spot.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Every function below returns a plain object: { success, data, message }.
// Components never have to deal with axios or raw error objects directly.

export async function loginRequest(username, dateOfBirth) {
  try {
    const response = await client.post('/login/', {
      username,
      date_of_birth: dateOfBirth,
    })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      message: extractMessage(error, "Oops! This little surprise is only for you ❤️"),
    }
  }
}

export async function fetchBirthday() {
  try {
    const response = await client.get('/birthday/')
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: extractMessage(error, "Couldn't load the surprise. Please try again.") }
  }
}

export async function fetchMemories() {
  try {
    const response = await client.get('/memories/')
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: extractMessage(error, "Couldn't load the memories right now.") }
  }
}

export async function fetchReasons() {
  try {
    const response = await client.get('/reasons/')
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: extractMessage(error, "Couldn't load this section right now.") }
  }
}

export async function fetchMessages() {
  try {
    const response = await client.get('/messages/')
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: extractMessage(error, "Couldn't load the messages right now.") }
  }
}

export async function fetchCountdown() {
  try {
    const response = await client.get('/countdown/')
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: extractMessage(error, "Couldn't load the countdown right now.") }
  }
}

function extractMessage(error, fallback) {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message
  }
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    return "Can't reach the server. Is the backend running?"
  }
  return fallback
}

export { API_BASE_URL }

// ── Admin API ──────────────────────────────────────────────────────────────

function adminClient(password) {
  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: { 'X-Admin-Password': password },
  })
}

export async function adminLogin(password) {
  try {
    const res = await client.post('/admin/login/', { password })
    return { success: res.data.success }
  } catch {
    return { success: false, message: 'Wrong password' }
  }
}

export async function adminGetBirthday(password) {
  try {
    const res = await adminClient(password).get('/admin/birthday/')
    return { success: true, data: res.data }
  } catch (e) {
    return { success: false, message: extractMessage(e, 'Failed to load') }
  }
}

export async function adminUpdateBirthday(password, formData) {
  try {
    const res = await adminClient(password).put('/admin/birthday/', formData)
    return { success: true, data: res.data }
  } catch (e) {
    return { success: false, message: extractMessage(e, 'Update failed') }
  }
}

export async function adminGetMemories(password) {
  try {
    const res = await adminClient(password).get('/admin/memories/')
    return { success: true, data: res.data }
  } catch (e) {
    return { success: false, message: extractMessage(e, 'Failed to load') }
  }
}

export async function adminAddMemory(password, formData) {
  try {
    const res = await adminClient(password).post('/admin/memories/', formData)
    return { success: true, data: res.data }
  } catch (e) {
    return { success: false, message: extractMessage(e, 'Upload failed') }
  }
}

export async function adminDeleteMemory(password, id) {
  try {
    await adminClient(password).delete(`/admin/memories/${id}/`)
    return { success: true }
  } catch (e) {
    return { success: false, message: extractMessage(e, 'Delete failed') }
  }
}

export async function adminGetReasons(password) {
  try {
    const res = await adminClient(password).get('/admin/reasons/')
    return { success: true, data: res.data }
  } catch (e) {
    return { success: false, message: extractMessage(e, 'Failed to load') }
  }
}

export async function adminAddReason(password, data) {
  try {
    const res = await adminClient(password).post('/admin/reasons/', data)
    return { success: true, data: res.data }
  } catch (e) {
    return { success: false, message: extractMessage(e, 'Add failed') }
  }
}

export async function adminDeleteReason(password, id) {
  try {
    await adminClient(password).delete(`/admin/reasons/${id}/`)
    return { success: true }
  } catch (e) {
    return { success: false, message: extractMessage(e, 'Delete failed') }
  }
}

export async function adminChangePassword(password, newPassword) {
  try {
    await adminClient(password).post('/admin/change-password/', { new_password: newPassword })
    return { success: true }
  } catch (e) {
    return { success: false, message: extractMessage(e, 'Password change failed') }
  }
}
