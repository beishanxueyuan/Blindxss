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

  // 删除记录的函数
  const handleDelete = async (id) => {
    try {
      // 调用 Supabase 删除记录
      const { error } = await supabase
        .from('xss')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('删除数据时出错:', error);
        alert('删除失败，请重试');
      } else {
        // 更新本地状态，移除已删除的记录
        setData((prevData) => prevData.filter((item) => item.id !== id));
        alert('删除成功');
      }
    } catch (error) {
      console.error('处理删除请求时出错:', error);
      alert('删除失败，请重试');
    }
  };

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
            <th>操作</th>
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
                  {item.screenshot && (
                    <Image
                      src={item.screenshot}
                      alt="Screenshot"
                      width={200}
                      height={200}
                      style={{ objectFit: 'contain' }}
                    />
                  )}
                </td>
                <td>{item.trigger_time}</td>
                <td>
                  {/* 添加删除按钮 */}
                  <button onClick={() => handleDelete(item.id)}>删除</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">没有数据</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}