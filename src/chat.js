const request = require('./request')
const { MODEL, TEMPERATURE, MAX_TOKENS } = require('./config')

async function sendMessage(content, options={}) {
  console.log("开始对话\n")

  const response = await request({
    url: '/chat/completions',
    method: 'POST',
    data: {
      model: options.model || MODEL,
      messages: [{ role: 'user', content }],
      temperature: options.temperature ?? TEMPERATURE,
      max_tokens: options.maxTokens ?? MAX_TOKENS
    }
  })

  return response.data.choices[0].message.content
}

module.exports = { sendMessage }