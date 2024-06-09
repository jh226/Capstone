import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Col, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";

import ObjTable from "../../components/ObjTable";
import { useAuth } from "../../Login.Status";
import styles from "./Setting.module.css";
import { useSelector } from "react-redux";

function SettingPage() {
  const { isLoggedIn, username, dept } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

  // 로그인 여부 확인
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const devices = useSelector((state) => state.entity.entity)
  const datas = devices.filter((option) => option.location === dept);


  //Tab 이벤트
  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
  };

  return (
    <div className={styles.content}>
      <div className={styles.table_contain}>
        <Tabs
          defaultActiveKey="All"
          id="uncontrolled-tab-example"
          onSelect={handleTabSelect}
          className="mb-3"
        >
          <Tab eventKey="All" title="전체">
            <Row>
              <Col lg="7" xxl="8" md="12" className={styles.table}>
                <ObjTable active={activeTab} userid={username} devices={datas} />
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="Active" title="실행 중">
            <Row>
              <Col lg="7" xxl="8" md="12" className={styles.table}>
                <ObjTable active={activeTab} devices={datas} />
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="InActive" title="중단 됨">
            <Row>
              <Col lg="7" xxl="8" md="12" className={styles.table}>
                <ObjTable active={activeTab} devices ={datas}/>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default SettingPage;
