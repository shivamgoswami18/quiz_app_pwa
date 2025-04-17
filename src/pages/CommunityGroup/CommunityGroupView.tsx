import {
  removeUserFromCommunityApi,
  userListInCommunityApi,
} from "Api/Community";
import BaseButton from "Components/Base/BaseButton";
import TableContainer from "Components/Base/BaseTable";
import DeleteModal from "Components/Base/DeleteModal";
import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
} from "Components/constants/common";
import {
  CommunityUIConstants,
  CommunityUserHeader,
  CommunityUserKey,
} from "Components/constants/CommunityGroup";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";

const CommunityGroupView = () => {
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [columnName, setColumnName] = useState("_id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageSize, setCustomPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [tableLoader, setTableLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState<boolean>(false);
  const [userList, setUserList] = useState<Array<any>>([]);
  const [userSearchList, setUserSearchList] = useState<Array<any>>([]);
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const location = useLocation();
  const communityGroupName = location.state?.communityGroupName;

  const fetchUserList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      limit: customPageSize,
    };
    userListInCommunityApi(String(communityId), payload)
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
    userListInCommunityApi(String(communityId), payload)
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

  const handleViewUsers = (id: string) => {
    navigate(`/user/view/${id}`);
  };

  const handleOpenModal = (id: string | null) => {
    setUserId(id);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setUserId(null);
    setShowDeleteModal(false);
  };

  const handleRemoveUser = () => {
    if (userId) {
      const payload = {
        user_id: String(userId),
      };
      handleSubmit(removeUserFromCommunityApi(String(communityId), payload));
    }
  };

  const handleSubmit = (api: any) => {
    setBtnLoader(true);
    api
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          toast.success(res?.message);
          fetchUserList();
          handleCloseModal();
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err: any) => {
        errorHandler(err);
      })
      .finally(() => {
        setBtnLoader(false);
      });
  };

  const communityCoulmns = useMemo(
    () => [
      {
        header: CommunityUserHeader.Name,
        accessorKey: CommunityUserKey.Name,
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        header: CommunityUserHeader.Email,
        accessorKey: CommunityUserKey.Email,
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        header: commonLabel.Action,
        accessorKey: commonLabel.Action,
        cell: (cell: any) => (
          <div className="d-flex justify-content-start enable-action flex-wrap gap-2 icon">
            <span className="tooltip-container">
              <BaseButton
                className="icon-button"
                onClick={() => handleOpenModal(cell?.row?.original?._id)}
                startIcon={
                  <i className="mdi mdi-delete fs-4 text-danger cursor-pointer" />
                }
              />
              <span className="tooltip-text">{commonLabel.Remove}</span>
            </span>

            <span className="tooltip-container">
              <BaseButton
                className="icon-button"
                onClick={() => handleViewUsers(cell?.row?.original?._id)}
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

  return (
    <>
      <div className="page-content pt-5 mt-4">
        <Row className="d-flex my-3 justify-content-between align-items-center overflow-x-hidden">
          <Col md={6}>
            <h5 className="my-0">
              {communityGroupName}
              {CommunityUIConstants.UserListHeading}
            </h5>
          </Col>
          <Col
            md={6}
            className="mt-2 mt-md-0 d-flex justify-content-start mx-2 justify-content-md-end mx-md-0"
          >
            <span className="d-flex align-items-center">
              <a className="text-dark" href="/community-group">
                {CommunityUIConstants.CommunityGroup}
              </a>
              <i className="mdi mdi-chevron-right text-top"></i>
              {CommunityUIConstants.UserListNavigation}
            </span>
          </Col>
        </Row>
        <div className="card p-2">
          <TableContainer
            customPageSize={customPageSize}
            setCustomPageSize={setCustomPageSize}
            isGlobalFilter={true}
            columns={communityCoulmns}
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
        open={showDeleteModal}
        toggle={handleCloseModal}
        title={commonLabel.Remove}
        submit={handleRemoveUser}
        closeLabel={commonLabel.Cancel}
        submitLabel={commonLabel.Remove}
        closeLabelColor="danger"
        submitLabelColor="info"
        loader={btnLoader}
      >
        <p className="mb-0">{CommunityUIConstants.DoYouWantToRemoveUser}</p>
      </DeleteModal>
    </>
  );
};

export default CommunityGroupView;
