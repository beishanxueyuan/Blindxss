// pages/api/screenshot.js
import { supabase } from '../../utils/supabaseClient';

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
      // 获取请求体中的数据
      const { url = '', screenshot } = req.body;

      // 验证请求体是否包含必要字段
      if (!url) {
        return res.status(400).json({ error: '缺少必要的字段：url' });
      }

      // 根据 URL 更新对应的 screenshot
      const { data, error } = await supabase
        .from('xss')
        .update({ screenshot })  // 更新 screenshot 字段
        .eq('url', url);          // 根据 url 找到对应的记录

      if (error) {
        console.error('更新数据时出错:', error);
        return res.status(500).json({ error: '更新数据失败', details: error.message });
      }

      // 返回成功响应
      res.status(200).json({
        message: '数据更新成功',
        updatedData: data,
      });
    } catch (error) {
      console.error('处理 POST 请求时出错:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  } else {
    // 如果不是 POST 请求，返回 405 Method Not Allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}