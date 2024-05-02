import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

import { useAuth } from "../../Login.Status";
import styles from "./LoginPage.module.css";
import Logo from "../../assets/images/lettuce.png";

function AccountPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  //로그인 이벤트
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await delay(500);

    try {
      const response = await fetch('/api/loginCheck', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              userID: inputUsername,
              userPW: inputPassword
          })
      });

      const data = await response.json();

      if (data.success) {
          setShow(false);
          login(inputUsername, inputPassword, data.user, data.userinfo);
          navigate("/");
      } else {
          setShow(true);
      }
  } catch (error) {
      console.error('Error:', error);
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
