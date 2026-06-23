import api from './client'

export const listAgents = () =>
  api.get('/agents').then(r => r.data)

export const runAgent = (agentName, input) =>
  api.post('/agents/run', { agentName, input }).then(r => r.data)
