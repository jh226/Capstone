import { Col, Row } from "reactstrap";
import ChartMonth from "../../components/ChartMonth";
import TopCards from "../../components/TopCards";
import { FaTemperatureHigh } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { LiaUmbrellaBeachSolid } from "react-icons/lia";
import { MdOutlineUmbrella } from "react-icons/md";
import styles from "./MainPage.module.css";
import ChartCircle from "../../components/ChartCircle";
import ErrorTable from "../../components/ErrorTable";
import { useAuth } from "../../Login.Status";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function MainPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

   const entitySensor = useSelector((state) => state.entity_sensor.entity_sensor);
   const entityOn_Off = useSelector((state) => state.entity_on_off.entity_on_off);
   const entityError = useSelector((state) => state.entity_error.entity_error);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const calculateAverageTemp = (sensors) => {
    if (sensors.length === 0) return "N/A";
  
    const today = new Date();
  
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1; // 월은 0부터 시작
    const todayDate = today.getDate();
  
    const filteredSensors = sensors.filter(sensor => {
      // 센서 데이터의 날짜 문자열을 Date 객체로 변환합니다.
      const sensorDate = new Date(sensor.current_date);
  
      // 센서 데이터의 년, 월, 일을 추출합니다.
      const sensorYear = sensorDate.getFullYear();
      const sensorMonth = sensorDate.getMonth() + 1; 
      const sensorDay = sensorDate.getDate();
  
      // 오늘의 날짜와 센서 데이터의 날짜가 일치하는지 확인합니다.
      return sensorYear === todayYear && sensorMonth === todayMonth && sensorDay === todayDate;
    });
  
    const totalTemp = filteredSensors.reduce((sum, sensor) => sum + sensor.temp, 0);
    return (totalTemp / filteredSensors.length).toFixed(1) + "℃";
  };

  const calculateAverageHumi = (sensors) => {
    if (sensors.length === 0) return "N/A";
  
    const today = new Date();
  
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1; // 월은 0부터 시작
    const todayDate = today.getDate();
  
    const filteredSensors = sensors.filter(sensor => {
      const sensorDate = new Date(sensor.current_date);
  
      const sensorYear = sensorDate.getFullYear();
      const sensorMonth = sensorDate.getMonth() + 1; 
      const sensorDay = sensorDate.getDate();
  
      return sensorYear === todayYear && sensorMonth === todayMonth && sensorDay === todayDate;
    });
  

    const totalHumi = filteredSensors.reduce((sum, sensor) => sum + sensor.humi, 0);
    return (totalHumi / filteredSensors.length).toFixed(1) + "%";
  };

  const calculateOnDevices = (devices) => {
    return devices.filter((device) => device.current_on_off === 1).length;
  };

  const calculateOffDevices = (devices) => {
    return devices.filter((device) => device.current_on_off === 0).length;
  };

  const onDeviceCount = calculateOnDevices(entityOn_Off);
  const offDeviceCount = calculateOffDevices(entityOn_Off);
  const averageTemp = calculateAverageTemp(entitySensor);
  const averageHumi = calculateAverageHumi(entitySensor);

  return (
    <div>
      {/***카드 부분***/}
      <Row key={"Card_Main"} className={styles.row}>
        <Col key={"Card_Main0"} sm="6" lg="3">
          <TopCards
            key={"Card_Main_0"}
            bg="#D9EDBF"
            title="Temp"
            subtitle="whole-mean"
            value={averageTemp}
            icon={<FaTemperatureHigh size={30} color="#A5DD9B" />}
          />
        </Col>
        <Col key={"Card_Main1"} sm="6" lg="3">
          <TopCards
            key={"Card_Main_1"}
            bg="#FFB996"
            title="Humi"
            subtitle="whole-mean"
            value={averageHumi}
            icon={<WiHumidity size={30} color="#FA7070" />}
          />
        </Col>
        <Col key={"Card_Main2"} sm="6" lg="3">
          <TopCards
            key={"Card_Main_2"}
            bg="#FFCF81"
            title="On"
            subtitle="whole-area"
            value={onDeviceCount}
            icon={<LiaUmbrellaBeachSolid size={30} color="#FF9800" />}
          />
        </Col>
        <Col key={"Card_Main3"} sm="6" lg="3">
          <TopCards
            key={"Card_Main_3"}
            bg="#FDFFAB"
            title="Off"
            subtitle="whole-area"
            value={offDeviceCount}
            icon={<MdOutlineUmbrella size={30} color="FCDC2A" />}
          />
        </Col>
      </Row>
      {/**그래프**/}
      <Row key={"Graph_Main"} className={styles.row}>
        <Col key={"Graph_Main0"} xxl="8">
          <ChartMonth key={"Graph_Main_0"} />
        </Col>
        <Col key={"Graph_Main1"} xxl="4">
          <ChartCircle key={"Graph_Main_1"} />
        </Col>
      </Row>
      {/***Table ***/}
      <Row key={"Table_Main"} className={styles.row}>
        <Col key={"Err_Main0"} lg="7" xxl="8" md="12">
          <ErrorTable key={"Err_Main_0"} data={entityError}/>
        </Col>
      </Row>
    </div>
  );
}

export default MainPage;
