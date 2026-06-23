import api from './client'

export const createTask = (payload) =>
  api.post('/tasks', payload).then(r => r.data)

export const listTasks = () =>
  api.get('/tasks').then(r => r.data)

export const getTask = (id) =>
  api.get(`/tasks/${id}`).then(r => r.data)
