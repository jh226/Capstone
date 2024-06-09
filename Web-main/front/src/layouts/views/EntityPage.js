import { Col, Row, Button } from "reactstrap";
import TopCards from "../../components/TopCards";
import { FaTemperatureHigh } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { ImSwitch } from "react-icons/im";
import { TbWorldLatitude, TbWorldLongitude } from "react-icons/tb";
import styles from "./EntityPage.module.css";
import ErrorTable from "../../components/ErrorTable";
import { useAuth } from "../../Login.Status";
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { entity_on_offActions } from "../../redux/entity_on_offSlice";
import { entity_errorActions } from "../../redux/entity_errorSlice";
import { Client } from "paho-mqtt";
import Modal from 'react-modal';

function EntityPage() {
  const { isLoggedIn,dept } = useAuth();
  const [currentPage, setPage] = useState();
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [gps , setGps] = useState([]);
  const [crash, setCrash] = useState([]);
  const [mqttClient, setClient] = useState(null);
  const [errorData, setErrorData] = useState(null);
  const [selectedIPs, setSelectedIPs] = useState([]);

  const [selectedIndex, setIndex] = useState(null);
  const [selectedIndex_OnOff, setIndex_OnOff] = useState(null)
  const navigate = useNavigate();
  const location = useLocation();

  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const selectRef = useRef(null);

  const customStyles = {
    overlay: {
      backgroundColor: " rgba(0, 0, 0, 0.4)",
      width: "100%",
      height: "100vh",
      zIndex: "10",
      position: "fixed",
      top: "0",
      left: "0",
    },
    content: {
      width: "500px",
      height: "500px",
      zIndex: "150",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
      backgroundColor: "white",
      justifyContent: "center",
      overflow: "auto",
    },
  };


  //전역 변수 데이터(ENTITY)
  const entity = useSelector((state) => state.entity.entity);
  const entity_on_off = useSelector(
    (state) => state.entity_on_off.entity_on_off
  );
  const entity_error = useSelector(
    (state) => state.entity_error.entity_error
  )
  
  const dispatch = useDispatch()
  const mqttStart = (MQTT_BROKER) => {
    const MQTT_TOPIC = ["sensor/tem_hum", "sensor/crash", "sensor/gps"];
    const MQTT_PORT = 9001;
    const client = new Client(MQTT_BROKER, MQTT_PORT, "clientId-" + Math.random())
    console.log(client)
    setClient(client);
    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:", responseObject.errorMessage);
      }
    };

    // MQTT 메시지를 수신하면 호출되는 콜백
    client.onMessageArrived = (message) => {
      console.log("onMessageArrived:", message.payloadString);
      const topic = message.destinationName;
      const data = JSON.parse(message.payloadString);
      console.log(data);

      // 각 토픽에 맞는 상태 업데이트
      switch (topic) {
        case MQTT_TOPIC[0]:
          setTemperature(data.temp[0])
          setHumidity(data.hum)
          break;
        case MQTT_TOPIC[1]:
          const index = entity.findIndex((device) => device.device_ip_address === MQTT_BROKER)
          const binaryOnly = data.image.slice(2, -1);
          let date = new Date(data.time);

              let year = date.getUTCFullYear();
              let month = String(date.getUTCMonth() + 1).padStart(2, '0');
              let day = String(date.getUTCDate()).padStart(2, '0');
              let hours = String(date.getUTCHours()).padStart(2, '0');
              let minutes = String(date.getUTCMinutes()).padStart(2, '0');
              let seconds = String(date.getUTCSeconds()).padStart(2, '0');

              let formattedDateStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          setCrash({
            device_num : entity[index].device_num,
            current_time : formattedDateStr,
            error_content : `${data.time}경에 충돌이 발생하였습니다`,
            crash : 1,
            current_image : binaryOnly,
          })
          break;
        case MQTT_TOPIC[2] :
          gps[0] = data.lati
          gps[1] = data.long
          setGps([...gps])
          break
        default:
          console.warn(`Unhandled topic: ${topic}`);
      }
    };

    // MQTT 브로커에 연결
    client.connect({
      onSuccess: () => {
        console.log("Connected to MQTT broker");
        MQTT_TOPIC.forEach((topic) => client.subscribe(topic));
      },
      onFailure: (err) => {
        console.error("Connection failed:", err);
      },
    });
  };


  // SelectBox 값이 바뀔 때
  const SBChange = (e) => {

    if(crash !== null){
      setCrash(null)
    } 
    const index = entity.findIndex((option) => option.device_num === e.value)
    const index_on_off = entity_on_off.findIndex((option) => option.device_num === e.value)
    setIndex(index);
    console.log(index)
    setIndex_OnOff(index_on_off);
    setErrorData(entity_error.filter((entity) => entity.device_num === e.value))
    if(entity[index] && currentPage !== entity[index]) {

      setPage(entity[index]);
      if(mqttClient){
        mqttClient.disconnect()
        console.log("연결을 끊습니다")
        setClient(null)
      }
      mqttStart(entity[index].device_ip_address);
    }
    
  };
  // 차양막 컨트롤 버튼
  const shadeOn = () => {
    if(entity[selectedIndex] && mqttClient){
      dispatch(entity_on_offActions.switchOnOff({
        device_num: entity[selectedIndex].device_num
      }))
      const topic = 'topic/shadeOn';
      const message = 'forward';
      mqttClient.publish(topic, message);
      console.log(`Message sent to topic ${topic}`);
      OnOff_ChangeDB(entity[selectedIndex].device_num, 0)
    }
    else{ 
      alert("No IP");
    }

  }
  const shadeOff = () => {
    if(entity[selectedIndex] && mqttClient){
      dispatch(entity_on_offActions.switchOnOff({
        device_num: entity[selectedIndex].device_num
      }))
      const topic = 'topic/shadeOff';
      const message = 'backward';
      mqttClient.publish(topic, message);
      console.log(`Message sent to topic ${topic}`);
      OnOff_ChangeDB(entity[selectedIndex].device_num, 1)
      console.log(entity_on_off)
    }
    else{
      alert("No IP");
    }
  }
  const OnOff_ChangeDB = async (device_num, current_on_off) => {
    const device_on_offResponse = await fetch("/api/change_Device_on_off", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
      ,
      body: JSON.stringify({
        device_num: device_num,
        current_on_off : current_on_off
      }),
    });
    const dataDevice_on_off = await device_on_offResponse.json();
    console.log(dataDevice_on_off);
  }
  const handleChange = (selectedOptions) => {
    const newSelectedIPs = selectedOptions.map(option => option.value);
    if (new Set(newSelectedIPs).size !== newSelectedIPs.length) {
      alert('이미 선택한 데이터입니다');
      return;
    }
    setSelectedIPs(newSelectedIPs);
  };

  
  const devicesControl = (MQTT_BROKER,action) => {
    const device = entity.find(item => item.device_ip_address === MQTT_BROKER);
    console.log(device)
    if (!device) return;
    const deviceOnOff = entity_on_off.find(item => item.device_num === device.device_num);
    if(!deviceOnOff) return;
    if(deviceOnOff.current_on_off === 0 && ['select off','all off'].includes(action) ){
      console.log("이미 off 입니다");
      return
    }
    else if(deviceOnOff.current_on_off ===1 && ['select on', 'all on'].includes(action)){
        console.log("이미 on 입니다");
        return
    }
    const MQTT_PORT = 9001;
    const client_select = new Client(MQTT_BROKER, MQTT_PORT, "clientId-" + Math.random())
    client_select.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:", responseObject.errorMessage);
      }
    };
    client_select.connect({
      onSuccess: () => {
        console.log("Connected to MQTT broker");


        if(deviceOnOff.current_on_off === 0 && ['select on', 'all on'].includes(action)){
          const topic = 'topic/shadeOn';
          const message = 'forward';
          client_select.publish(topic, message);
          OnOff_ChangeDB(device.device_num, 0)
        }
        else if(deviceOnOff.current_on_off === 1 && ['select off', 'all off'].includes(action)){
          const topic = 'topic/shadeOff';
          const message = 'backward';
          client_select.publish(topic, message);
          OnOff_ChangeDB(device.device_num, 1)
        }
        client_select.disconnect()
      },
      onFailure: (err) => {
        console.error("Connection failed:", err);
      },
    });
    dispatch(entity_on_offActions.switchOnOff({
      device_num: device.device_num
    }))
  }

  const handleButtonClick = (action) => {
    if (action === 'select on' || action === 'select off') {
      console.log(selectedIPs)
      if(selectedIPs.length !== 0){
        for(let i =0 ; i<selectedIPs.length; i++){
          devicesControl(selectedIPs[i],action)
        }
        setSelectedIPs([]);
        closeModal()
      } 
      else {
        alert("값을 입력해주세요");
      }
    } else if (action === 'all on' || action === 'all off') {
      const ip_address_all = filteredEntity.map(element => (
        element.device_ip_address
      ))
      console.log(ip_address_all)
      if(ip_address_all.length !== 0){
        for(let i =0 ; i<ip_address_all.length; i++){
          devicesControl(ip_address_all[i],action)
        }
        setSelectedIPs([]);
        closeModal()
      }
      else{
        alert("device가 존재하지 않습니다")
        closeModal()
      } 
    
    }
  };
  useEffect(() => {
    if (crash !== null) {
      console.log(crash);
      dispatch(entity_errorActions.insertEntity({
        device_num: crash.device_num,
        current_time: crash.current_time,
        error_content: crash.error_content,
        crash: crash.crash,
        current_image: crash.current_image,
      }));
    }
  }, [crash,dispatch])

  useEffect(() => {
    // entity_error가 업데이트될 때마다 UI를 업데이트합니다.
    if (selectedIndex !== null && entity_error !== null) {
      // 필터링된 데이터를 setErrorData로 설정합니다.
      setErrorData(entity_error.filter((device) => device.device_num === entity[selectedIndex].device_num));
    }
  }, [entity_error, entity, selectedIndex]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }

    
    const params = new URLSearchParams(location.search);
    const deviceNum = params.get("device_num");
    if(deviceNum) {
      const selectedIndex = entity.findIndex(
        (option) => option.device_num === deviceNum
      );
      console.log(deviceNum)
      if(selectedIndex !== -1){
        setPage((prevPage) => {
          if (prevPage !== foundDevice) {
            return foundDevice;
          }
          return prevPage;
        });
        const foundDevice = entity.find(device => device.device_num === deviceNum);
        console.log(foundDevice)
        if (selectRef.current) {
          console.log(selectRef.current)
          const arg = {'value' : deviceNum, 'label' : foundDevice.device_ip_address}
          selectRef.current.setValue(arg, 'select-option', { action: 'select-option' });
        }
      }
    }


    // if(mqttClient){
    //   mqttClient.disconnect();
    //   console.log("연결이 끊어졌습니다");
    //   setClient(null);
    // }
    
  }, [isLoggedIn, navigate,entity,location.search]);

  const filteredEntity = useMemo(() => {
    return entity.filter(item => item.location === dept);
  }, [entity, dept])

  return (
    <div>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Select Control Devices"
      >
        <h2>Select Control Devices</h2>
        <Select
          isMulti
          options={filteredEntity.map(element => ({
            value: element.device_ip_address,
            label: element.device_num,
          }))}
          onChange={handleChange}
        />
        <div>
        {selectedIPs.map(ip => {
          const device = entity.find(element => element.device_ip_address === ip);
          const deviceStatus = entity_on_off.find(element => element.device_num === device.device_num)?.current_on_off;
          return (
            <div key={ip}>
              IP: {ip}, Status: {deviceStatus}
            </div>
          );
        })}
        </div>
        <div className={styles.buttonContainer}>
        <div className={styles.upperButtons}>
          <Button className = {styles.Btn1} onClick={() => handleButtonClick('select on')}>Select On</Button>
          <Button className = {styles.Btn2} onClick={() => handleButtonClick('select off')}>Select Off</Button>
        </div>
        <div className={styles.lowerButtons}>
          <Button className = {styles.Btn1} onClick={() => handleButtonClick('all on')}>All On</Button>
          <Button className = {styles.Btn2} onClick={() => handleButtonClick('all off')}>All Off</Button>
        </div>
        </div>
      </Modal>


      <Row>
        <Col xx1="1">
          <Select
            options={filteredEntity.map(function (element) {
              return {
                value: element.device_num,
                label: element.device_ip_address,
              };
            })}
            ref={selectRef}
            value={currentPage? currentPage.device_num : null}
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
            value={currentPage ? temperature + " °C" : "?"}
            icon={<FaTemperatureHigh size={30} color="#A5DD9B" />}
          />
        </Col>
        <Col key={"Card_Entity1"} sm="6" lg="4">
          <TopCards
            key={"Card_Entity_1"}
            bg="#FFB996"
            title="Humi"
            subtitle="whole-mean"
            value={currentPage ? humidity + " %" : "?"}
            icon={<WiHumidity size={30} color="#FA7070" />}
          />
        </Col>
        <Col key={"Card_Entity2"} sm="6" lg="4">
          <TopCards
            key={"Card_Entity_2"}
            bg="#FFCF81"
            title="sunshade"
            subtitle="whole-mean"
            value={currentPage ? entity_on_off[selectedIndex_OnOff].current_on_off===1 ? "0" : "X" : "?"}
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
            value={currentPage ? (gps[0]?gps[0].toFixed(4) : "?") : "?"}
            icon={<TbWorldLatitude size={30} color="AF8260" />}
          />
        </Col>
        <Col key={"Card_Entity4"} sm="6" lg="4">
          <TopCards
            key={"Card_Entity_4"}
            bg="#E1F7F5"
            title="Long"
            subtitle="location-2"
            value={currentPage ? (gps[1] ? gps[1].toFixed(4) : "?") : "?"}
            icon={<TbWorldLongitude size={30} color="9AC8CD" />}
          />
        </Col>
      </Row>
      {/**컨트롤러**/}
      <Row className={`${styles.row} ${styles.controller}`}>
        {/* Button 1 */}
        <Col xs="auto">
          <Button className={`${styles.controlBtn} ${styles.Btn1}`} id="ctrl_btn1" onClick={() => shadeOn()} disabled={entity_on_off[selectedIndex] && entity_on_off[selectedIndex].current_on_off === 1 ? true : false } >
            Shade On
          </Button>
        </Col>
        {/* Button 2 */}
        <Col xs="auto">
          <Button className={`${styles.controlBtn} ${styles.Btn2}`}  id="ctrl_btn2" onClick={() => shadeOff()} disabled={entity_on_off[selectedIndex] && entity_on_off[selectedIndex].current_on_off === 0 ? true : false }>
            Shade Off
          </Button>
        </Col>
        {/* Button 3 */}
        <Col xs="auto">
          <Button className={`${styles.controlBtn} ${styles.Btn3}`} onClick={openModal} id="ctrl_btn3">
            Devices Control
          </Button>
        </Col>
      </Row>

      {/***Table ***/}
      <Row key={"Table_Entity"} className={styles.row}>
        <Col key={"Err_Entity0"} lg="12" xxl="12" md="12">
          <ErrorTable key={"Err_Entity_0"} err_data={errorData}/>
        </Col>
      </Row>
    </div>
  );
}

export default EntityPage;
