import { useEffect, useMemo, useState } from "react";
import TableContainer from "Components/Base/BaseTable";
import { UserHeader, UserKey, UserLabel } from "Components/constants/User";
import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
  notFound,
} from "Components/constants/common";
import { useNavigate } from "react-router-dom";
import { editUserStatusApi, userListApi } from "Api/User";
import { Col, Row } from "reactstrap";
import DeleteModal from "Components/Base/DeleteModal";
import { toast } from "react-toastify";
import BaseButton from "Components/Base/BaseButton";

const User = () => {
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [columnName, setColumnName] = useState("_id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageSize, setCustomPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const navigate = useNavigate();
  const [userList, setUserList] = useState<Array<any>>([]);
  const [userSearchList, setUserSearchList] = useState<Array<any>>([]);
  const [modalType, setModalType] = useState<"editStatus" | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [btnLoader, setBtnLoader] = useState<boolean>(false);

  const fetchUserList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      limit: customPageSize,
    };
    userListApi(payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setUserList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
          if (searchValue) {
            fetchSearchUserList();
          }
        } else {
          setUserList([]);
        }
      })
      .catch((error) => {
        setUserList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  const fetchSearchUserList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      search: searchValue,
      limit: customPageSize,
    };
    userListApi(payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setUserSearchList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
        } else {
          setUserSearchList([]);
        }
      })
      .catch((error) => {
        setUserSearchList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  useEffect(() => {
    if (searchValue) {
      fetchSearchUserList();
    } else {
      fetchUserList();
    }
  }, [currentPage, customPageSize, sortOrder, columnName, searchValue]);

  const handleOpenModal = (type: "editStatus", id?: string | null) => {
    setModalType(type);
    if (id) setUserId(id);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setUserId(null);
  };

  const handleStatusSubmit = () => {
    if (userId !== null) {
      setBtnLoader(true);
      editUserStatusApi(userId)
        .then((res: any) => {
          const message = res?.message;
          if (checkStatusCodeSuccess(res?.statusCode)) {
            toast.success(message);
            handleCloseModal();
            if (searchValue) {
              fetchSearchUserList();
            } else {
              fetchUserList();
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

  const handleViewUser = (id: string) => {
    navigate(`/user/view/${id}`);
  };

  const userColumns = useMemo(
    () => [
      {
        header: UserHeader.UserName,
        accessorKey: UserKey.UserName,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => (
          <span>{cell?.row?.original?.user_name ?? notFound.nullData}</span>
        ),
      },
      {
        header: UserHeader.TotalQuizzesPlayed,
        accessorKey: UserKey.TotalQuizzesPlayed,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => (
          <span>
            {cell?.row?.original?.played_quizzes ?? notFound.nullData}
          </span>
        ),
      },
      {
        header: UserHeader.TotalPoints,
        accessorKey: UserKey.TotalPoints,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => (
          <span>{cell?.row?.original?.total_point ?? notFound.nullData}</span>
        ),
      },
      {
        header: UserHeader.Status,
        accessorKey: UserKey.Status,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          const row = cell.row.original;
          return (
            <div className="d-flex align-items-center">
              {row.is_active === true ? (
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
                onClick={() =>
                  handleOpenModal("editStatus", cell?.row?.original?._id)
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
                onClick={() => handleViewUser(cell?.row?.original?._id)}
                startIcon={
                  <i className="mdi mdi-eye-outline fs-4 text-success cursor-pointer" />
                }
              />
              <span className="tooltip-text">{commonLabel.View}</span>
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

  document.title = UserLabel.UserPageTitle;
  return (
    <>
      <div className="page-content pt-5 mt-4">
        <Row className="my-3">
          <Col>
            <h5 className="my-0">{UserLabel.Users}</h5>
          </Col>
        </Row>
        <div className="card p-2">
          <TableContainer
            customPageSize={customPageSize}
            setCustomPageSize={setCustomPageSize}
            isGlobalFilter={true}
            columns={userColumns}
            data={searchValue ? userSearchList : userList || []}
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
        open={modalType === "editStatus"}
        toggle={handleCloseModal}
        title={commonLabel.Status}
        submit={() => handleStatusSubmit()}
        closeLabel={commonLabel.Cancel}
        submitLabel={commonLabel.Update}
        closeLabelColor="danger"
        submitLabelColor="info"
        loader={btnLoader}
      >
        <p className="mb-0">
          {commonLabel.Are_You_Sure_You_Want_To_Update_The_Status}
        </p>
      </DeleteModal>
    </>
  );
};

export default User;
