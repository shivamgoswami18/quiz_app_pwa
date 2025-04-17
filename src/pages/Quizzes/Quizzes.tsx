import {
  approveQuizApi,
  editQuizStatusApi,
  quizListApi,
  rejectQuizApi,
} from "Api/Quiz";
import BaseButton from "Components/Base/BaseButton";
import BaseModal from "Components/Base/BaseModal";
import TableContainer from "Components/Base/BaseTable";
import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
} from "Components/constants/common";
import {
  QuizKey,
  QuizzesLabel,
  QuizzesUIConstants,
  QuizHeader,
} from "Components/constants/Quizzes";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";

const Quizzes = () => {
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [columnName, setColumnName] = useState("_id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageSize, setCustomPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [btnLoader, setBtnLoader] = useState<boolean>(false);
  const [quizzesList, setQuizzesList] = useState<Array<any>>([]);
  const [quizzesSearchList, setQuizzesSearchList] = useState<Array<any>>([]);
  const [quizId, setQuizId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<
    "editStatus" | "approve" | "reject" | null
  >(null);

  const fetchQuizList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      limit: customPageSize,
    };
    quizListApi(commonLabel.False, payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setQuizzesList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
          if (searchValue) {
            fetchSearchQuizList();
          }
        } else {
          setQuizzesList([]);
        }
      })
      .catch((error) => {
        setQuizzesList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  const fetchSearchQuizList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      search: searchValue,
      limit: customPageSize,
    };
    quizListApi(commonLabel.False, payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setQuizzesSearchList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
        } else {
          setQuizzesSearchList([]);
        }
      })
      .catch((error) => {
        setQuizzesSearchList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  useEffect(() => {
    if (searchValue) {
      fetchSearchQuizList();
    } else {
      fetchQuizList();
    }
  }, [currentPage, customPageSize, sortOrder, columnName, searchValue]);

  const handleOpenModal = (
    type: "editStatus" | "approve" | "reject",
    id: string | null
  ) => {
    setModalType(type);
    setQuizId(id);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setQuizId(null);
  };

  const handleSubmitModal = () => {
    if (!quizId) return;
    setBtnLoader(true);
    const payload = {
      status: "Approve",
    };
    if (modalType === "reject") {
      payload.status = "Reject";
    }
    let apiCall;
    if (modalType === "editStatus") {
      apiCall = editQuizStatusApi(quizId);
    } else if (modalType === "approve") {
      apiCall = approveQuizApi(quizId, payload);
    } else if (modalType === "reject") {
      apiCall = rejectQuizApi(quizId, payload);
    }

    if (apiCall) {
      apiCall
        .then((res) => {
          const message = res?.message;
          if (checkStatusCodeSuccess(res?.statusCode)) {
            toast.success(message);
            handleCloseModal();
            if (searchValue) {
              fetchSearchQuizList();
            } else {
              fetchQuizList();
            }
          } else {
            toast.error(message);
          }
        })
        .catch((err) => {
          errorHandler(err);
        })
        .finally(() => {
          setBtnLoader(false);
        });
    }
  };

  const handleAddQuiz = () => {
    navigate("/quizzes/add");
  };

  const handleEditQuiz = (id: string | null) => {
    setQuizId(id);
    navigate(`/quizzes/edit/${id}`);
  };

  const handleViewQuiz = (
    id: string | null,
    title: string,
    domainId: string | null
  ) => {
    navigate(`/quizzes/view/${id}`, {
      state: {
        title: title,
        domainId: domainId,
      },
    });
  };

  const quizColumns = useMemo(
    () => [
      {
        header: QuizHeader.Title,
        accessorKey: QuizKey.Title,
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        header: QuizHeader.Domain,
        accessorKey: QuizKey.Domain,
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        header: QuizHeader.Type,
        accessorKey: QuizKey.Type,
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        header: QuizHeader.QuizQuestion,
        accessorKey: QuizKey.QuizQuestion,
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        header: QuizHeader.BonusQuizQuestion,
        accessorKey: QuizKey.BonusQuizQuestion,
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        header: QuizHeader.VisibilityStatus,
        accessorKey: QuizKey.VisibilityStatus,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          return (
            <div className="d-flex justify-content-start gap-2 icon">
              {(() => {
                const original = cell?.row?.original;
                if (
                  original?.type === commonLabel.Private &&
                  original?.privateQuizStatus === commonLabel.Reject
                ) {
                  return (
                    <span className="badge bg-danger">
                      {commonLabel.Reject}
                    </span>
                  );
                }
                if (
                  original?.type === commonLabel.Private &&
                  original?.privateQuizStatus === commonLabel.Pending
                ) {
                  return (
                    <span className="badge pendingStatusColor">
                      {commonLabel.Pending}
                    </span>
                  );
                }
                if (original?.status === commonLabel.Publish) {
                  return (
                    <span className="badge bg-success">
                      {commonLabel.Publish}
                    </span>
                  );
                }
                if (original?.status === commonLabel.Draft) {
                  return (
                    <span className="badge bg-warning">
                      {commonLabel.Draft}
                    </span>
                  );
                }
                return (
                  <span className="badge bg-success">
                    {commonLabel.Complete}
                  </span>
                );
              })()}
            </div>
          );
        },
      },
      {
        header: commonLabel.Action,
        accessorKey: commonLabel.Action,
        cell: (cell: any) => {
          const quiz = cell.row.original;
          if (quiz?.privateQuizStatus !== "Reject") {
            const isPrivatePending =
              quiz?.type === "Private" && quiz?.privateQuizStatus === "Pending";

            return (
              <div className="d-flex justify-content-start enable-action gap-2 icon">
                {isPrivatePending && (
                  <>
                    <span className="tooltip-container">
                      <BaseButton
                        className="icon-button"
                        onClick={() => handleOpenModal("approve", quiz?._id)}
                        startIcon={
                          <i className="mdi mdi-check fs-4 text-success cursor-pointer" />
                        }
                      />
                      <span className="tooltip-text">
                        {commonLabel.Approve}
                      </span>
                    </span>

                    <span className="tooltip-container">
                      <BaseButton
                        className="icon-button"
                        onClick={() => handleOpenModal("reject", quiz?._id)}
                        startIcon={
                          <i className="mdi mdi-close fs-4 text-danger cursor-pointer" />
                        }
                      />
                      <span className="tooltip-text">{commonLabel.Reject}</span>
                    </span>
                  </>
                )}

                {!isPrivatePending && quiz?.status === commonLabel.Draft && (
                  <>
                    <span className="tooltip-container">
                      <BaseButton
                        className="icon-button"
                        onClick={() => handleOpenModal("editStatus", quiz?._id)}
                        startIcon={
                          <i className="mdi mdi-autorenew fs-4 text-dark cursor-pointer" />
                        }
                      />
                      <span className="tooltip-text">{commonLabel.Status}</span>
                    </span>

                    <span className="tooltip-container">
                      <BaseButton
                        className="icon-button"
                        onClick={() => handleEditQuiz(quiz?._id)}
                        startIcon={
                          <i className="mdi mdi-pencil fs-4 text-info cursor-pointer" />
                        }
                      />
                      <span className="tooltip-text">{commonLabel.Edit}</span>
                    </span>
                  </>
                )}

                <span className="tooltip-container">
                  <BaseButton
                    className="icon-button"
                    onClick={() =>
                      handleViewQuiz(quiz?._id, quiz?.title, quiz?.domain_id)
                    }
                    startIcon={
                      <i className="mdi mdi-eye-outline fs-4 text-success cursor-pointer" />
                    }
                  />
                  <span className="tooltip-text">{commonLabel.View}</span>
                </span>
              </div>
            );
          } else {
            return (
              <span className="tooltip-container">
                <BaseButton
                  className="icon-button"
                  onClick={() =>
                    handleViewQuiz(quiz?._id, quiz?.title, quiz?.domain_id)
                  }
                  startIcon={
                    <i className="mdi mdi-eye-outline fs-4 text-success cursor-pointer" />
                  }
                />
                <span className="tooltip-text">{commonLabel.View}</span>
              </span>
            );
          }
        },
        enableColumnFilter: false,
        enableSorting: false,
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

  document.title = QuizzesLabel.QuizzesPageTitle;
  return (
    <>
      <div className="page-content pt-5 mt-4">
        <Row className="d-flex my-2 justify-content-between align-items-center">
          <Col>
            <h5 className="my-0">{QuizzesLabel.Quizzes}</h5>
          </Col>
          <Col className="d-flex justify-content-end">
            <BaseButton
              className="btn btn-info"
              onClick={() => handleAddQuiz()}
              children={
                <>
                  <i className="mdi mdi-plus" /> {commonLabel.New}
                </>
              }
              dataTest="button-new"
            />
          </Col>
        </Row>

        <div className="card p-2">
          <TableContainer
            customPageSize={customPageSize}
            setCustomPageSize={setCustomPageSize}
            isGlobalFilter={true}
            columns={quizColumns}
            data={searchValue ? quizzesSearchList : quizzesList || []}
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

      <BaseModal
        open={modalType !== null}
        toggle={handleCloseModal}
        title={(() => {
          if (modalType === "editStatus") return QuizzesLabel.EditStatus;
          if (modalType === "approve") return commonLabel.Approve;
          return commonLabel.Reject;
        })()}
        submit={handleSubmitModal}
        closeLabel={commonLabel.Cancel}
        submitLabel={(() => {
          if (modalType === "approve") return commonLabel.Approve;
          if (modalType === "reject") return commonLabel.Reject;
          return commonLabel.Update;
        })()}
        closeLabelColor="danger"
        submitLabelColor="info"
        loader={btnLoader}
      >
        {modalType === "editStatus" ? (
          <p>
            {QuizzesUIConstants.AreYouSureYouWantTo}{" "}
            {QuizzesUIConstants.PublishThisQuiz}
          </p>
        ) : (
          <p>
            {QuizzesUIConstants.AreYouSureYouWantTo} {modalType}{" "}
            {QuizzesUIConstants.ThisQuiz}
          </p>
        )}
      </BaseModal>
    </>
  );
};

export default Quizzes;
