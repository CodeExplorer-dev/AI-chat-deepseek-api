require('dotenv').config()
const { sendMessage } = require('./chat')
async function main() {
  const reply = await sendMessage('你好，请用一句话介绍自己')
  console.log('DeepSeek:', reply)
}

main()