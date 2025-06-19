document.getElementById("getLocation").addEventListener("click", function () {
  const range = parseFloat(document.getElementById("range").value);

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
      
          const distanceKm = parseFloat(document.getElementById("range").value);
      
          // ✅ ランダム位置を生成（一定距離・ランダム方向）
          const randomLocation = generateRandomLocationFixedDistance(lat, lon, distanceKm);
      
          const resultText = `
            あなたの現在地：緯度 ${lat.toFixed(5)}, 経度 ${lon.toFixed(5)}\n
            ランダムな位置：緯度 ${randomLocation.latitude.toFixed(5)}, 経度 ${randomLocation.longitude.toFixed(5)}
          `;
      
          const locationElement = document.getElementById("location");
          locationElement.textContent = resultText;
      
//           // Google Mapリンク
//           const googleMapUrl = `https://www.google.com/maps?q=${randomLocation.latitude},${randomLocation.longitude}`;
//           const googleLink = document.createElement("a");
//           googleLink.href = googleMapUrl;
//           googleLink.textContent = "→ Googleマップで開く";
//           googleLink.target = "_blank";
      
//           // Apple Mapリンク
//           const label = `ランダム地点`;
//           const appleMapUrl = `https://maps.apple.com/?q=${randomLocation.latitude},${randomLocation.longitude} (${label})`;
      
//           const appleLink = document.createElement("a");
//           appleLink.href = appleMapUrl;
//           appleLink.textContent = "→ Appleマップで開く";
//           appleLink.target = "_blank";

//           // Yahoo!マップリンク
// const yahooMapUrl = `https://map.yahoo.co.jp/maps?lat=${randomLocation.latitude}&lon=${randomLocation.longitude}&z=15`;
// const yahooLink = document.createElement("a");
// yahooLink.href = yahooMapUrl;
// yahooLink.textContent = "→ Yahoo!地図で開く";
// yahooLink.target = "_blank";

// Google Map
const googleMapUrl = `https://www.google.com/maps?q=${randomLocation.latitude},${randomLocation.longitude}`;
const googleLink = document.createElement("a");
googleLink.href = googleMapUrl;
googleLink.target = "_blank";
const googleImg = document.createElement("img");
googleImg.src = "img/google-map.png";
googleImg.alt = "Googleマップ";
googleImg.style.width = "48px";
googleImg.style.height = "48px";
googleLink.appendChild(googleImg);

// Apple Map
const label = "ランダム地点";
const appleMapUrl = `https://maps.apple.com/?q=${randomLocation.latitude},${randomLocation.longitude} (${label})`;
const appleLink = document.createElement("a");
appleLink.href = appleMapUrl;
appleLink.target = "_blank";
const appleImg = document.createElement("img");
appleImg.src = "img/apple-map.png";
appleImg.alt = "Appleマップ";
appleImg.style.width = "48px";
appleImg.style.height = "48px";
appleLink.appendChild(appleImg);

// Yahoo Map
const yahooMapUrl = `https://map.yahoo.co.jp/maps?lat=${randomLocation.latitude}&lon=${randomLocation.longitude}&z=15`;
const yahooLink = document.createElement("a");
yahooLink.href = yahooMapUrl;
yahooLink.target = "_blank";
const yahooImg = document.createElement("img");
yahooImg.src = "img/yahoo-map.png";
yahooImg.alt = "Yahoo!地図";
yahooImg.style.width = "48px";
yahooImg.style.height = "48px";
yahooLink.appendChild(yahooImg);

// // 画面に表示
// locationElement.appendChild(document.createElement("br"));
// locationElement.appendChild(googleLink);
// locationElement.appendChild(appleLink);
// locationElement.appendChild(yahooLink);

const iconContainer = document.getElementById("map-icons");
iconContainer.innerHTML = ""; // 前回の表示をクリア

iconContainer.appendChild(googleLink);
iconContainer.appendChild(appleLink);
iconContainer.appendChild(yahooLink);




// 表示に追加（例としてAppleマップの下に）
locationElement.appendChild(document.createElement("br"));
locationElement.appendChild(yahooLink);

      
          // // リンクを表示
          // locationElement.appendChild(document.createElement("br"));
          // locationElement.appendChild(googleLink);
          // locationElement.appendChild(document.createElement("br"));
          // locationElement.appendChild(appleLink);
        },
        (error) => {
          document.getElementById("location").textContent =
            "位置情報が取得できませんでした。";
          console.error(error);
        }
      );
      
    
      
  } else {
    document.getElementById("location").textContent =
      "Geolocationがサポートされていません。";
  }
});

// 地球の半径（km）
const earthRadius = 6371;


function generateRandomLocationFixedDistance(lat, lon, distanceKm) {
  const earthRadius = 6371; // 地球の半径（km）
  const bearing = Math.random() * 2 * Math.PI; // ランダムな方向（0〜2π）
  const distanceRatio = distanceKm / earthRadius;

  const lat1 = (lat * Math.PI) / 180;
  const lon1 = (lon * Math.PI) / 180;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distanceRatio) +
      Math.cos(lat1) * Math.sin(distanceRatio) * Math.cos(bearing)
  );

  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(distanceRatio) * Math.cos(lat1),
      Math.cos(distanceRatio) - Math.sin(lat1) * Math.sin(lat2)
    );

  return {
    latitude: (lat2 * 180) / Math.PI,
    longitude: (lon2 * 180) / Math.PI,
  };
}

// 度→ラジアン変換
function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

// ラジアン→度変換
function toDeg(radians) {
  return (radians * 180) / Math.PI;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(() => {
    console.log('Service Worker registered!');
  });
}

const rangeInput = document.getElementById("range");
const historySelect = document.getElementById("historySelect");

// 保存した履歴を読み込んで select に追加
function loadHistory() {
  const history = JSON.parse(localStorage.getItem("distanceHistory")) || [];
  historySelect.innerHTML = '<option value="">過去の距離を選択</option>';
  history.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = `${value} km`;
    historySelect.appendChild(option);
  });
}

// 新しい距離を履歴に追加
function saveToHistory(value) {
  let history = JSON.parse(localStorage.getItem("distanceHistory")) || [];
  if (!history.includes(value)) {
    history.unshift(value); // 最新を先頭に
    if (history.length > 10) history = history.slice(0, 10); // 最大10件
    localStorage.setItem("distanceHistory", JSON.stringify(history));
    loadHistory();
  }
}

// セレクトボックスで距離を選択したら入力欄に反映
historySelect.addEventListener("change", () => {
  const selected = historySelect.value;
  if (selected) {
    rangeInput.value = selected;
  }
});

// ボタンを押したときの処理（距離の履歴保存もここに）
document.getElementById("getLocation").addEventListener("click", function () {
  const range = parseFloat(rangeInput.value);
  if (!isNaN(range)) {
    saveToHistory(range);
  }

  // --- ここから下は既存の位置取得＆マップリンク生成の処理 ---
  // ...あなたのコード続き...
});

// 初期表示時に履歴を読み込む
window.addEventListener("DOMContentLoaded", loadHistory);

