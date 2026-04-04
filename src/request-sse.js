const { API_KEY, MODEL } = require('./config')

/**
 * SSE 流式请求 DeepSeek API
 * @param {Array} messages - 对话历史消息
 * @param {Object} options - 可选配置
 * @returns {ReadableStream} Node.js 可读流
 */
async function createSSEStream(messages, options={}) {
  // 1. 发起流式请求
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: options.model || MODEL,
      messages,
      stream: true, // 启用流式输出
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000
    })
  })

  // 2. 错误处理
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'API request failed')
  }

  // 3. 返回响应体流
  // response.body.getReader() // 可以逐块读取数据
  return response.body  // ReadableStream 对象
}

/**
 * 将 SSE 数据流转换为格式化的事件流
 * @param {ReadableStream} stream - fetch 的响应流
 * @returns {ReadableStream} 格式化后的 SSE 流
 */
function transformSSEStream(stream) {
 const encoder = new TextEncoder()  // 将字符串转为 Uint8Array
  const decoder = new TextDecoder()  // 将 Uint8Array 转为字符串
  let buffer = ''                    // 缓存不完整的数据块

  const readableStream = new ReadableStream({
    async start(controller) {
      const reader = stream.getReader() // 获取原始流的读取器

      try {
        while (true) {
          // 1. 读取原始数据块
          const { done, value } = await reader.read()

          if (done) {
             // 流结束，发送完成标记
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
            break
          }

          // 2. 解码二进制数据并累积到缓冲区
          buffer += decoder.decode(value, { stream: true })
          
          // 3. 按行分割
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          // 4. 处理每一行
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6) // 去掉 "data: " 前缀

              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                continue
              }
              
              try {
                // 5. 解析 JSON 并提取内容
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                }
              } catch (e) {}
            }
          }
        }
      } catch (error) {
        controller.error(error)
      }
    }
  })

  return readableStream
}
module.exports = { createSSEStream, transformSSEStream }
