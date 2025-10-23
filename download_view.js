function downloadData(userName, userID) {
    const requestData = new FormData();
    requestData.append('userName', userName);
    requestData.append('userID', userID);

    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';

    // 這裡把 http://140.116.156.231:4998/download 換成 `${API_BASE_URL}/download`
    fetch(`${API_BASE_URL}/download`, {
      method: 'POST',
      body: requestData
    })
    .then(response => {
      loadingSpinner.style.display = 'none';
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const contentType = response.headers.get("content-type");
      return (contentType && contentType.includes("application/json"))
        ? response.text()
        : response.blob();
    })
    .then(data => {
      if (typeof data === 'string') {
        console.log("回應訊息：", data);
      } else {
        const blobUrl = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'downloaded_file.pptx';
        a.click();
        URL.revokeObjectURL(blobUrl);
      }
    })
    .catch(error => {
      loadingSpinner.style.display = 'none';
      console.error('下載失敗:', error);
      alert("下載失敗：" + error.message);
    });
  }

