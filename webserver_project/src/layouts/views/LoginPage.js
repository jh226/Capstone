import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

import { useAuth } from "../../Login.Status";
import styles from "./LoginPage.module.css";
import Logo from "../../assets/images/lettuce.png";

import { useDispatch } from "react-redux";
import { entityActions } from "../../redux/entitySlice";
import { entity_humanActions } from "../../redux/entity_humanSlice";
import { entity_on_offActions } from "../../redux/entity_on_offSlice";
import { entity_sensorActions } from "../../redux/entity_sensorSlice";
import { entity_errorActions } from "../../redux/entity_errorSlice";

function AccountPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  //로그인 이벤트
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await delay(500);

    try {
      const response = await fetch("/api/loginCheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: inputUsername,
          userPW: inputPassword,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShow(false);
        login(inputUsername, inputPassword, data.user, data.userinfo);

        const deviceResponse = await fetch("/api/getDevice", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dataDevice = await deviceResponse.json();
        console.log(dataDevice);
        for (let i = 0; i < dataDevice.deviceinfo.length; i++) {
          //전역 변수에 저장
          dispatch(entityActions.insertEntity(dataDevice.deviceinfo[i]));
        }

        const device_humanResponse = await fetch("/api/getDevice_human", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dataDevice_Human = await device_humanResponse.json();
        console.log(dataDevice_Human);
        for (let i = 0; i < dataDevice_Human.deviceinfo_human.length; i++) {
          //전역 변수에 저장
          dispatch(
            entity_humanActions.insertEntity(
              dataDevice_Human.deviceinfo_human[i]
            )
          );
        }

        const device_on_offResponse = await fetch("/api/getDevice_on_off", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dataDevice_on_off = await device_on_offResponse.json();
        console.log(dataDevice_on_off);
        for (let i = 0; i < dataDevice_on_off.deviceinfo_on_off.length; i++) {
          //전역 변수에 저장
          dispatch(
            entity_on_offActions.insertEntity(
              dataDevice_on_off.deviceinfo_on_off[i]
            )
          );
        }

        const sensorResponse = await fetch("/api/getSensor", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dataSensor = await sensorResponse.json();
        console.log(dataSensor);
        for (let i = 0; i < dataSensor.sensorinfo.length; i++) {
          //전역 변수에 저장
          dispatch(
            entity_sensorActions.insertEntity(
              dataSensor.sensorinfo[i]
            )
          );
        }

        const device_errorResponse = await fetch("/api/getDevice_error", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const Device_error = await device_errorResponse.json();
        console.log(Device_error);
        for (let i = 0; i < Device_error.errorinfo.length; i++) {
          //전역 변수에 저장
          dispatch(
            entity_errorActions.insertEntity(
              Device_error.errorinfo[i]
            )
          );
        }

        navigate("/");
      } else {
        setShow(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setShow(true);
    }
    setLoading(false);
  };

  const handlePassword = () => {};

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <div className={styles.sign_in__wrapper}>
      <div className={styles.sign_in__backdrop}></div>

      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        <img
          className="img-thumbnail mx-auto d-block mb-2"
          src={Logo}
          alt="logo"
        />
        <div className="h4 mb-2 text-center">Sign In</div>

        {/* 로그인 실패 경고 */}
        {show ? (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Incorrect username or password.
          </Alert>
        ) : (
          <div />
        )}

        {/* 로그인 폼  */}
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="Username"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className={styles.sign_in_contents} controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="checkbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group>

        {/* 로그인 버튼 */}
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Log In
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Logging In...
          </Button>
        )}
        <div className="d-grid justify-content-end">
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={handlePassword}
          >
            Forgot password?
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AccountPage;
