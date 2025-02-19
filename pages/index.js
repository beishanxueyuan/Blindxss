// pages/display.js
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import Image from 'next/image';

export default function DisplayTable() {
  const [data, setData] = useState([]);

  // 在组件加载时从 Supabase 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from('xss')
          .select('id, url, cookie, screenshot, trigger_time');

        if (error) {
          console.error('获取数据时出错:', error);
        } else {
          setData(fetchedData);
        }
      } catch (error) {
        console.error('处理请求时出错:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>XSS 数据表</h1>

      {/* 渲染表格 */}
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>URL</th>
            <th>Cookie</th>
            <th>Screenshot</th>
            <th>Trigger Time</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.url}
                  </a>
                </td>
                <td>{item.cookie}</td>
                <td>
                <Image
  src={item.screenshot}
  alt="Screenshot"
  width={200}
  height={200}
  style={{ objectFit: 'contain' }}
/>
                </td>
                <td>{item.trigger_time}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">没有数据</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}