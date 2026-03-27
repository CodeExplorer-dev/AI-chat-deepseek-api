require('dotenv').config()
const axios = require('axios')

const API_KEY = process.env.DEEPSEEK_API_KEY

async function simpleChat() {
  console.log("开始对话\n")

  try {
    // 发送请求
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
            { role: 'user', content: '你好，请用一句话介绍自己' }
        ]
      },
      {
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        }
      }
    )

    // 获取回复
    const reply = response.data.choices[0].message.content
    console.log('DeepSeek:', reply)
  } catch (error) {
    console.error('错误:', error.response?.data?.error?.message || error.message);
  }
}

simpleChat()