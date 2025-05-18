// pages/api/screenshot.js
import { supabase } from '../../utils/supabaseClient';

// pages/api/screenshot.js
export default async function handler(req, res) {
  // 设置 CORS 头部
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求（OPTIONS）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { url = '', screenshot } = req.body;

      // 验证必要字段
      if (!url) {
        return res.status(400).json({ error: '缺少必要的字段：url' });
      }

      // ==== 异步更新数据库（不阻塞主流程）====
      updateScreenshotAsync(url, screenshot).catch((error) => {
        console.error('异步更新截图失败:', error);
      });

      // 立即返回成功响应，不等待数据库操作完成
      res.status(200).json({
        message: '请求已接收，数据正在异步更新',
      });
    } catch (error) {
      console.error('处理 POST 请求时出错:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// ===== 异步更新数据库函数 =====
async function updateScreenshotAsync(url, screenshot) {

  const { data, error } = await supabase
    .from('xss')
    .update({ screenshot })  // 更新 screenshot 字段
    .eq('url', url);          // 根据 url 找到对应的记录

  if (error) {
    throw new Error(`更新数据库失败: ${error.message}`);
  }

  console.log('截图已异步更新至 Supabase:', data);
}