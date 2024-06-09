import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Col,
  Row,
  Pagination,
  PaginationItem,
  PaginationLink,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FaSearch } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import styles from "./ObjTable.module.css";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { entityActions } from "../redux/entitySlice";
import { entity_on_offActions } from "../redux/entity_on_offSlice";

function EObjTable({ active, userid, devices }) {
  //전역 변수 데이터(ENTITY)
  // const devices = useSelector((state) => state.entity.entity);
  
  
  //전역 변수 데이터(ENTITY_On_Off)
  const devices_on_off = useSelector(
    (state) => state.entity_on_off.entity_on_off
  );

  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const [show_data, setData] = useState(devices);
  const [dropdownOpen, setDropdownOpen] = useState(devices.map(() => false));
  const [show_Addmodal, setAddModal] = useState(false);
  const [show_UpdateModal, setUpdateModal] = useState(false);
  const [show_DeleteModal, setDeleteModal] = useState(false);
  const [seletedDelete, setseletedDelete] = useState("");
  const [selectedValue, setSelectedValue] = useState("On");
  const [formData, setFormData] = useState({
    device_num: "",
    new_device_num: "",
    ip1: "",
    ip2: "",
    ip3: "",
    ip4: "",
    latitude1: "",
    latitude2: "",
    longitude1: "",
    longitude2: "",
    location: "",
    active: "On",
  });
  //tab 필터 처리
  const filterData = useCallback(
    (active) => {
      let filteredData = [];
      if (active === "All") {
        filteredData = devices.map((device) => {
          const matchingDevice = devices_on_off.find(
            (item) => item.device_num === device.device_num
          );
          return {
            ...device,
            Active:
              matchingDevice && matchingDevice.current_on_off === 1
                ? "On"
                : "Off",
          };
        });
      } else if (active === "Active") {
        filteredData = devices
          .filter((device) => {
            const matchingDevice = devices_on_off.find(
              (item) => item.device_num === device.device_num
            );
            return matchingDevice && matchingDevice.current_on_off === 1;
          })
          .map((device) => {
            const matchingDevice = devices_on_off.find(
              (item) => item.device_num === device.device_num
            );
            return {
              ...device,
              Active:
                matchingDevice && matchingDevice.current_on_off === 1
                  ? "On"
                  : "Off",
            };
          });
      } else if (active === "InActive") {
        filteredData = devices
          .filter((device) => {
            const matchingDevice = devices_on_off.find(
              (item) => item.device_num === device.device_num
            );
            return matchingDevice && matchingDevice.current_on_off === 0;
          })
          .map((device) => {
            const matchingDevice = devices_on_off.find(
              (item) => item.device_num === device.device_num
            );
            return {
              ...device,
              Active:
                matchingDevice && matchingDevice.current_on_off === 0
                  ? "Off"
                  : "On",
            };
          });
      }
      setData(filteredData);
    },
    [devices, devices_on_off]
  );

  useEffect(() => {
    console.log(devices);
    filterData(active);
  }, [active, devices, devices_on_off, filterData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!devices.length || !devices_on_off.length) {
          // 재 로그인
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [
    // getdevicelist,
    // getdevicelist_human,
    devices.length,
    devices_on_off.length,
  ]);

  //more 드롭다운
  const toggle = (index) => {
    const newDropdownOpen = [...dropdownOpen];
    newDropdownOpen[index] = !newDropdownOpen[index];
    setDropdownOpen(newDropdownOpen);
  };

  //Update모달
  const handleShowUpdate = (device) => {
    setFormData({
      device_num: device.device_num,
      new_device_num: device.device_num,
      ip1: device.device_ip_address.split(".")[0],
      ip2: device.device_ip_address.split(".")[1],
      ip3: device.device_ip_address.split(".")[2],
      ip4: device.device_ip_address.split(".")[3],
      latitude1: device.latitude.toString().split(".")[0],
      latitude2: device.latitude.toString().split(".")[1],
      longitude1: device.longitude.toString().split(".")[0],
      longitude2: device.longitude.toString().split(".")[1],
      location: device.location,
      active: device.Active ? "On" : "Off",
    });

    setUpdateModal(true);
  };
  const handleUpdateClose = () => setUpdateModal(false);
  const handleUpdateSave = async () => {
    if (
      document.getElementById("ip1").value === "" ||
      document.getElementById("ip2").value === "" ||
      document.getElementById("ip3").value === "" ||
      document.getElementById("ip4").value === "" ||
      document.getElementById("latitude1").value === "" ||
      document.getElementById("latitude2").value === "" ||
      document.getElementById("longitude1").value === "" ||
      document.getElementById("longitude2").value === "" ||
      document.getElementById("location").value === ""
    ) {
      alert("입력 필드를 모두 채워주세요.");
    } else if (
      formData.device_num !== formData.new_device_num &&
      devices.some((device) => device.device_num === formData.new_device_num)
    ) {
      alert("중복된 device_num을 사용하면 안됩니다.");
    } else {
      const new_device_num = formData.new_device_num;
      const new_ip =
        formData.ip1 +
        "." +
        formData.ip2 +
        "." +
        formData.ip3 +
        "." +
        formData.ip4;

      const new_Location = formData.location;
      const new_Latitude = parseFloat(
        formData.latitude1 + "." + formData.latitude2
      );
      const new_Longitude = parseFloat(
        formData.longitude1 + "." + formData.longitude2
      );

      const log = `Update ${formData.device_num}(${formData.new_device_num}) Device`;

      try {
        const response = await fetch("/api/UpdateDevice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserId: userid,
            Msg: "ControlDate",
            Log: log,
            Device_num: formData.device_num,
            New_Device_num: new_device_num,
            New_Latitude: new_Latitude,
            New_Longitude: new_Longitude,
            Location: new_Location,
            IP: new_ip,
            Active: selectedValue === "On" ? 1 : 0,
          }),
        });

        const data = await response.json();

        if (data.success) {
          dispatch(
            entity_on_offActions.updateEntity({
              device_num: formData.device_num,
              new_device_num: new_device_num,
              current_on_off: selectedValue === "On" ? 1 : 0,
            })
          );
          dispatch(
            entityActions.updateEntity({
              device_num: formData.device_num,
              new_device_num,
              latitude: new_Latitude,
              longitude: new_Longitude,
              location: new_Location,
              device_ip_address: new_ip,
            })
          );

          setCurrentPage(1);
          handleUpdateClose();
          alert("수정 성공");
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  // 수정 모달 입력 폼
  const handle_new_device_numChange = (event) => {
    setFormData({ ...formData, new_device_num: event.target.value });
  };
  const handleIP1Change = (event) => {
    setFormData({ ...formData, ip1: event.target.value });
  };
  const handleIP2Change = (event) => {
    setFormData({ ...formData, ip2: event.target.value });
  };
  const handleIP3Change = (event) => {
    setFormData({ ...formData, ip3: event.target.value });
  };
  const handleIP4Change = (event) => {
    setFormData({ ...formData, ip4: event.target.value });
  };
  const handleLatitude1Change = (event) => {
    setFormData({ ...formData, latitude1: event.target.value });
  };
  const handleLatitude2Change = (event) => {
    setFormData({ ...formData, latitude2: event.target.value });
  };
  const handlelongitude1Change = (event) => {
    setFormData({ ...formData, longitude1: event.target.value });
  };
  const handlelongitude2Change = (event) => {
    setFormData({ ...formData, longitude2: event.target.value });
  };
  const handlelocationChange = (event) => {
    setFormData({ ...formData, location: event.target.value });
  };

  //ADD모달
  const handleClose = () => setAddModal(false);
  const handleShow = () => setAddModal(true);
  const isNumeric = (value) => {
    return /^-?\d*\.?\d+$/.test(value);
  };
  const handleSave = async () => {
    if (
      document.getElementById("ip1").value === "" ||
      document.getElementById("ip2").value === "" ||
      document.getElementById("ip3").value === "" ||
      document.getElementById("ip4").value === "" ||
      document.getElementById("latitude1").value === "" ||
      document.getElementById("latitude2").value === "" ||
      document.getElementById("longitude1").value === "" ||
      document.getElementById("longitude2").value === "" ||
      document.getElementById("location").value === ""
    ) {
      alert("입력 필드를 모두 채워주세요.");
    } else if (
      !isNumeric(document.getElementById("ip1").value) ||
      !isNumeric(document.getElementById("ip2").value) ||
      !isNumeric(document.getElementById("ip3").value) ||
      !isNumeric(document.getElementById("ip4").value) ||
      !isNumeric(document.getElementById("latitude1").value) ||
      !isNumeric(document.getElementById("latitude2").value) ||
      !isNumeric(document.getElementById("longitude1").value) ||
      !isNumeric(document.getElementById("longitude2").value)
    ) {
      alert("IP주소 또는 좌표는 숫자로 입력되어야 합니다.");
    } else if (
      devices.some(
        (device) =>
          device.device_num === document.getElementById("device_num").value
      )
    ) {
      alert("중복된 device_num은 사용하면 안됩니다.");
    } else {
      const new_device_num = document.getElementById("device_num").value;
      const new_ip =
        document.getElementById("ip1").value +
        "." +
        document.getElementById("ip2").value +
        "." +
        document.getElementById("ip3").value +
        "." +
        document.getElementById("ip4").value;

      const new_latitude = parseFloat(
        document.getElementById("latitude1").value +
          "." +
          document.getElementById("latitude2").value
      );

      const new_longitude = parseFloat(
        document.getElementById("longitude1").value +
          "." +
          document.getElementById("longitude2").value
      );

      const new_location = document.getElementById("location").value;
      const log = `Add ${new_device_num} Device`;

      try {
        console.log(userid);
        const response = await fetch("/api/addDevice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserId: userid,
            Msg: "ControlDate",
            Log: log,
            Device_num: new_device_num,
            IP: new_ip,
            Latitude: new_latitude,
            Longitude: new_longitude,
            Location: new_location,
            Active: selectedValue === "On" ? 1 : 0,
          }),
        });

        const data = await response.json();

        if (data.success) {
          dispatch(
            entity_on_offActions.insertEntity({
              device_num: new_device_num,
              reservation_time: null,
              uptime: null,
              current_date: null,
              current_on_off: selectedValue === "On" ? 1 : 0,
            })
          );
          dispatch(
            entityActions.insertEntity({
              device_ip_address: new_ip,
              device_num: new_device_num,
              latitude: new_latitude,
              location: new_location,
              longitude: new_longitude,
            })
          );

          setCurrentPage(1);
          handleClose();
          alert("추가 성공");
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  //Delete 모달
  const handleDeleteClose = () => setDeleteModal(false);
  const handleShowDelete = (device_num) => {
    setseletedDelete(device_num);
    setDeleteModal(true);
  };
  const handleDeleteYes = async () => {
    const log = `Delete ${seletedDelete} Device`;

    try {
      const response = await fetch("/api/deleteDevice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserId: userid,
          Msg: "ControlDate",
          Log: log,
          deviceId: seletedDelete,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setDeleteModal(false);
        alert("장치가 성공적으로 삭제되었습니다.");
        dispatch(
          entity_on_offActions.deleteEntity({
            device_num: seletedDelete,
          })
        );
        dispatch(
          entityActions.deleteEntity({
            device_num: seletedDelete,
          })
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 현재 페이지의 데이터 계산
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = show_data.slice(startIndex, endIndex);

  // 페이지 번호 클릭 핸들러
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  //검색 핸들러
  const Search = (e) => {
    const inputElement = document.getElementById("searchInput");
    const input = inputElement.value;

    if (!input) {
      const filteredData = show_data.map((device) => {
        const matchingDevice = devices_on_off.find(
          (item) => item.device_num === device.device_num
        );
        return {
          ...device,
          Active: matchingDevice && matchingDevice.on_off === 1 ? "On" : "Off",
        };
      });
      setData(filteredData);
    } else {
      const searchData = show_data.filter((item) =>
        item.device_num.includes(input)
      );
      const filteredData = searchData.map((device) => {
        const matchingDevice = devices_on_off.find(
          (item) => item.device_num === device.device_num
        );
        return {
          ...device,
          Active: matchingDevice && matchingDevice.on_off === 1 ? "On" : "Off",
        };
      });
      setData(filteredData);
    }
  };

  return (
    <div>
      <h2>그늘막 현황</h2>

      {/* 검색 */}
      <div className={styles.search}>
        <InputGroup as={Col}>
          <Form.Control
            id="searchInput"
            placeholder="Search Device Num"
            onChange={Search}
          />
          <Button onClick={Search}>
            <FaSearch />
          </Button>
        </InputGroup>
      </div>

      {/* 테이블 */}
      <Table>
        <thead>
          <tr>
            <th style={{ width: "20%" }}>Device Num</th>
            <th style={{ width: "50%" }}>IP</th>
            <th style={{ width: "20%" }}>Active</th>
            <th style={{ width: "10%" }}></th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={index}>
              <td>{item.device_num}</td>
              <td>{item.device_ip_address}</td>
              <td>{item.Active}</td>
              <td>
                <Dropdown
                  isOpen={dropdownOpen[index]}
                  toggle={() => toggle(index)}
                >
                  <DropdownToggle color="dark" className={styles.more}>
                    <IoIosMore />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>Edit</DropdownItem>
                    <DropdownItem onClick={() => handleShowUpdate(item)}>
                      Update
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handleShowDelete(item.device_num)}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 추가 버튼*/}
      <div className={styles.add_container}>
        <Button variant="dark" onClick={() => handleShow()}>
          Add
        </Button>
      </div>

      {/* add modal */}
      <Modal
        show={show_Addmodal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="modal_title">그늘막 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modal_content}>
          <Form>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "100px", marginRight: "50px" }}>
                Device Num
              </div>
              <Row>
                <Col style={{ padding: "5px" }}>
                  <Form.Control
                    type="text"
                    placeholder="xxxx"
                    id="device_num"
                  />
                </Col>
              </Row>
            </div>
            <hr />

            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "100px", marginRight: "50px" }}>IP</div>
              <Row>
                <Col style={{ padding: "5px" }}>
                  <Form.Control type="text" placeholder="xxx" id="ip1" />
                </Col>
                <Col style={{ padding: "5px" }}>
                  <Form.Control type="text" placeholder="xxx" id="ip2" />
                </Col>
                <Col style={{ padding: "5px" }}>
                  <Form.Control type="text" placeholder="xxx" id="ip3" />
                </Col>
                <Col style={{ padding: "5px" }}>
                  <Form.Control type="text" placeholder="xxx" id="ip4" />
                </Col>
              </Row>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: "37px" }}>Latitude</div>
              <Row>
                <Col style={{ padding: "5px" }}>
                  <Form.Control type="text" placeholder="xx" id="latitude1" />
                </Col>
                <Col style={{ padding: "5px" }}>
                  <Form.Control
                    type="text"
                    placeholder="xxxxxx"
                    id="latitude2"
                  />
                </Col>
              </Row>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: "29px" }}>Longitude</div>
              <Row>
                <Col style={{ padding: "5px" }}>
                  <Form.Control type="text" placeholder="xx" id="longitude1" />
                </Col>
                <Col style={{ padding: "5px" }}>
                  <Form.Control
                    type="text"
                    placeholder="xxxxxx"
                    id="longitude2"
                  />
                </Col>
              </Row>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: "35px" }}>Location</div>
              <Row>
                <Col style={{ padding: "5px", width: "393px" }}>
                  <Form.Control type="text" placeholder="xxxx" id="location" />
                </Col>
              </Row>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <div style={{ width: "100px", marginRight: "-5px" }}>Active</div>
              <div>
                <label htmlFor="onRadio" className={styles.radio}>
                  <input
                    type="radio"
                    id="onRadio"
                    name="status"
                    value="On"
                    checked={selectedValue === "On"}
                    onChange={handleChange}
                    style={{ marginRight: "10px" }}
                  />
                  On
                </label>

                <label htmlFor="offRadio">
                  <input
                    type="radio"
                    id="offRadio"
                    name="status"
                    value="Off"
                    checked={selectedValue === "Off"}
                    onChange={handleChange}
                    style={{ marginRight: "10px" }}
                  />
                  Off
                </label>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* update modal */}
      <Modal
        show={show_UpdateModal}
        onHide={handleUpdateClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="modal_title">그늘막 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modal_content}>
          <Form>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "100px", marginRight: "50px" }}>
                Device Num
              </div>
              <Row>
                <Col style={{ padding: "5px" }}>
                  <Form.Control
                    type="text"
                    value={formData.new_device_num}
                    onChange={handle_new_device_numChange}
                    id="device_num"
                  />
                </Col>
              </Row>
            </div>
            <hr />

            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "100px", marginRight: "50px" }}>IP</div>
              <Row>
                <Col style={{ padding: "5px" }}>
                  <Form.Control
                    type="text"
                    value={formData.ip1}
                    onChange={handleIP1Change}
                    id="ip1"
                  />
                </Col>
                <Col style={{ padding: "5px" }}>
                  <Form.Control
                    type="text"
                    value={formData.ip2}
                    onChange={handleIP2Change}
                    id="ip2"
                  />
                </Col>
                <Col style={{ padding: "5px" }}>
                  <Form.Control
                    type="text"
                    value={formData.ip3}
                    onChange={handleIP3Change}
                    id="ip3"
                  />
                </Col>
                <Col style={{ padding: "5px" }}>
                  <Form.Control
                    type="text"
                    value={formData.ip4}
                    onChange={handleIP4Change}
                    id="ip4"
                  />
                </Col>
              </Row>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: "37px" }}>Latitude</div>
              <Row>
                <Col style={{ padding: "5px" }}>
                  <Form.Control
                    type="text"
                    value={formData.latitude1}
                    onChange={handleLatitude1Change}
                    id="latitude1"
                  />
                </Col>
                <Col style={{ padding: "5px" }}>
                  <Form.Control
                    type="text"
                    value={formData.latitude2}
                    onChange={handleLatitude2Change}
                    id="latitude2"
                  />
                </Col>
              </Row>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: "29px" }}>Longitude</div>
              <Row>
                <Col style={{ padding: "5px" }}>
                  <Form.Control
                    type="text"
                    value={formData.longitude1}
                    onChange={handlelongitude1Change}
                    id="longitude1"
                  />
                </Col>
                <Col style={{ padding: "5px" }}>
                  <Form.Control
                    type="text"
                    value={formData.longitude2}
                    onChange={handlelongitude2Change}
                    id="longitude2"
                  />
                </Col>
              </Row>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: "35px" }}>Location</div>
              <Row>
                <Col style={{ padding: "5px", width: "393px" }}>
                  <Form.Control
                    type="text"
                    value={formData.location}
                    onChange={handlelocationChange}
                    id="location"
                  />
                </Col>
              </Row>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <div style={{ width: "100px", marginRight: "-5px" }}>Active</div>
              <div>
                <label htmlFor="onRadio" className={styles.radio}>
                  <input
                    type="radio"
                    id="onRadio"
                    name="status"
                    value="On"
                    checked={selectedValue === "On"}
                    onChange={handleChange}
                    style={{ marginRight: "10px" }}
                  />
                  On
                </label>

                <label htmlFor="offRadio">
                  <input
                    type="radio"
                    id="offRadio"
                    name="status"
                    value="Off"
                    checked={selectedValue === "Off"}
                    onChange={handleChange}
                    style={{ marginRight: "10px" }}
                  />
                  Off
                </label>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUpdateClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* delete modal */}
      <Modal
        show={show_DeleteModal}
        onHide={handleUpdateClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="modal_title">삭제</Modal.Title>
        </Modal.Header>
        <Modal.Body>그늘막을 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancle
          </Button>
          <Button variant="primary" onClick={() => handleDeleteYes()}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 페이지 버튼 */}
      <Pagination style={{ display: "flex", justifyContent: "center" }}>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink
            previous
            onClick={() => handlePageClick(currentPage - 1)}
          />
        </PaginationItem>
        {[...Array(Math.ceil(devices.length / pageSize)).keys()].map((page) => (
          <PaginationItem active={page + 1 === currentPage} key={page}>
            <PaginationLink onClick={() => handlePageClick(page + 1)}>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem
          disabled={currentPage === Math.ceil(devices.length / pageSize)}
        >
          <PaginationLink
            next
            onClick={() => handlePageClick(currentPage + 1)}
          />
        </PaginationItem>
      </Pagination>
    </div>
  );
}

export default EObjTable;
