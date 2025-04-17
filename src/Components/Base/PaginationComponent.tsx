import React from "react";
import { Link } from "react-router-dom";
import { Row } from "reactstrap";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  startIndex: number;
  endIndex: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  setCurrentPage: (page: number) => void;
  fetchData: (page: number) => void;
  manualPagination?: boolean;
  getCanPreviousPage?: () => boolean;
  getCanNextPage?: () => boolean;
  previousPage?: () => void;
  nextPage?: () => void;
  data?: any[];
  renderPaginationItems?: () => JSX.Element[];
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  startIndex,
  endIndex,
  handlePreviousPage,
  handleNextPage,
  setCurrentPage,
  fetchData,
  manualPagination,
  getCanPreviousPage,
  getCanNextPage,
  previousPage,
  nextPage,
  data,
  renderPaginationItems,
}) => {
  const renderPageNumbers = () => {
    const MAX_PAGES_DISPLAYED = pageSize;
    const totalPages11 = totalPages;
    const currentPage11 = currentPage;
    let startPage = Math.max(1, currentPage11 - 2);
    let endPage = Math.min(totalPages11, startPage + MAX_PAGES_DISPLAYED - 1);
    if (endPage - startPage + 1 < MAX_PAGES_DISPLAYED) {
      startPage = Math.max(1, endPage - MAX_PAGES_DISPLAYED + 1);
    }
    const pageNumbers = [];
    if (startPage > 1) {
      pageNumbers.push(
        <li key="ellipsisStart" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={currentPage11 === i ? "page-item active" : "page-item"}
        >
          <Link
            className="page-link page-success"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(i);
              fetchData(i);
            }}
            to={""}
          >
            {i}
          </Link>
        </li>
      );
    }
    if (endPage < totalPages11) {
      pageNumbers.push(
        <li key="ellipsisEnd" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <>
      {manualPagination ? (
        <Row className="align-items-center mt-2 g-3 text-center text-sm-start pagenumber">
          <div className="col-sm">
            <div className="text-muted">
              Showing{" "}
              <span className="fw-semibold ms-1">
                {startIndex} to {endIndex}
              </span>{" "}
              of <span className="fw-semibold">{totalRecords}</span> Results
            </div>
          </div>
          <div className="col-sm-auto">
            <ul className="pagination pagination-separated pagination-sm justify-content-center align-items-center justify-content-sm-start mb-0">
              <li
                className={
                  currentPage === 1 ? "page-item disabled" : "page-item"
                }
              >
                <Link
                  className="page-link p-0 cursor-pointer"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePreviousPage();
                  }}
                >
                  <i className="mdi mdi-chevron-left fs-4 m-r-5"></i>
                </Link>
              </li>
              {renderPageNumbers()}
              <li
                className={
                  currentPage === totalPages
                    ? "page-item disabled"
                    : "page-item"
                }
              >
                <Link
                  className="page-link p-0 cursor-pointer"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNextPage();
                  }}
                >
                  <i className="mdi mdi-chevron-right fs-4 m-r-5"></i>
                </Link>
              </li>
            </ul>
          </div>
        </Row>
      ) : (
        <Row className="align-items-center mt-2 g-3 text-center text-sm-start pagenumber">
          <div className="col-sm">
            <div className="text-muted">
              Showing <span className="fw-semibold ms-1">{pageSize}</span> of{" "}
              <span className="fw-semibold">{data?.length}</span> Results
            </div>
          </div>
          <div className="col-sm-auto">
            <ul className="pagination pagination-separated pagination-xs justify-content-center justify-content-sm-start mb-0">
              <li
                className={
                  !getCanPreviousPage?.() ? "page-item disabled" : "page-item"
                }
              >
                <Link
                  className="page-link"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    previousPage?.();
                  }}
                >
                  <i className="fa fa-chevron-left m-r-5"></i>
                </Link>
              </li>
              {renderPaginationItems?.()}
              <li
                className={
                  !getCanNextPage?.() ? "page-item disabled" : "page-item"
                }
              >
                <Link
                  className="page-link"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    nextPage?.();
                  }}
                >
                  <i className="fa fa-chevron-right m-r-5"></i>
                </Link>
              </li>
            </ul>
          </div>
        </Row>
      )}
    </>
  );
};

export default PaginationComponent;
