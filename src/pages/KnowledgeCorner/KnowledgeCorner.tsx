import {
  articleListApi,
  deleteArticleStatusApi,
  editArticleStatusApi,
} from "Api/Knowledge";
import BaseButton from "Components/Base/BaseButton";
import TableContainer from "Components/Base/BaseTable";
import DeleteModal from "Components/Base/DeleteModal";
import {
  KnowledgeHeader,
  KnowledgeKey,
  KnowledgeLabel,
} from "Components/constants/KnowledgeCorner";
import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
} from "Components/constants/common";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";

const KnowledgeCorner = () => {
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [columnName, setColumnName] = useState("_id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageSize, setCustomPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [tableLoader, setTableLoader] = useState(false);
  const navigate = useNavigate();
  const [knowledgeList, setKnowledgeList] = useState<Array<any>>([]);
  const [knowledgeSearchList, setKnowledgeSearchList] = useState<Array<any>>(
    []
  );
  const [articleId, setArticleId] = useState<string | null>(null);
  const [btnLoader, setBtnLoader] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"status" | "delete" | null>(null);

  const fetchKnowledgeList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      limit: customPageSize,
    };
    articleListApi(payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setKnowledgeList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
          if (searchValue) {
            fetchSearchKnowledgeList();
          }
        } else {
          setKnowledgeList([]);
        }
      })
      .catch((error) => {
        setKnowledgeList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  const fetchSearchKnowledgeList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      search: searchValue,
      limit: customPageSize,
    };
    articleListApi(payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setKnowledgeSearchList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
        } else {
          setKnowledgeSearchList([]);
        }
      })
      .catch((error) => {
        setKnowledgeSearchList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  const handleSubmit = () => {
    if (articleId !== null) {
      setBtnLoader(true);
      const apiCall =
        modalType === "status"
          ? editArticleStatusApi(articleId)
          : deleteArticleStatusApi(articleId);
      apiCall
        .then((res: any) => {
          const message = res?.message;
          if (checkStatusCodeSuccess(res?.statusCode)) {
            toast.success(message);
            handleCloseModal();
            if (searchValue) {
              fetchSearchKnowledgeList();
            } else {
              fetchKnowledgeList();
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

  useEffect(() => {
    if (searchValue) {
      fetchSearchKnowledgeList();
    } else {
      fetchKnowledgeList();
    }
  }, [currentPage, customPageSize, sortOrder, columnName, searchValue]);

  const handleAddArticle = () => {
    navigate("/knowledge-corner/add");
  };

  const handleEditArticle = (id: string) => {
    setArticleId(id);
    navigate(`/knowledge-corner/edit/${id}`);
  };

  const handleViewArticle = (id: string) => {
    setArticleId(id);
    navigate(`/knowledge-corner/view/${id}`);
  };

  const handleOpenModal = (type: "status" | "delete", id: string) => {
    setModalType(type);
    setArticleId(id);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setArticleId(null);
  };

  const knowledgeCoulmns = useMemo(
    () => [
      {
        header: KnowledgeHeader.ArticleTitle,
        accessorKey: KnowledgeKey.ArticleTitle,
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        header: KnowledgeHeader.ArticleDomanin,
        accessorKey: KnowledgeKey.ArticleDomanin,
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        header: KnowledgeHeader.ArticleStatus,
        accessorKey: KnowledgeKey.ArticleStatus,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          const row = cell?.row?.original;
          return (
            <div className="d-flex align-items-center">
              {row?.status === "Active" ? (
                <span className="badge bg-success">{commonLabel.Active}</span>
              ) : (
                <span className="badge bg-warning">{commonLabel.Inactive}</span>
              )}
            </div>
          );
        },
      },
      {
        header: commonLabel.Action,
        accessorKey: commonLabel.Action,
        cell: (cell: any) => (
          <div className="d-flex justify-content-start enable-action flex-wrap gap-2 icon">
            <span className="tooltip-container">
              <BaseButton
                className="icon-button"
                onClick={() => handleEditArticle(cell?.row?.original?._id)}
                startIcon={
                  <i className="mdi mdi-pencil fs-4 text-info cursor-pointer" />
                }
              />
              <span className="tooltip-text">{commonLabel.Edit}</span>
            </span>

            <span className="tooltip-container">
              <BaseButton
                className="icon-button"
                onClick={() =>
                  handleOpenModal("status", cell?.row?.original?._id)
                }
                startIcon={
                  <i className="mdi mdi-autorenew fs-4 text-dark cursor-pointer" />
                }
              />
              <span className="tooltip-text">{commonLabel.Status}</span>
            </span>

            <span className="tooltip-container">
              <BaseButton
                className="icon-button"
                onClick={() => handleViewArticle(cell?.row?.original?._id)}
                startIcon={
                  <i className="mdi mdi-eye-outline fs-4 text-success cursor-pointer" />
                }
              />
              <span className="tooltip-text">{commonLabel.View}</span>
            </span>

            <span className="tooltip-container">
              <BaseButton
                className="icon-button"
                onClick={() =>
                  handleOpenModal("delete", cell?.row?.original?._id)
                }
                startIcon={
                  <i className="mdi mdi-delete fs-4 text-danger cursor-pointer" />
                }
              />
              <span className="tooltip-text">{commonLabel.Delete}</span>
            </span>
          </div>
        ),
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

  document.title = KnowledgeLabel.KnowledgePageTitle;
  return (
    <>
      <div className="page-content pt-5 mt-4">
        <Row className="d-flex my-2 justify-content-between align-items-center">
          <Col>
            <h5 className="my-0">{KnowledgeLabel.KnowledgeCorner}</h5>
          </Col>
          <Col className="d-flex justify-content-end">
            <BaseButton
              className="btn btn-info"
              onClick={() => handleAddArticle()}
              dataTest="button-new"
              children={
                <>
                  <i className="mdi mdi-plus" /> {commonLabel.New}
                </>
              }
            />
          </Col>
        </Row>

        <div className="card p-2">
          <TableContainer
            customPageSize={customPageSize}
            setCustomPageSize={setCustomPageSize}
            isGlobalFilter={true}
            columns={knowledgeCoulmns}
            data={searchValue ? knowledgeSearchList : knowledgeList || []}
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

      <DeleteModal
        open={modalType === "status" || modalType === "delete"}
        toggle={handleCloseModal}
        title={
          modalType === "status"
            ? KnowledgeLabel.EditStatus
            : commonLabel.Delete
        }
        submit={() => handleSubmit()}
        closeLabel={commonLabel.Cancel}
        submitLabel={
          modalType === "status" ? commonLabel.Update : commonLabel.Delete
        }
        closeLabelColor="danger"
        submitLabelColor="info"
        loader={btnLoader}
      >
        {modalType === "status" ? (
          <p>{commonLabel.Are_You_Sure_You_Want_To_Update_The_Status}</p>
        ) : (
          <p>{commonLabel.DeleteConfirmation}</p>
        )}
      </DeleteModal>
    </>
  );
};

export default KnowledgeCorner;
