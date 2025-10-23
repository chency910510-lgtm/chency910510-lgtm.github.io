// 1. 新增 checkDuplicateID 函數 (實現即時 API 呼叫)
function checkDuplicateID() {
    const userIDInput = document.getElementById('userID');
    const warningSpan = document.getElementById('duplicateWarning');
    const nid = userIDInput.value.trim();

    warningSpan.innerHTML = ''; 
    
    if (nid.length === 0) {
        userIDInput.dataset.isDuplicate = 'false'; 
        return; 
    }

    // --- 參考您的 API 模式來建立請求 ---
    const api_url = `${API_BASE_URL}/check_patient_id`;
    
    const formData = new FormData();
    // 後端路由 /check_patient_id 預期接收的欄位名稱為 'identifier'
    formData.append('identifier', nid); 
    // ------------------------------------
    
    // 這裡我們不顯示 loading spinner，因為 onblur 檢查通常要求快速無感

    fetch(api_url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok && data.exists) {
            // 如果後端回傳 exists: true (已重複)
            warningSpan.innerHTML = '已有病患建檔資料';
            userIDInput.dataset.isDuplicate = 'true'; // 【關鍵標記】設置為重複
        } else {
            // 如果不存在
            warningSpan.innerHTML = '';
            userIDInput.dataset.isDuplicate = 'false'; // 移除重複標記
        }
    })
    .catch(error => {
        console.error('檢查身分證重複性時發生錯誤:', error);
        warningSpan.innerHTML = '檢查失敗';
        userIDInput.dataset.isDuplicate = 'false';
    });
}


function uploadFhirData() {
    document.getElementById("responseMessage").innerHTML = '';
    
    //1024新增
    const userIDInput = document.getElementById('userID');
    const responseMessage = document.getElementById('responseMessage');

    // 【步驟 1: 送出前的最終攔截檢查】
    // 檢查是否有由 checkDuplicateID 函數設定的重複標記
    if (userIDInput.dataset.isDuplicate === 'true') {
        responseMessage.innerHTML = '<span style="color: red;">上傳失敗：身分證字號已有建檔資料，請檢查！</span>';
        return; // 立即返回，阻止後續的建檔操作
    }
    //1024 fin
    
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

