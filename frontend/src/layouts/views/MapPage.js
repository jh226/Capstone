import React, { useEffect, useState } from "react";
import styles from "./MapPage.module.css";
import { useAuth } from "../../Login.Status";
import { useDevice } from "../../device.Status";
import { useNavigate } from "react-router-dom";

const MapPage = () => {
  const { isLoggedIn } = useAuth();
  const { devices } = useDevice();
  const navigate = useNavigate();

  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }

    const getDeviceList = async () => {
      try {
        const response = await fetch('/api/getDevice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
          return data.deviceinfo;
        } else {
          console.log(data.success);
          return [];
        }
      } catch (error) {
          console.error('Error:', error);
          return [];
      }
    }

    const initMap = async () => {
      // 카카오맵 API를 비동기적으로 불러옵니다.
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=cb6836ef6efb1429ee5b6be7d916666e&autoload=false`;
      document.head.appendChild(script);

      // 카카오맵 API 스크립트가 로드되면 실행될 함수
      script.onload = async () => {
        // 카카오맵 초기화
        await new Promise((resolve) => {
          window.kakao.maps.load(resolve);
        });

        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(36.3378, 127.446), // 우송대학교 서캠퍼스 좌표
          level: 4, // 확대 수준
        };
        const map = new window.kakao.maps.Map(container, options);

        const deviceList = await getDeviceList();

        deviceList.forEach((device) => {
          const { latitude, longitude } = parseLocation(device.location);
          const position = new window.kakao.maps.LatLng(latitude, longitude);
          const marker = new window.kakao.maps.Marker({
            position: position,
          });

          window.kakao.maps.event.addListener(marker, 'click', function() {
            alert('Device Num:'+ device.device_num +'가 클릭되었습니다.');
          });

          marker.setMap(map);
          setMarkers((prevMarkers) => [...prevMarkers, marker]);
        });
      };
    };

    initMap();

    return () => {
      // 컴포넌트가 언마운트될 때 스크립트를 제거합니다.
      const script = document.querySelector('script[src^="https://dapi.kakao.com"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [isLoggedIn, navigate]);

  const parseLocation = (location) => {
    const [latitude, longitude] = location.split("-");
    return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
  };

  return <div id="map" className={styles.mapContainer}></div>;
};

export default MapPage;
