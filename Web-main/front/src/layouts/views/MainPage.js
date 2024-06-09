import { Col, Row, Button } from "reactstrap";
import Modal from 'react-modal';
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
import React, { useEffect,useState } from "react";
import { useSelector } from "react-redux";
function MainPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const entity_error = useSelector(
    (state) => state.entity_error.entity_error
  )
  const entity_on_off = useSelector(
    (state) => state.entity_on_off.entity_on_off
  )
  const entity = useSelector(
    (state) => state.entity.entity
  )
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

  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedRegionData, setSelectedRegionData] = useState([]);
  const [prevSelectedRegion, setPrevSelectedRegion] = useState("")
  const [prevSelectedDate, setPrevSelectedDate] = useState("")  
  const [dataTemHum, setDataTemHum] = useState([]);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleRegionChange = (event) => setSelectedRegion(event.target.value);
  const handleDateChange = (event) => setSelectedDate(event.target.value);

  const handleApply = async () => {
    if((selectedDate !== '' &&  selectedRegion !== '') && prevSelectedDate !== selectedDate){
      setPrevSelectedDate(selectedDate)
      const tem_humResponse = await fetch("/api/getTemHum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date : selectedDate
        }),
      });
      const tem_humData = await tem_humResponse.json();
      const data = []
      if(tem_humData.success !== false && tem_humData.tem_hum.length!==0){
        for (let i = 0; i < tem_humData.tem_hum.length; i++) {
          data.push(tem_humData.tem_hum[i])
        }
        setDataTemHum(data);
        const filteredData = data.filter(item => item.location === selectedRegion);
        
        //0시 부터 11시 까지와 12시에서 23시까지 데이터를 나누기
        const groupedData = { '0_11': [], '12_23': [] };
  
        filteredData.forEach(item => {
        if (item.hour < 12) {
            groupedData['0_11'].push(item);
        } else {
            groupedData['12_23'].push(item);
        }
        });
        calculateAverage(groupedData['0_11'],groupedData['12_23'])
      }
      else{
        console.log("데이터가 없음")
        calculateAverage([],[])
        setDataTemHum([])
      }
      closeModal();
    }
    else if (prevSelectedRegion !== selectedRegion){
      setPrevSelectedRegion(selectedRegion)
      const filteredData = dataTemHum.filter(item => item.location === selectedRegion);
        
      //0시 부터 11시 까지와 12시에서 23시까지 데이터를 나누기
      const groupedData = { '0_11': [], '12_23': [] };

      filteredData.forEach(item => {
      if (item.hour < 12) {
          groupedData['0_11'].push(item);
      } else {
          groupedData['12_23'].push(item);
      }
      });
      calculateAverage(groupedData['0_11'],groupedData['12_23'])

      closeModal();
    }
    else{
      alert((selectedRegion === '' ? '지역' : '날짜' ) + "를 입력해주세요");
    }
  };

  const calculateAverage = (one_elev, twel_twt) => {
    if(one_elev.length !==0 && twel_twt.length !==0){
    const totalTem_1_11 = one_elev.reduce((sum, item) => sum + item.avg_tem, 0);
    const totalHum_1_11 = one_elev.reduce((sum, item) => sum + item.avg_hum, 0);
    const totalTem_12_23 = twel_twt.reduce((sum, item) => sum + item.avg_tem, 0);
    const totalHum_12_23 = twel_twt.reduce((sum, item) => sum + item.avg_hum, 0);
    setSelectedRegionData([
        (totalTem_1_11 / one_elev.length).toFixed(2),
        (totalHum_1_11 / one_elev.length).toFixed(2),
        (totalTem_12_23 / twel_twt.length).toFixed(2),
        (totalHum_12_23 / twel_twt.length).toFixed(2),
    ]); 
  }
  else if(one_elev.length!==0){
    const totalTem_1_11 = one_elev.reduce((sum, item) => sum + item.avg_tem, 0);
    const totalHum_1_11 = one_elev.reduce((sum, item) => sum + item.avg_hum, 0);
    setSelectedRegionData([
        (totalTem_1_11 / one_elev.length).toFixed(2),
        (totalHum_1_11 / one_elev.length).toFixed(2),
        "X",
        "X",
    ]); 
  }
  else if(twel_twt.length !==0){
    const totalTem_12_23 = twel_twt.reduce((sum, item) => sum + item.avg_tem, 0);
    const totalHum_12_23 = twel_twt.reduce((sum, item) => sum + item.avg_hum, 0);
    setSelectedRegionData([
      "X",
      "X",
      (totalTem_12_23 / twel_twt.length).toFixed(2),
      (totalHum_12_23 / twel_twt.length).toFixed(2),
  ]); 
  }
  else{
    setSelectedRegionData([])
  }
};

  return (
    <div>
      <Row>
      <Button onClick={openModal}>날짜/지역 입력</Button>
      <Modal
        ariaHideApp={false} 
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Select Region and Date"
      >
        <h2 className={styles.modalH2}>Select Region and Date</h2>
        <form  className = {styles.modalForm}>
          <label className = {styles.modalLabel} htmlFor='regionSelect'>Region</label>
          <select
            className = {styles.modalSelect}
            name='region'
            id='regionSelect'
            value={selectedRegion}
            onChange={handleRegionChange}
          >
            <option value=''>Select a region</option>
            <option value='중구'>중구</option>
            <option value='동구'>동구</option>
            <option value='서구'>서구</option>
            <option value='대덕구'>대덕구</option>
            <option value='유성구'>유성구</option>
          </select>
          <br />
          <label className = {styles.modalLabel} htmlFor='dateSelect'>Date</label>
          <input
            className = {styles.modalSelect}
            type='date'
            name='date'
            id='dateSelect'
            value={selectedDate}
            onChange={handleDateChange}
          />
          <br />
          <button className= {styles.applyBtn} type='button' onClick={handleApply}>
            Apply
          </button>
          <button className= {styles.cancelBtn} type='button' onClick={closeModal}>
            Cancel
          </button>
        </form>
      </Modal>
      </Row>
      {/***카드 부분***/}
      <Row key={"Card_Main"} className={styles.row}>
        <Col key={"Card_Main0"} sm="6" lg="3">
          <TopCards
            key={"Card_Main_0"}
            bg="#D9EDBF"
            title="Temp"
            subtitle="whole-mean"
            value={selectedRegionData.length !== 0 ? selectedRegionData[0] + "/" +selectedRegionData[2] : "No Data"}
            icon={<FaTemperatureHigh size={30} color="#A5DD9B" />}
          />
        </Col>
        <Col key={"Card_Main1"} sm="6" lg="3">
          <TopCards
            key={"Card_Main_1"}
            bg="#FFB996"
            title="Humi"
            subtitle="whole-mean"
            value={selectedRegionData.length !== 0 ? selectedRegionData[1] + "/" + selectedRegionData[3] : "No Data"}
            icon={<WiHumidity size={30} color="#FA7070" />}
          />
        </Col>
        <Col key={"Card_Main2"} sm="6" lg="3">
          <TopCards
            key={"Card_Main_2"}
            bg="#FFCF81"
            title="On"
            subtitle="whole-area"
            value={entity_on_off.filter(item => item.current_on_off === 1).length}
            icon={<LiaUmbrellaBeachSolid size={30} color="#FF9800" />}
          />
        </Col>
        <Col key={"Card_Main3"} sm="6" lg="3">
          <TopCards
            key={"Card_Main_3"}
            bg="#FDFFAB"
            title="Off"
            subtitle="whole-area"
            value={entity_on_off.filter(item => item.current_on_off === 0).length}
            icon={<MdOutlineUmbrella size={30} color="FCDC2A" />}
          />
        </Col>
      </Row>
      {/**그래프**/}
      <Row key={"Graph_Main"} className={styles.row}>
        <Col key={"Graph_Main0"} xxl="8">
          <ChartMonth key={"Graph_Main_0"} data={dataTemHum} />
        </Col>
        <Col key={"Graph_Main1"} xxl="4">
          <ChartCircle key={"Graph_Main_1"} entity = {entity} entity_error = {entity_error}  />
        </Col>
      </Row>
      {/***Table ***/}
      <Row key={"Table_Main"} className={styles.row}>
        <Col key={"Err_Main0"} lg="12" xxl="12" md="12">
          <ErrorTable key={"Err_Main_0"} err_data={entity_error}/>
        </Col>
      </Row>
    </div>
  );
}

export default MainPage;
