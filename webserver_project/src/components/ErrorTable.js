import React, { useState } from "react";
import { Table, Pagination, PaginationItem, PaginationLink } from "reactstrap";

function ErrorTable({data}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // 현재 페이지의 데이터 계산
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = Array.isArray(data) ? data.slice(startIndex, endIndex) : [];


  // 페이지 번호 클릭 핸들러
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  //에러테이블 날짜 형식 변환
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).replace('T', ' ')
  };

  return (
    <div>
      <h2>Recent Error</h2>
      <Table>
        <thead>
          <tr>
            <th>IP</th>
            <th>ErrorContent</th>
            <th>DATE</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={index}>
              <td>{item.device_num}</td>
              <td>{item.error_content}</td>
              <td>{formatDateTime(item.current_time)}</td>
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
    </div>
  );
}

export default ErrorTable;
