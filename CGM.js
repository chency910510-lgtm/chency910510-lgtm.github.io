function uploadFiles() {
            const responseMessageElement = document.getElementById("responseMessage");
            responseMessageElement.innerHTML = '';
            responseMessageElement.style.display = 'block'; // 確保訊息可見
            clearImages();
            var obs_term = document.getElementById("trendAnalysis").value;
            const api_url = `${API_BASE_URL}/device_trend_analysis`;
            const formData = new FormData();
            formData.append('obs_term', obs_term);
            formData.append('patient_id', patientId);
            const loadingSpinner = document.getElementById('loadingSpinner');
            loadingSpinner.style.display = 'block';
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
                loadingSpinner.style.display = 'none';
                
                if (data.images && data.images.length > 0) {
                    displayImages(data.images);
                    responseMessageElement.style.display = 'none'; // 隱藏回應訊息
                } else {
                    responseMessageElement.innerHTML = '沒有可顯示的圖片';
                }
            })
            .catch(error => {
                console.error('錯誤:', error);
                responseMessageElement.innerHTML = '上傳失敗: ' + error.message;
                loadingSpinner.style.display = 'none';
            });
        }

        function clearImages() {
            const imageContainer = document.getElementById('imageContainer');
            imageContainer.innerHTML = '';
        }

        function displayImages(images) {
            const imageContainer = document.getElementById('imageContainer');
            
            images.forEach((imagePath, index) => {
                // 只顯示 index 為 0 以及 3 之後的圖片
                if (index === 0 || index >= 3) {
                    const img = document.createElement('img');
                    img.src = `https://02f9-140-116-156-231.ngrok-free.app${imagePath}`;
                    img.alt = 'Trend Analysis Image';
                    imageContainer.appendChild(img);
                }
            });
        }

