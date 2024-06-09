import React, { useEffect, useState } from "react";
import { Table, Pagination, PaginationItem, PaginationLink, Button,Card,CardBody,CardText,CardTitle,CardSubtitle  } from "reactstrap";
import { Buffer } from 'buffer';
import Modal from 'react-modal';
import styles from "./ErrorTable.module.css";

function ErrorTable({ err_data }) {
  const [currentPage, setCurrentPage] = useState(1);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [data, setData] = useState([
    { device_num: "Error", current_time: "Error" ,error_content: "데이터가 없거나 등록된 IP가 없습니다"},
  ]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null)

  const pageSize = 5;
  // 현재 페이지의 데이터 계산
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex)
  // 페이지 번호 클릭 핸들러
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };
  const view_Image = (index) => {
    
    if(data[index].current_image.type === "Buffer"){
      
      const base64Image = Buffer.from(data[index].current_image).toString('base64');
      const imageBase64 = `data:image/jpeg;base64,${base64Image}`;
    // const decodedData = atob(base64Image); 라즈베리파이에서 base64로 인코딩하고 blob에 저장했을 때 사용
    // console.log(decodedData)
      setCurrentImage(imageBase64);
      
    }
    else
    {
      const imageBase64 = `data:image/jpeg;base64,${data[index].current_image}`;
      setCurrentImage(imageBase64);
    }
    setModalIsOpen(true);
    setCurrentImageIndex(index)
    
  }
  const closeModal = () => {
    setModalIsOpen(false);
  }
  const saveImage = () => {
      const base64ToBlob = (base64, type) => {
        const binary = atob(base64.split(',')[1]);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type });
      };

      const blob = base64ToBlob(currentImage, 'image/jpeg');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data[currentImageIndex].current_time}_crash.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
  }
 
  useEffect(() => {
    if(err_data!==null &&err_data.length !==0 ){
      console.log(err_data)
      const reversedErrData = [...err_data].reverse();
      setData(reversedErrData);
    }
  },[err_data])
  return (
    <div>
      <h2>Recent Error</h2>
      <Table>
        <thead>
          <tr>
            <th>Device_Num</th>
            <th>DATE_TIME</th>
            <th>Log</th>
            <th>이미지 보기</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={index}>
              <td>{item.device_num}</td>
              <td>{item.current_time}</td>
              <td>{item.error_content}</td>
              <td>{item.current_image ?<Button onClick={() => view_Image(index)} /> : null}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink
            previous
            onClick={() => handlePageClick(currentPage - 1)}
          />
        </PaginationItem>
        {[...Array(Math.ceil(data.length / pageSize)).keys()].map((page) => (
          <PaginationItem active={page + 1 === currentPage} key={page}>
            <PaginationLink onClick={() => handlePageClick(page + 1)}>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem
          disabled={currentPage === Math.ceil(data.length / pageSize)}
        >
          <PaginationLink
            next
            onClick={() => handlePageClick(currentPage + 1)}
          />
        </PaginationItem>
      </Pagination>
      
    <Modal className={styles.content} overlayClassName={styles.overlay} ariaHideApp={false} isOpen={modalIsOpen} onRequestClose={closeModal}>
      <Card
          style={{
            width: '100%'
      }}>
        <CardBody>
          <CardTitle className = {styles.textCenter} tag="h5">
            {`device_num : ${currentImageIndex!==null ? data[currentImageIndex].device_num : null} -- Error` }
          </CardTitle>
          <CardSubtitle
            className={`mb-2 text-muted ${styles.textCenter}`}
            tag="h6"
          >
            {currentImageIndex!==null ? (data[currentImageIndex].crash ===1 ? "충돌 발생" : null) : null}
          </CardSubtitle>
        </CardBody>
        <img
          alt="Card cap"
          src={`${currentImage}`}
          width="100%"
        />
        <CardBody>
          <CardText className = {styles.textCenter}>
            {`${currentImageIndex!==null ? data[currentImageIndex].current_time : null}경 충돌 발생` }
          </CardText>
          <div className={styles.buttons}>
          <Button onClick={closeModal}>Close</Button>
          <Button onClick={saveImage}>Download</Button>
        </div> 
        </CardBody>

      </Card>

    </Modal>

    </div>
  );
}

export default ErrorTable;
