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
      
          // Google Mapリンク
          const googleMapUrl = `https://www.google.com/maps?q=${randomLocation.latitude},${randomLocation.longitude}`;
          const googleLink = document.createElement("a");
          googleLink.href = googleMapUrl;
          googleLink.textContent = "→ Googleマップで開く";
          googleLink.target = "_blank";
      
          // Apple Mapリンク
          const label = `ランダム地点`;
          const appleMapUrl = `https://maps.apple.com/?q=${randomLocation.latitude},${randomLocation.longitude} (${label})`;
      
          const appleLink = document.createElement("a");
          appleLink.href = appleMapUrl;
          appleLink.textContent = "→ Appleマップで開く";
          appleLink.target = "_blank";
      
          // リンクを表示
          locationElement.appendChild(document.createElement("br"));
          locationElement.appendChild(googleLink);
          locationElement.appendChild(document.createElement("br"));
          locationElement.appendChild(appleLink);
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

