function uploadFhirData() {
    document.getElementById("responseMessage").innerHTML = '';
    // 從表單字段中獲取數據
    var Uname = document.getElementById("name").value;
    var userID = document.getElementById("userID").value;
    var birthdate = document.getElementById("birthdate").value;
    var genderSelect = document.getElementById("gender");
    var gender = genderSelect.options[genderSelect.selectedIndex].value;

    // 準備表單數據
    var formData = new FormData();
    formData.append('userName', Uname);
    formData.append('userID', userID);
    formData.append('userBirthdate', birthdate);
    formData.append('userGender', gender);

    // 顯示加載中 Spinner
    var loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';

    // 發送 POST 請求到 Flask 伺服器
    fetch(`${API_BASE_URL}/patient`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('網路回應不正確');
        }

        return response.json();
    })
    .then(data => {
        // 隱藏加載中 Spinner
        loadingSpinner.style.display = 'none';

        // 處理回應數據
        var message = data.message;
        document.getElementById("responseMessage").innerHTML = message;
    })
    .catch(error => {
        console.error('發生 fetch 操作問題:', error);
        document.getElementById('responseMessage').textContent = '上傳失敗: ' + error.message;

        // 隱藏加載中 Spinner（錯誤情況）
        loadingSpinner.style.display = 'none';
    });
}
