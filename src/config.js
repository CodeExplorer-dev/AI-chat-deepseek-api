require('dotenv').config()

module.exports = {
  API_KEY: process.env.DEEPSEEK_API_KEY,
  MODEL: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  TEMPERATURE: parseFloat(process.env.DEEPSEEK_TEMPERATURE) || 0.7,
  MAX_TOKENS: parseInt(process.env.DEEPSEEK_MAX_TOKENS) || 2000
}