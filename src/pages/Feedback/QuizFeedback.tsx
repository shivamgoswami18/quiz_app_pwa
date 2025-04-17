import { quizFeedbackListApi } from "Api/Feedback";
import TableContainer from "Components/Base/BaseTable";
import {
  checkStatusCodeSuccess,
  commonLabel,
  tooltipContainer,
} from "Components/constants/common";
import {
  FeedbackHeader,
  FeedbackKey,
  FeedbackLabel,
} from "Components/constants/Feedback";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import moment from "moment";

const QuizFeedback = () => {
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [columnName, setColumnName] = useState("_id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageSize, setCustomPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const { quizId } = useParams();
  const [quizFeedbackList, setQuizFeedbackList] = useState<Array<any>>([]);
  const [quizFeedbackSearchList, setQuizFeedbackSearchList] = useState<
    Array<any>
  >([]);
  const location = useLocation();
  const quiName = location.state?.quiName;

  const fetchQuizFeedbackList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      limit: customPageSize,
    };
    quizFeedbackListApi(String(quizId), payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setQuizFeedbackList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
          if (searchValue) {
            fetchSearchQuizFeedbackList();
          }
        } else {
          setQuizFeedbackList([]);
        }
      })
      .catch((error) => {
        setQuizFeedbackList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  const fetchSearchQuizFeedbackList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      search: searchValue,
      limit: customPageSize,
    };
    quizFeedbackListApi(String(quizId), payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setQuizFeedbackSearchList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
        } else {
          setQuizFeedbackSearchList([]);
        }
      })
      .catch((error) => {
        setQuizFeedbackSearchList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  useEffect(() => {
    if (searchValue) {
      fetchSearchQuizFeedbackList();
    } else {
      fetchQuizFeedbackList();
    }
  }, [currentPage, customPageSize, sortOrder, columnName, searchValue]);

  const quizFeedbackColumns = useMemo(
    () => [
      {
        header: FeedbackHeader.Name,
        accessorKey: FeedbackKey.Name,
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        header: FeedbackHeader.Rating,
        accessorKey: FeedbackKey.Rating,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          const rating = cell?.row?.original?.[FeedbackKey.Rating];
          return (
            <div>
              {Array.from({ length: Math.ceil(rating) }, (_, index) => {
                if (index < Math.floor(rating)) {
                  return (
                    <i key={index} className="mdi mdi-star text-warning"></i>
                  );
                } else {
                  return (
                    <i
                      key={index}
                      className="mdi mdi-star-half text-warning"
                    ></i>
                  );
                }
              })}
            </div>
          );
        },
      },
      {
        header: FeedbackHeader.Remark,
        accessorKey: FeedbackKey.Remark,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          const row = cell?.row?.original;
          return <span>{tooltipContainer(row?.remarks, 30)}</span>;
        },
      },
      {
        header: FeedbackHeader.Date,
        accessorKey: FeedbackKey.Date,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          const row = cell?.row?.original;
          return (
            <span>
              {tooltipContainer(
                moment(row?.createdAt).format(FeedbackLabel.UserFeedbackDate),
                25
              )}
            </span>
          );
        },
      },
    ],
    []
  );

  const handleSearchValueChange = (value: any) => {
    if (value !== searchValue) {
      setCurrentPage(1);
      setSearchValue(value);
    }
  };

  const handleFetchSorting = (page: any, id: string, order: string) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };

  const handleFetchData = (page: any) => {
    setCurrentPage(page);
  };

  document.title = FeedbackLabel.FeedbackPageTitle;
  return (
    <div className="page-content pt-5 mt-4">
      <Row className="d-flex my-3 justify-content-between align-items-center overflow-x-hidden">
        <Col md={6}>
          <h5 className="my-0">{`${quiName} ${FeedbackLabel.QuizFeedback}`}</h5>
        </Col>
        <Col
          md={6}
          className="mt-2 mt-md-0 d-flex justify-content-start mx-2 justify-content-md-end mx-md-0"
        >
          <span className="d-flex align-items-center">
            <a className="text-dark" href="/feedback">
              {FeedbackLabel.Feedback}
            </a>
            <i className="mdi mdi-chevron-right text-top"></i>
            {quiName} {FeedbackLabel.QuizFeedback}
          </span>
        </Col>
      </Row>
      <div className="card p-2">
        <TableContainer
          customPageSize={customPageSize}
          setCustomPageSize={setCustomPageSize}
          isGlobalFilter={true}
          columns={quizFeedbackColumns}
          data={searchValue ? quizFeedbackSearchList : quizFeedbackList || []}
          tableClass="table bg-white"
          manualPagination={true}
          manualFiltering={true}
          tableLoader={tableLoader}
          hasManualPagination={true}
          SearchPlaceholder={commonLabel.Search}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onSearch={handleSearchValueChange}
          totalNumberOfRows={totalNumberOfRows}
          fetchData={handleFetchData}
          fetchSortingData={handleFetchSorting}
        />
      </div>
    </div>
  );
};

export default QuizFeedback;
