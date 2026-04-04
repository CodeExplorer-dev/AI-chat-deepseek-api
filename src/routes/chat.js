// 引入 Express 路由
const express = require('express')

// 引入对话服务
const { ChatService } = require('../services/chat-service')

// 创建路由实例
const router = express.Router()

// 实例化服务
const chatService = new ChatService()

/**
 * GET /api/sessions
 * 获取所有会话列表
 */
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await chatService.getAllSessions()
    res.json(sessions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/sessions
 * 创建新会话
 */
router.post('/sessions', async (req, res) => {
  try {
    const session = await chatService.createSession()
    res.status(201).json(session)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/sessions/:id
 * 获取指定会话信息
 */
router.get('/sessions/:id', async (req, res) => {
  try {
    const session = await chatService.getSession(req.params.id)
    if (!session) return res.status(404).json({ error: 'Session not found' })
    res.json(session)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * PATCH /api/sessions/:id
 * 修改会话标题
 * Body: { "title": "新标题" }
 */
router.patch('/sessions/:id', async (req, res) => {
  try {
    const { title } = req.body
    if (!title) return res.status(400).json({ error: 'Title is required' })
    const session = await chatService.updateSessionTitle(req.params.id, title)
    if (!session) return res.status(404).json({ error: 'Session not found' })
    res.json(session)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * DELETE /api/sessions/:id
 * 删除会话（级联删除所有消息）
 */
router.delete('/sessions/:id', async (req, res) => {
  try {
    await chatService.deleteSession(req.params.id)
    res.status(204).send()  // 204: No Content
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================
// 消息相关接口
// ============================================

/**
 * GET /api/sessions/:id/messages
 * 获取会话的所有消息历史
 */
router.get('/sessions/:id/messages', async (req, res) => {
  try {
    const messages = await chatService.getMessages(req.params.id)
    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/sessions/:id/chat
 * 多轮对话
 * Body: { "content": "用户消息" }
 */
router.post('/sessions/:id/chat', async (req, res) => {
  try {
    const { content } = req.body
    if (!content) return res.status(400).json({ error: 'Content is required' })
    const result = await chatService.chat(req.params.id, content)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/sessions/:id/chat/stream
 * SSE 流式对话
 * Body: { "content": "用户消息" }
 */

router.post('/sessions/:id/chat/stream', async (req, res) => {
  try {
    const { content } = req.body
    if (!content) {
      return res.status(400).json({error: 'Content is required'})
    }

    const sessionId = req.params.id
    const { stream } = await chatService.chatStream(sessionId, content)

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    const read = stream.getReader()
    const encoder = new TextEncoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
        res.flush()
      }
      res.end()
    } catch (error) {
      res.end()
    }
  } catch (error) {
     res.status(500).json({ error: error.message })
  }
})

// 导出路由
module.exports = router
