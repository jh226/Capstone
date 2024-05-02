import { Col, Row, Button } from "reactstrap";
import TopCards from "../../components/TopCards";
import { FaTemperatureHigh } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { ImSwitch } from "react-icons/im";
import { TbWorldLatitude, TbWorldLongitude } from "react-icons/tb";
import styles from "./EntityPage.module.css";
import ErrorTable from "../../components/ErrorTable";
import { useAuth } from "../../Login.Status";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function EntityPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);
  return (
    <div>
      <Row key={"Title_Entity"} className={`${styles.row} ${styles.center}`}>
        <Col xxl="6">
          <div>
            <h1 className={styles.Title_Entity}>
              Area
              <span className={styles.IP_Title}>IP or Location</span>
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
            value="19.9℃"
            icon={<FaTemperatureHigh size={30} color="#A5DD9B" />}
          />
        </Col>
        <Col key={"Card_Entity1"} sm="6" lg="4">
          <TopCards
            key={"Card_Entity_1"}
            bg="#FFB996"
            title="Humi"
            subtitle="whole-mean"
            value="29%"
            icon={<WiHumidity size={30} color="#FA7070" />}
          />
        </Col>
        <Col key={"Card_Entity2"} sm="6" lg="4">
          <TopCards
            key={"Card_Entity_2"}
            bg="#FFCF81"
            title="sunshade"
            subtitle=""
            value="On"
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
            value="36.242"
            icon={<TbWorldLatitude size={30} color="AF8260" />}
          />
        </Col>
        <Col key={"Card_Entity4"} sm="6" lg="4">
          <TopCards
            key={"Card_Entity_4"}
            bg="#E1F7F5"
            title="Long"
            subtitle="location-2"
            value="127.402"
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
          <ErrorTable key={"Err_Entity_0"} />
        </Col>
      </Row>
    </div>
  );
}

export default EntityPage;
