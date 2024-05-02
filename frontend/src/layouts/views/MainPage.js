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
function MainPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

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
            value="19.9℃"
            icon={<FaTemperatureHigh size={30} color="#A5DD9B" />}
          />
        </Col>
        <Col key={"Card_Main1"} sm="6" lg="3">
          <TopCards
            key={"Card_Main_1"}
            bg="#FFB996"
            title="Humi"
            subtitle="whole-mean"
            value="29%"
            icon={<WiHumidity size={30} color="#FA7070" />}
          />
        </Col>
        <Col key={"Card_Main2"} sm="6" lg="3">
          <TopCards
            key={"Card_Main_2"}
            bg="#FFCF81"
            title="On"
            subtitle="whole-area"
            value="3"
            icon={<LiaUmbrellaBeachSolid size={30} color="#FF9800" />}
          />
        </Col>
        <Col key={"Card_Main3"} sm="6" lg="3">
          <TopCards
            key={"Card_Main_3"}
            bg="#FDFFAB"
            title="Off"
            subtitle="whole-area"
            value="6"
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
          <ErrorTable key={"Err_Main_0"} />
        </Col>
      </Row>
    </div>
  );
}

export default MainPage;
