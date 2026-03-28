-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS ai_chat;
-- 选择数据库
USE ai_chat;

-- ============================================
-- 会话表：存储每个对话会话的基本信息
-- ============================================
CREATE TABLE sessions (
  id VARCHAR(36) PRIMARY KEY,              -- UUID 作为主键
  title VARCHAR(20) DEFAULT '新对话',      -- 会话标题，默认"新对话"
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- 更新时间，自动更新
);

-- ============================================
-- 消息表：存储每个会话中的所有消息
-- ============================================
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,      -- 自增主键
  session_id VARCHAR(36) NOT NULL,        -- 关联会话 ID
  role ENUM('user', 'assistant') NOT NULL,  -- 消息角色：user 或 assistant
  content TEXT NOT NULL,                  -- 消息内容
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 消息时间
  -- 外键约束：删除会话时级联删除其所有消息
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);
