// 加载 .env 环境变量
require('dotenv').config()

// 引入 Express 应用
const app = require('./app')

// 从环境变量获取端口，默认 3000
const PORT = process.env.PORT || 3000

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
})
