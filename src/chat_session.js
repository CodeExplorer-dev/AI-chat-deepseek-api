const request = require('./request')
const { MODEL, TEMPERATURE, MAX_TOKENS } = require('./config')

class ChatSession {
  constructor(options = {}) {
    this.history = []
    this.defaultModel = options.model || MODEL
    this.defaultTemperature = options.temperature ?? TEMPERATURE
    this.defaultMaxTokens = options.maxTokens ?? MAX_TOKENS
  }

  // 多轮对话
  async chat(content) {
    this.history.push({ role: 'user', content })

    const response = await request({
      url: '/chat/completions',
      method: 'POST',
      data: {
        model: this.defaultModel,
        messages: this.history,
        temperature: this.defaultTemperature,
        max_tokens: this.defaultMaxTokens
      }
    })

    const reply = response.data.choices[0].message.content
    this.history.push({ role: 'assistant', content: reply })

    return reply
  }

  // 单轮对话
  async sendMessage(content) {
    console.log('单轮对话')

    const response = await request({
      url: '/chat/completions',
      method: 'POST',
      data: {
        model: this.defaultModel,
        messages: [{ role: 'user', content }],
        temperature: this.defaultTemperature,
        max_tokens: this.defaultMaxTokens
      }
    })

    return response.data.choices[0].message.content
  }

  // 获取历史记录
  getHistory() {
    return this.history
  }

  clearHistory() {
    this.history = []
  }
}

module.exports = { ChatSession }