import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { useAuth } from "../../Login.Status";
import styles from "./Account.module.css";
import profile_pic from "../../assets/images/lettuce.png";

function AccountPage() {
  const {
    updateUserInfo,
    info,
    isLoggedIn,
    username,
    password,
    IsAdmin,
    name,
    email,
    dept,
    phone,
    joinDate,
    loginDate,
    controlDate,
    log,
  } = useAuth();
  const [selectedItem, setSelectedItem] = useState(dept);
  const [isDropdownDisabled, setIsDropdownDisabled] = useState(true);
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(true);
  const [show_modal, setModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [editname, seteditname] = useState(name);
  const [editphone, seteditphone] = useState(phone);
  const [editemail, seteditemail] = useState(email);
  const navigate = useNavigate();

  //사용자 정보 가져오기(조작내역)
  const GetInfo = useCallback(async () => {
    try {
      const response = await fetch("/api/getUserInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: username,
        }),
      });

      const data = await response.json();

      if (data.success) {
        info(data.userinfo);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [info, username]);

  //사용자 정보 가져오기(이메일, 폰...)
  const GetUserAcc = async () => {
    try {
      const response = await fetch("/api/getUserAcc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: username,
        }),
      });

      const data = await response.json();

      if (data.success) {
        updateUserInfo(data.user);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    GetInfo();
  }, [isLoggedIn, navigate]);

  const handleClose = () => setModal(false);
  const show_EditModal = () => setModal(true);
  const handleYes = async () => {
    try {
      await fetch("/api/updateUserInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: username,
          new_name: editname,
          new_phone: editphone,
          new_email: editemail,
        }),
      });
    } catch (error) {
      console.error("Error:", error);
    }

    GetUserAcc();

    setModal(false);
    setIsEditMode(!isEditMode);
    setIsDropdownDisabled(!isDropdownDisabled);
  };

  //관리지역 선택
  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
  };

  //Edit버튼
  const handleButtonClick = async () => {
    if (isEditMode) {
      if (name !== editname || phone !== editphone || email !== editemail) {
        show_EditModal();
      } else {
        setIsEditMode(!isEditMode);
        setIsDropdownDisabled(!isDropdownDisabled);
        setIsPasswordDisabled(!isPasswordDisabled);
      }
    } else {
      setIsEditMode(!isEditMode);
      setIsDropdownDisabled(!isDropdownDisabled);
      setIsPasswordDisabled(!isPasswordDisabled);
    }
  };

  //Pwd 보이기/숨김 처리
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.accountInfo}>
        {/*이미지 부분 */}
        <div className={styles.username}>
            <Image
            src={profile_pic}
            className={styles.profileImage}
            roundedCircle
          /> 
          <div>{username}</div>
        </div>
        {/* <div className={styles.username}>{username}</div> */}

        {/* 정보 부분 */}
        <div>
          <div className={styles.info}>
            <div style={{ marginBottom: "8px" }}>Group</div>
            <div>
              <label htmlFor="onRadio" className={styles.radio}>
                <input
                  id="onRadio"
                  type="radio"
                  value="admin"
                  defaultChecked={IsAdmin}
                  style={{ marginRight: "10px" }}
                />
                관리자
              </label>

              <label htmlFor="offRadio">
                <input
                  id="offRadio"
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
            <Form.Control
              type="name"
              placeholder="Enter Name"
              value={editname}
              disabled={!isEditMode}
              onChange={(e) => seteditname(e.target.value)}
            ></Form.Control>
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
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={editemail}
              disabled={!isEditMode}
              onChange={(e) => seteditemail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group
            as={Col}
            controlid="formGridPhone"
            className={styles.info}
          >
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="phone"
              placeholder="Enter phone number"
              value={editphone}
              disabled={!isEditMode}
              onChange={(e) => seteditphone(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <div className={styles.info}>
            <div>Password</div>
            <InputGroup as={Col}>
              <Form.Control
                controlid="formGridPassword"
                type={showPassword ? "text" : "password"}
                placeholder={Array({ password }.length).fill("*").join("")}
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
              <Button type="button" onClick={() => handleButtonClick()}>
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
        <div className={styles.table_container}>
          <Table hover>
            <tbody>
              {Array.isArray(joinDate) ? (
                joinDate.map((date, index) => (
                  <tr key={index}>
                    <td>
                      <div>
                        {new Date(date)
                          .toLocaleDateString("ko-KR")
                          .replace(/\//g, ".")}
                      </div>
                    </td>
                    <td>
                      <div>
                        {new Date(date).toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>
                    <div>
                      {new Date(joinDate)
                        .toLocaleDateString("ko-KR")
                        .replace(/\//g, ".")}
                    </div>
                  </td>
                  <td>
                    <div>
                      {new Date(joinDate).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <br />
        <hr />
        <br />

        <div className={styles.history_label}>로그인 내역</div>
        <div className={styles.table_container}>
          <Table hover>
            <tbody>
              {Array.isArray(loginDate) ? (
                loginDate
                  .map((date, index) => (
                    <tr key={index}>
                      <td>
                        <div>
                          {new Date(date)
                            .toLocaleDateString("ko-KR")
                            .replace(/\//g, ".")}
                        </div>
                      </td>
                      <td>
                        <div>
                          {new Date(date).toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                      </td>
                    </tr>
                  ))
                  .reverse()
              ) : (
                <tr>
                  <td>
                    <div>
                      {new Date(loginDate)
                        .toLocaleDateString("ko-KR")
                        .replace(/\//g, ".")}
                    </div>
                  </td>
                  <td>
                    <div>
                      {new Date(loginDate).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <br />
        <hr />
        <br />

        <div className={styles.history_label}>조작 내역</div>
        <div className={styles.table_container}>
          <Table hover>
            <tbody>
              {Array.isArray(controlDate) ? (
                controlDate
                  .map((date, index) => (
                    <tr key={index}>
                      <td>
                        <div>
                          {new Date(date)
                            .toLocaleString("ko-KR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                            .replace(/\//g, ".")
                            .replace(",", "")}
                        </div>
                      </td>
                      <td>
                        <div>{log[index]}</div>
                      </td>
                    </tr>
                  ))
                  .reverse()
              ) : (
                <tr>
                  <td>
                    <div>
                      {new Date(controlDate)
                        .toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        .replace(/\//g, ".")
                        .replace(",", "")}
                    </div>
                  </td>
                  <td>
                    <div>{log}</div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* 수정 확인 모달 */}
      <Modal
        show={show_modal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="modal_title">정보 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>정보를 수정하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancle
          </Button>
          <Button variant="primary" onClick={() => handleYes()}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AccountPage;
