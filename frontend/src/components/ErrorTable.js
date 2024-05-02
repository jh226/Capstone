import React, { useState } from "react";
import { Table, Pagination, PaginationItem, PaginationLink } from "reactstrap";

function ErrorTable() {
  const data = [
    { IP: "xxx.xxx.xxx.xxx", DATE: "24.04.19/00:00" },
    { IP: "xxx.xxx.xxx.xxx", DATE: "24.04.19/00:00" },
    { IP: "xxx.xxx.xxx.xxx", DATE: "24.04.19/00:00" },
    { IP: "xxx.xxx.xxx.xxx", DATE: "24.04.19/00:00" },
    { IP: "xxx.xxx.xxx.xxx", DATE: "24.04.19/00:00" },
    { IP: "xxx.xxx.xxx.xxx", DATE: "24.04.19/00:00" },
    { IP: "xxx.xxx.xxx.xxx", DATE: "24.04.19/00:00" },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  // 현재 페이지의 데이터 계산
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  // 페이지 번호 클릭 핸들러
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h2>Recent Error</h2>
      <Table>
        <thead>
          <tr>
            <th>IP</th>
            <th>DATE</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={index}>
              <td>{item.IP}</td>
              <td>{item.DATE}</td>
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
