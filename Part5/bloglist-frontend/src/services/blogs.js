import axios from 'axios'
const url = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(url)
  return request.then(response => response.data)
}

const create = async (newBlog) => {
  const setHeader = {
    headers: { 'Authorization': token },
  }
  const response = await axios.post(url, newBlog, setHeader)
  return response.data
}

const update = async(id, newObject) => {
  const response = await axios.put(`${url}/${id}`, newObject)
  return response.data
}

const deleteBlog = async(id) => {
  const setHeader = {
    headers: { 'Authorization': token },
  }
  const response = await axios.delete(`${url}/${id}`, setHeader)
  return response.data
}


export default { getAll, create, update, deleteBlog, setToken }