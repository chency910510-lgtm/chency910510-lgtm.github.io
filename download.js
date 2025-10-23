function downloadData() {
    document.getElementById("responseMessage").innerHTML = '';

    var userName = document.getElementById("name").value;
    var userID = document.getElementById("userID").value;

	
    // 建立要傳送給伺服器的資料物件
    var requestData = new FormData();

    requestData.append('userName', userName);
    requestData.append('userID', userID);

    // 顯示 Loading Spinner
    var loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';

    fetch("https://02f9-140-116-156-231.ngrok-free.app/download", {
        method: 'POST',
        body: requestData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // 判斷回傳的內容類型
        var contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            // 如果是 JSON，解析為文字
            return response.text();
        } else {
            // 否則解析為 Blob 物件
            return response.blob();
        }
    })
   .then(data => {
    // 隱藏 Loading Spinner
    loadingSpinner.style.display = 'none';

    if (typeof data === 'string') {
        // 解析 JSON 字串
        var jsonData = JSON.parse(data);

        // 獲取 message 屬性
        var message = jsonData.message;

        // 如果是文字，顯示在 responseMessage 中
        document.getElementById("responseMessage").innerHTML = message;
    } else {
        // 如果是檔案，創建下載連結
        var blobUrl = window.URL.createObjectURL(data);
        var downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = 'downloaded_file.pptx';
        downloadLink.click();
        window.URL.revokeObjectURL(blobUrl);
    }
})
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('responseMessage').textContent = 'Download failed: ' + error.message;
        alert("Download error: " + error.message);

        // 隱藏 Loading Spinner（錯誤時也要隱藏）
        loadingSpinner.style.display = 'none';
    });
}
