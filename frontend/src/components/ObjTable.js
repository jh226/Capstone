import React, { useState, useEffect } from "react";
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
import { useDevice } from "../device.Status";

function EObjTable({ active }) {
  const { getDevices, devices, getdevices_human, devices_human } = useDevice();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const [show_data, setData] = useState(devices);
  const [dropdownOpen, setDropdownOpen] = useState(devices.map(() => false));
  const [show_Addmodal, setAddModal] = useState(false);
  const [show_UpdateModal, setUpdateModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState("On");
  const [formData, setFormData] = useState({
    device_num: "",
    new_device_num: "",
    ip1: "",
    ip2: "",
    ip3: "",
    ip4: "",
    Latitude1: "",
    Latitude2: "",
    longitude1: "",
    longitude2: "",
    active: "On"
  });

  // Tab 데이터 처리
  useEffect(() => {
    getdevicelist();
    getdevicelist_human();
  }, [active]);

  const getdevicelist = async () =>{
    try {
      const response = await fetch('/api/getDevice', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          }
      });

      const data = await response.json();

      if (data.success) {
        getDevices(data.deviceinfo)
      } else {
        console.log(data.success);
      }
    } catch (error) {
        console.error('Error:', error);
    }
  }

  const getdevicelist_human = async () =>{
    try {
      const response = await fetch('/api/getDevice_human', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          }
      });

      const data = await response.json();

      if (data.success) {
        getdevices_human(data.deviceinfo_human);
      } else {
        console.log(data.success);
      }
    } catch (error) {
        console.error('Error:', error);
    }
  }

  useEffect(() => {
    filterData(active);
  }, [active, devices, devices_human]);

  //Tab 데이터 필터링
  const filterData = (active) => {
    let filteredData = [];
    
    if (active === "All") {
      filteredData = devices.map(device => {
        const matchingDevice = devices_human.find(item => item.device_num === device.device_num);
        return { ...device, Active: matchingDevice && matchingDevice.on_off === 1 ? "On" : "Off" };
      });
    } else if (active === "Active") {
      filteredData = devices.filter(device => {
        const matchingDevice = devices_human.find(item => item.device_num === device.device_num);
        return matchingDevice && matchingDevice.on_off === 1;
      }).map(device => {
        const matchingDevice = devices_human.find(item => item.device_num === device.device_num);
        return { ...device, Active: matchingDevice && matchingDevice.on_off === 1 ? "On" : "Off" };
      });
    } else if (active === "InActive") {
      filteredData = devices.filter(device => {
        const matchingDevice = devices_human.find(item => item.device_num === device.device_num);
        return matchingDevice && matchingDevice.on_off === 0;
      }).map(device => {
        const matchingDevice = devices_human.find(item => item.device_num === device.device_num);
        return { ...device, Active: matchingDevice && matchingDevice.on_off === 0 ? "Off" : "On" };
      });
    }
  
    setData(filteredData);
  };

  //more 드롭다운
  const toggle = (index) => {
    const newDropdownOpen = [...dropdownOpen];
    newDropdownOpen[index] = !newDropdownOpen[index];
    setDropdownOpen(newDropdownOpen);
  };

  const handleDelete = async (deviceNum) => {
    try {
      const response = await fetch('/api/deleteDevice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deviceId: deviceNum
        })
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert('장치가 성공적으로 삭제되었습니다.');

        await getdevicelist();
        await getdevicelist_human();
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //Update모달
  const handleShowUpdate = (device) =>{
      setFormData({
        device_num: device.device_num,
        new_device_num: device.device_num,
        ip1: device.address_ip.split('.')[0],
        ip2: device.address_ip.split('.')[1],
        ip3: device.address_ip.split('.')[2],
        ip4: device.address_ip.split('.')[3],
        Latitude1: device.location.split('-')[0].split('.')[0],
        Latitude2: device.location.split('-')[0].split('.')[1],
        longitude1: device.location.split('-')[1].split('.')[0],
        longitude2: device.location.split('-')[1].split('.')[1],
        active: device.Active ? "On" : "Off"
      });

      setUpdateModal(true);
  }
  const handleUpdateClose = () => setUpdateModal(false);
  const handleUpdateSave= async () => {
    if (
      document.getElementById("ip1").value === "" ||
      document.getElementById("ip2").value === "" ||
      document.getElementById("ip3").value === "" ||
      document.getElementById("ip4").value === "" ||
      document.getElementById("Latitude1").value === "" ||
      document.getElementById("Latitude2").value === "" ||
      document.getElementById("longitude1").value === "" ||
      document.getElementById("longitude2").value === ""
    ) {
      alert("입력 필드를 모두 채워주세요.");
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

      const new_Location = formData.Latitude1 +"." + formData.Latitude2 + "-" +formData.longitude1+"." + formData.longitude2;

      try {
        const response = await fetch('/api/UpdateDevice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              Device_num: formData.device_num,
              New_Device_num: new_device_num,
              IP: new_ip,
              Location : new_Location,
              Active: selectedValue==='On'? 1:0,
          })
        });
  
        const data = await response.json();
  
        if (data.success) {
          await getdevicelist();
          await getdevicelist_human();
          setCurrentPage(1);
          handleUpdateClose();
          alert('수정 성공')
        } else {
          console.log(data.message);
        }
      } catch (error) {
          console.error('Error:', error);
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
    setFormData({ ...formData, Latitude1: event.target.value });
  };
  const handleLatitude2Change = (event) => {
    setFormData({ ...formData, Latitude2: event.target.value });
  };
  const handlelongitude1Change = (event) => {
    setFormData({ ...formData, longitude1: event.target.value });
  };
  const handlelongitude2Change = (event) => {
    setFormData({ ...formData, longitude2: event.target.value });
  };
  
  //ADD모달
  const handleClose = () => setAddModal(false);
  const handleShow = () => setAddModal(true);
  const handleSave = async () => {
    if (
      document.getElementById("ip1").value === "" ||
      document.getElementById("ip2").value === "" ||
      document.getElementById("ip3").value === "" ||
      document.getElementById("ip4").value === "" ||
      document.getElementById("Latitude1").value === "" ||
      document.getElementById("Latitude2").value === "" ||
      document.getElementById("longitude1").value === "" ||
      document.getElementById("longitude2").value === ""
    ) {
      alert("입력 필드를 모두 채워주세요.");
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

      const new_Location =
        document.getElementById("Latitude1").value + "." +
        document.getElementById("Latitude2").value +
        "-" +
        document.getElementById("longitude1").value + "." +
        document.getElementById("longitude2").value;

      try {
        const response = await fetch('/api/addDevice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              Device_num: new_device_num,
              IP: new_ip,
              Location : new_Location,
              Active: selectedValue==='On'? 1:0,
          })
        });
  
        const data = await response.json();
  
        if (data.success) {
          await getdevicelist();
          await getdevicelist_human();
          setCurrentPage(1);
          handleClose();
          alert('추가 성공')
        } else {
          console.log(data.message);
        }
      } catch (error) {
          console.error('Error:', error);
      }
    }
  };

  //모달 셀렉트 박스
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
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
    const inputValue = inputElement.value;

    if (!inputValue) {
      setData(devices.slice(0, pageSize));
      return;
    }

    const searchData = devices.filter((item) => item.IP.includes(inputValue));

    setData(searchData.slice(0, pageSize));
  };

  return (
    <div>
      <h2>그늘막 현황</h2>

      {/* 검색 */}
      <div className={styles.search}>
        <InputGroup as={Col}>
          <Form.Control
            id="searchInput"
            placeholder="Search IP"
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
              <td>{item.address_ip}</td>
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
                    <DropdownItem onClick={() => handleShowUpdate(item)}>Update</DropdownItem>
                    <DropdownItem onClick={() => handleDelete(item.device_num)}>Delete</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      

      {/* 추가 버튼, 모달*/}
      <div className={styles.add_container}>
        <Button variant="dark" onClick={() => handleShow()}>
          Add
        </Button>

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
                <div style={{ width: "100px", marginRight: "50px"}}>Device Num</div>
                <Row>
                  <Col style={{ padding: "5px" }}>
                    <Form.Control type="text" placeholder="xxxx" id="device_num" />
                  </Col>
                </Row>
              </div><hr/>

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
                <div style={{ marginRight: "37px" }}>
                  Latitude
                </div>
                <Row>
                  <Col style={{ padding: "5px" }}>
                    <Form.Control type="text" placeholder="xx" id="Latitude1" />
                  </Col>
                  <Col style={{ padding: "5px" }}>
                    <Form.Control type="text" placeholder="xxxxxx" id="Latitude2" />
                  </Col>
                </Row>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ marginRight: "29px" }}>
                  longitude
                </div>
                <Row>
                  <Col style={{ padding: "5px" }}>
                    <Form.Control type="text" placeholder="xx"id="longitude1" />
                  </Col>
                  <Col style={{ padding: "5px" }}>
                    <Form.Control type="text" placeholder="xxxxxx" id="longitude2" />
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
                <div style={{ width: "100px", marginRight: "-5px" }}>
                  Active
                </div>
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
                <div style={{ width: "100px", marginRight: "50px"}}>Device Num</div>
                <Row>
                  <Col style={{ padding: "5px" }}>
                    <Form.Control type="text" value={formData.new_device_num}  onChange={handle_new_device_numChange}id="device_num" />
                  </Col>
                </Row>
              </div><hr/>

              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "100px", marginRight: "50px" }}>IP</div>
                <Row>
                  <Col style={{ padding: "5px" }}>
                    <Form.Control type="text" value={formData.ip1} onChange={handleIP1Change} id="ip1" />
                  </Col>
                  <Col style={{ padding: "5px" }}>
                    <Form.Control type="text" value={formData.ip2}onChange={handleIP2Change} id="ip2" />
                  </Col>
                  <Col style={{ padding: "5px" }}>
                    <Form.Control type="text" value={formData.ip3} onChange={handleIP3Change}id="ip3" />
                  </Col>
                  <Col style={{ padding: "5px" }}>
                    <Form.Control type="text" value={formData.ip4} onChange={handleIP4Change}id="ip4" />
                  </Col>
                </Row>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ marginRight: "37px" }}>
                  Latitude
                </div>
                <Row>
                  <Col style={{ padding: "5px" }}>
                    <Form.Control type="text" value={formData.Latitude1} onChange={handleLatitude1Change} id="Latitude1" />
                  </Col>
                  <Col style={{ padding: "5px" }}>
                    <Form.Control type="text" value={formData.Latitude2} onChange={handleLatitude2Change} id="Latitude2" />
                  </Col>
                </Row>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ marginRight: "29px" }}>
                  longitude
                </div>
                <Row>
                  <Col style={{ padding: "5px" }}>
                    <Form.Control type="text" value={formData.longitude1} onChange={handlelongitude1Change} id="longitude1" />
                  </Col>
                  <Col style={{ padding: "5px" }}>
                    <Form.Control type="text" value={formData.longitude2} onChange={handlelongitude2Change} id="longitude2" />
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
                <div style={{ width: "100px", marginRight: "-5px" }}>
                  Active
                </div>
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
      </div>

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
