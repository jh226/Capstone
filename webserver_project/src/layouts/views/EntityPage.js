import { Col, Row, Button } from "reactstrap";
import TopCards from "../../components/TopCards";
import { FaTemperatureHigh } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { ImSwitch } from "react-icons/im";
import { TbWorldLatitude, TbWorldLongitude } from "react-icons/tb";
import styles from "./EntityPage.module.css";
import ErrorTable from "../../components/ErrorTable";
import { useAuth } from "../../Login.Status";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";

function EntityPage() {
  //전역 변수 데이터(ENTITY)
  const entity = useSelector((state) => state.entity.entity);
  const entitySensor = useSelector((state) => state.entity_sensor.entity_sensor);
  const entityOn_Off = useSelector((state) => state.entity_on_off.entity_on_off);
  const entityError = useSelector((state) => state.entity_error.entity_error);

  const { isLoggedIn, dept } = useAuth();
  const [currentPage, setPage] = useState();
  const [currentPage_sensor, setPage_sensor] = useState();
  const [currentPage_on_off, setPage_on_off] = useState();
  const [currentPage_error, setPage_error] = useState(entityError);
  const navigate = useNavigate();
  const location = useLocation();


  var selectedIndex = null;
  // SelectBox 값이 바뀔 때
  const SBChange = (e) => {
    selectedIndex = entity.findIndex((option) => option.device_num === e.value);
    setPage(entity[selectedIndex]);

    const recentData = entitySensor.filter(data => data.device_num === e.value)
    .reduce((prev, current) => (prev.date > current.date) ? prev : current);
    setPage_sensor(recentData);

    selectedIndex = entityOn_Off.findIndex((option) => option.device_num === e.value);
    setPage_on_off(entityOn_Off[selectedIndex]);

    const filteredErrors = entityError.filter((option) => option.device_num === e.value);
    setPage_error(filteredErrors);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }

    //map 마커 클릭시 넘어오는 파라미터 처리
    const params = new URLSearchParams(location.search);
    const deviceNum = params.get("device_num");
    if (deviceNum) {
      const selectedIndex = entity.findIndex(
        (option) => option.device_num === deviceNum
      );
      if (selectedIndex !== -1) {
        setPage(entity[selectedIndex]);

        //기기 정보 설정 (센서 데이터, onoff, 에러)
        const recentData = entitySensor.filter(
          (data) => data.device_num === deviceNum
        ).reduce((prev, current) => (prev.date > current.date ? prev : current));
        setPage_sensor(recentData);
        const onOffIndex = entityOn_Off.findIndex(
          (option) => option.device_num === deviceNum
        );
        setPage_on_off(entityOn_Off[onOffIndex]);
        const filteredErrors = entityError.filter(
          (option) => option.device_num === deviceNum
        );
        setPage_error(filteredErrors);
      }
    }
  }, [isLoggedIn, navigate, location.search, entity, entitySensor, entityOn_Off, entityError]);

  const filteredEntity = useMemo(() => {
    return entity.filter(item => item.location === dept);
  }, [entity, dept]);

  return (
    <div>
      <Row>
        <Col xx1="1">
          <Select
            options={filteredEntity.map(function (element) {
              return {
                value: element.device_num,
                label: element.device_ip_address,
              };
            })}
            onChange={SBChange}
            id="Select_Entity"
          />
        </Col>
      </Row>
      <Row key={"Title_Entity"} className={`${styles.row} ${styles.center}`}>
        <Col xxl="6">
          <div>
            <h1 className={styles.Title_Entity}>
              {currentPage ? currentPage.device_num : ""}

              <span className={styles.IP_Title}>
                {currentPage ? currentPage.device_ip_address : "No Device"}
              </span>
            </h1>
          </div>
        </Col>
      </Row>
      {/***카드 부분***/}
      <Row key={"Card_Entity_1st"} className={styles.row}>
        <Col key={"Card_Entity0"} sm="6" lg="4">
          <TopCards
            key={"Card_Entity_0"}
            bg="#D9EDBF"
            title="Temp"
            subtitle="whole-mean"
            value={currentPage_sensor ? `${currentPage_sensor.temp}℃`: "?"}
            icon={<FaTemperatureHigh size={30} color="#A5DD9B" />}
          />
        </Col>
        <Col key={"Card_Entity1"} sm="6" lg="4">
          <TopCards
            key={"Card_Entity_1"}
            bg="#FFB996"
            title="Humi"
            subtitle="whole-mean"
            value={currentPage_sensor ? `${currentPage_sensor.humi}%`: "?"}
            icon={<WiHumidity size={30} color="#FA7070" />}
          />
        </Col>
        <Col key={"Card_Entity2"} sm="6" lg="4">
          <TopCards
            key={"Card_Entity_2"}
            bg="#FFCF81"
            title="sunshade"
            subtitle=""
            value={currentPage_on_off ? currentPage_on_off.current_on_off ? "ON" : "OFF" : "?"}
            icon={<ImSwitch size={30} color="#FF9800" />}
          />
        </Col>
      </Row>
      <Row key={"Card_Entity_2nd"} className={`${styles.row} ${styles.center}`}>
        <Col key={"Card_Entity3"} sm="6" lg="4">
          <TopCards
            key={"Card_Entity_3"}
            bg="#E4C59E"
            title="Lati"
            subtitle="location-1"
            value={currentPage ? currentPage.latitude : "?"}
            icon={<TbWorldLatitude size={30} color="AF8260" />}
          />
        </Col>
        <Col key={"Card_Entity4"} sm="6" lg="4">
          <TopCards
            key={"Card_Entity_4"}
            bg="#E1F7F5"
            title="Long"
            subtitle="location-2"
            value={currentPage ? currentPage.longitude : "?"}
            icon={<TbWorldLongitude size={30} color="9AC8CD" />}
          />
        </Col>
      </Row>
      {/**컨트롤러**/}
      <Row className={`${styles.row} ${styles.controller}`}>
        {/* Button 1 */}
        <Col xs="auto">
          <Button className={`${styles.controlBtn} ${styles.Btn1}`}>
            용도 1
          </Button>
        </Col>
        {/* Button 2 */}
        <Col xs="auto">
          <Button className={`${styles.controlBtn} ${styles.Btn2}`}>
            용도 2
          </Button>
        </Col>
        {/* Button 3 */}
        <Col xs="auto">
          <Button className={`${styles.controlBtn} ${styles.Btn3}`}>
            용도 3
          </Button>
        </Col>
      </Row>

      {/***Table ***/}
      <Row key={"Table_Entity"} className={styles.row}>
        <Col key={"Err_Entity0"} lg="7" xxl="8" md="12">
          <ErrorTable key={"Err_Entity_0"} data={currentPage_error}/>
        </Col>
      </Row>
    </div>
  );
}

export default EntityPage;
