import React, { useEffect, useState, useMemo } from "react";
import { Button } from "reactstrap";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { IoClose, IoSearch } from "react-icons/io5";
import styles from "./MapPage.module.css";
import { useAuth } from "../../Login.Status";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MapPage = () => {
  const { isLoggedIn, dept } = useAuth();
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState(null); 
  const [map, setMap] = useState(null); // map 변수를 상태로 관리

  const data = useMemo(() => [
    { loc: "서구", lat: 36.355602, long:127.384228 },
    { loc: "동구", lat: 36.311487, long:127.454951 },
    { loc: "유성구", lat: 36.362014, long:127.356462 },
    { loc: "대덕구", lat: 36.346893, long:127.415740 },
    { loc: "중구", lat: 36.325574, long:127.421561 },
  ], []); // 의존성 배열을 빈 배열로 지정하여 렌더링 시에만 초기화되도록 설정

  //전역 변수 데이터(ENTITY)
  const entity = useSelector((state) => state.entity.entity);

  useEffect(() => {
    let mapInstance;

    if (!isLoggedIn) {
      navigate("/login");
    }

    const initMap = async () => {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=cb6836ef6efb1429ee5b6be7d916666e&autoload=false`;
      document.head.appendChild(script);

      // 카카오맵 API 스크립트가 로드되면 실행될 함수
      script.onload = () => {
        const location = data.find(item => item.loc === dept);

        // 카카오맵 초기화
        window.kakao.maps.load(() => {
          const container = document.getElementById("map");
          const options = {
            center: new window.kakao.maps.LatLng(location.lat, location.long),
            level: 4, // 확대 수준
          };
          mapInstance = new window.kakao.maps.Map(container, options); 
          setMap(mapInstance); // map 변수를 상태로 업데이트

          entity.forEach((device) => {
            const position = new window.kakao.maps.LatLng(
              parseFloat(device.latitude),
              parseFloat(device.longitude)
            );
            const marker = new window.kakao.maps.Marker({
              position: position,
            });

            window.kakao.maps.event.addListener(marker, "click", function () {
              setSelectedDevice(device);
            });

            marker.setMap(mapInstance); 
          });
        });
      };
    };
    
    initMap();
    return () => {
      // 컴포넌트가 언마운트될 때 스크립트를 제거합니다.
      const script = document.querySelector(
        'script[src^="https://dapi.kakao.com"]'
      );
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [entity, isLoggedIn, navigate, dept, data]);

  const handleGoToEntityPage = () => {
    if (selectedDevice) {
      alert("Device Num:" + selectedDevice.device_num + " 페이지로 이동합니다.");
      navigate(`/entity?device_num=${selectedDevice.device_num}`);
    }
  };

  const handleCloseInfo = () => {
    setSelectedDevice(null);
  };

  const handleSearch = () =>{
    const searchValue = document.getElementById("search_input").value
    if (searchValue) {
      const matchedDevice = entity.find(device => device.device_num === searchValue);
      if (matchedDevice) {
        const moveLatLon = new window.kakao.maps.LatLng(
          matchedDevice.latitude,
          matchedDevice.longitude
        );
        map.setCenter(moveLatLon); // map 변수를 사용하여 지도 중심을 이동
        setSelectedDevice(matchedDevice);
      } else {
        alert("해당 Device Num을 찾을 수 없습니다.");
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        {selectedDevice ? (
          <>
            <div className={styles.infoHeader}>
              <IoClose className={styles.closeIcon} onClick={handleCloseInfo} />
            </div>

            <table className={styles.infoTable}>
            <tbody>
              <tr>
                <th>Device Number</th>
                <td>{selectedDevice.device_num}</td>
              </tr>
              <tr>
                <th>IP Address</th>
                <td>{selectedDevice.device_ip_address}</td>
              </tr>
              <tr>
                <th>Latitude</th>
                <td>{selectedDevice.latitude}</td>
              </tr>
              <tr>
                <th>Longitude</th>
                <td>{selectedDevice.longitude}</td>
              </tr>
            </tbody>
            </table>
            {dept == selectedDevice.location && (
              <div>
                <Button className={styles.btn} onClick={handleGoToEntityPage}>Go Entity Page</Button>
              </div>
            )}
          </>
        ) : (
          <InputGroup className="mb-3">
            <Form.Control placeholder="Search with Device num" id="search_input"/>
            <Button onClick={handleSearch}> <IoSearch /> </Button>
          </InputGroup>
        )}
      </div>

      <div id="map" className={styles.mapContainer}></div>
    </div>
  );
};

export default MapPage;
