const axios = require('axios')
const { API_KEY } = require('./config')

const request = axios.create({
  baseURL: 'https://api.deepseek.com',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
})

module.exports = request