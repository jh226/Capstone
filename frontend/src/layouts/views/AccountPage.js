import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { useAuth } from "../../Login.Status";
import styles from "./Account.module.css";
import profile_pic from "../../assets/images/lettuce.png";

function AccountPage() {
  const { info, isLoggedIn, username, password, IsAdmin, name, email, dept, phone, joinDate, loginDate, controlDate } = useAuth();
  const [selectedItem, setSelectedItem] = useState(dept);
  const [isDropdownDisabled, setIsDropdownDisabled] = useState(true);
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [editname, seteditname] = useState(name);
  const [editphone, seteditphone] = useState(phone);
  const [editemail, seteditemail] = useState(email);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    GetInfo();
  }, [isLoggedIn, navigate]);

  const GetInfo = async (event) => {
    try {
      const response = await fetch('/api/getUserInfo', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              userID: username,
          })
      });

      const data = await response.json();

      if (data.success) {
        info(data.userinfo);
      }
    } catch (error) {
        console.error('Error:', error);
    }
  };

  //관리지역 선택
  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
  };

  //Edit버튼
  const handleButtonClick = async() => {
    if(isEditMode){
      try {
        const response = await fetch('/api/updateUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: username,
                new_name: editname,
                new_phone:editphone,
                new_email:editemail
            })
        });
  
        const data = await response.json();
  
        if (data.success) {
          console.log('수정 성공')
        }
      } catch (error) {
          console.error('Error:', error);
      }
    }


    setIsEditMode(!isEditMode);
    setIsDropdownDisabled(!isDropdownDisabled);
    setIsPasswordDisabled(!isPasswordDisabled);
  };

  //Pwd 보이기/숨김 처리
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.accountInfo}>
        {/*이미지 부분 */}
        <Image
          src={profile_pic}
          className={styles.profileImage}
          roundedCircle
        />
        <div className={styles.username}>{username}</div>

        {/* 정보 부분 */}
        <div>
          <div className={styles.info}>
            <div style={{ marginBottom: "8px" }}>Group</div>
            <div>
              <label htmlFor="onRadio" className={styles.radio}>
                <input
                  type="radio"
                  value="admin"
                  defaultChecked={IsAdmin}
                  style={{ marginRight: "10px" }}
                  // disabled
                />
                관리자
              </label>

              <label htmlFor="offRadio">
                <input
                  type="radio"
                  value="client"
                  defaultChecked={!IsAdmin}
                  style={{ marginRight: "10px" }}
                  disabled
                />
                일반 회원
              </label>
            </div>
          </div>

          <Form.Group as={Col} controlid="formGridName" className={styles.info}>
            <Form.Label>name</Form.Label>
            <Form.Control type="name" placeholder="Enter Name" value={editname} 
            disabled={!isEditMode} onChange={(e) => seteditname(e.target.value)}>
            </Form.Control>
          </Form.Group>

          <Dropdown className={styles.info}>
            <div> 관리 지역 </div>
            <Dropdown.Toggle
              className={styles.select}
              disabled={isDropdownDisabled}
            >
              {selectedItem}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSelect("동구")}>
                동구
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect("중구")}>
                중구
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect("서구")}>
                서구
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect("유성구")}>
                유성구
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect("대덕구")}>
                대덕구
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Form.Group
            as={Col}
            controlid="formGridEmail"
            className={styles.info}
          >
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={editemail} 
            disabled={!isEditMode} onChange={(e) => seteditemail(e.target.value)}>
            </Form.Control>
          </Form.Group>

          <Form.Group
            as={Col}
            controlid="formGridPhone"
            className={styles.info}
          >
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="phone" placeholder="Enter phone number" value={editphone} 
            disabled={!isEditMode} onChange={(e) => seteditphone(e.target.value)}>
            </Form.Control>
          </Form.Group>

          <div className={styles.info}>
            <div>Password</div>
            <InputGroup as={Col}>
              {/* <Form.Label>Password</Form.Label> */}
              <Form.Control
                controlid="formGridPassword"
                type={showPassword ? "text" : "password"}
                placeholder={Array({password}.length).fill("*").join("")}
                value={password}
                disabled
              />
              <Button
                onClick={handleTogglePassword}
                disabled={isPasswordDisabled}
                className={styles.pwd_btn}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </Button>
            </InputGroup>
          </div>

          <Form.Group as={Row} className={styles.info_btn}>
            <Col sm={{ span: 10 }}>
              <Button type="button" onClick={handleButtonClick}>
                {isEditMode ? "Done" : "Edit"}
              </Button>
            </Col>
          </Form.Group>
        </div>
      </div>

      {/* 활동 정보 */}
      <div className={styles.history}>
        <div className={styles.history_title}>활동 정보</div>

        <div className={styles.history_label}>가입일</div>
        <div className={styles.history_content}>
          {Array.isArray(joinDate) ? joinDate.map((date, index) => (
            <div key={index}>{new Date(date).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\//g, '.').replace(',', '')}</div>
          )) : <div>{new Date(joinDate).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\//g, '.').replace(',', '')}</div>}
        </div>



        <br />
        <hr />
        <br />

        <div className={styles.history_label}>로그인 내역</div>
        <div className={styles.history_content}>
          {Array.isArray(loginDate) ? loginDate.map((date, index) => (
            <div key={index}>{new Date(date).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\//g, '.').replace(',', '')}</div>
          )) : <div>{new Date(loginDate).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\//g, '.').replace(',', '')}</div>}
        </div>


        <br />
        <hr />
        <br />

        <div className={styles.history_label}>조작 내역</div>
        <div className={styles.history_content}>
          {Array.isArray(controlDate) ? controlDate.map((date, index) => (
            <div key={index}>{new Date(date).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\//g, '.').replace(',', '')}</div>
          )) : <div>{new Date(controlDate).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\//g, '.').replace(',', '')}</div>}
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
