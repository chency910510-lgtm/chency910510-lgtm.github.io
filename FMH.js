function uploadFiles() {
            // 清空上次回應的訊息
            document.getElementById("responseMessage").innerHTML = '';

            var userData = document.getElementById("familyhistory").value;

            const api_url = `${API_BASE_URL}/input_FMH`;

            const formData = new FormData();
            formData.append('userData', userData);
            formData.append('userPatientID', patientId);

            const loadingSpinner = document.getElementById('loadingSpinner');
            loadingSpinner.style.display = 'block';  // 顯示加載中 Spinner
            loadingSpinner.querySelector('p').innerHTML = '正在上傳資料...';

            fetch(api_url, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('網路錯誤');
            })
            .then(data => {
                console.log('伺服器回應:', data);

                // 更新HTML，顯示伺服器的回應
                document.getElementById("responseMessage").innerHTML = data.message;

                // 這裡你可以根據回應執行其他操作

                // 收到伺服器回應後隱藏加載中 Spinner
                loadingSpinner.style.display = 'none';
            })
            .catch(error => {
                console.error('錯誤:', error);
                document.getElementById("responseMessage").innerHTML = '上傳失敗: ' + error.message;

                // 錯誤情況下隱藏加載中 Spinner
                loadingSpinner.style.display = 'none';
            });
        }

///////delete
function deleteEntry(entryId) {
            // 清空上次回應的訊息
            document.getElementById("responseMessage").innerHTML = '';

            const api_url = `${API_BASE_URL}/delete`;

            const formData = new FormData();
            formData.append('Resource', "FamilyMemberHistory");
            formData.append('ResourceID', entryId);

            const loadingSpinner = document.getElementById('loadingSpinner');
            loadingSpinner.style.display = 'block';  // 顯示加載中 Spinner
            loadingSpinner.querySelector('p').innerHTML = '正在刪除資料...';

            fetch(api_url, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('網路錯誤');
            })
            .then(data => {
                console.log('伺服器回應:', data);

                // 更新HTML，顯示伺服器的回應
                document.getElementById("responseMessage").innerHTML = data.message;

                // 這裡你可以根據回應執行其他操作

                // 收到伺服器回應後隱藏加載中 Spinner
                loadingSpinner.style.display = 'none';

                // 重新加載家族病史
                Familyhistory(patientId);
				
            })
            .catch(error => {
                console.error('錯誤:', error);
                document.getElementById("responseMessage").innerHTML = '刪除失敗: ' + error.message;

                // 錯誤情況下隱藏加載中 Spinner
                loadingSpinner.style.display = 'none';
            });
        }
