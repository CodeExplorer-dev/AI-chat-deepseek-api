const { ChatSession } = require('./chat_session')

async function main() {
  const session = new ChatSession
  // 多轮对话
  console.log('==多轮对话==')
  const reply1 = await session.chat('世界第一高峰是哪个？')
  console.log('助手：', reply1)

  const reply2 = await session.chat('第二呢？')
  console.log('助手：', reply2)

  // 单轮对话
  console.log('==单轮对话==')
  const reply3 = await session.sendMessage('今天天气如何？')
  console.log('助手:', reply3)

  console.log('\n=== 查看历史记录 ===')
  console.log(JSON.stringify(session.getHistory(), null, 2))
  
  console.log('\n=== 清空历史 ===')
  session.clearHistory()
  console.log('历史已清空，当前历史:', session.getHistory())
}

main()