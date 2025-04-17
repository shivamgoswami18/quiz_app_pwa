import React, { useEffect, useMemo, useState } from "react";
import {
  UserPerformanceHeader,
  UserPerformanceKey,
  UserUIConstants,
} from "Components/constants/User";
import {
  listOfUserPerformanceApi,
  listOfUserStatsApi,
  viewUserApi,
} from "Api/User";
import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
  notFound,
} from "Components/constants/common";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import "../../Styles/User.css";
import TableContainer from "Components/Base/BaseTable";
import DefaultUserImage from "../../assets/images/user_default_image.webp";
import BaseButton from "Components/Base/BaseButton";

const UserView = () => {
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [columnName, setColumnName] = useState("_id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageSize, setCustomPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [listOfUserStats, setListOfUserStats] = useState<any>(null);
  const { userId } = useParams();
  const [userImage, setUserImage] = useState("");
  const [userPerformanceList, setUserPerformanceList] = useState<Array<any>>(
    []
  );
  const [userPerformanceSearchList, setUserPerformanceSearchList] = useState<
    Array<any>
  >([]);

  const navigate = useNavigate();
  const goToPreviousPath = () => {
    navigate(-1);
  };

  const fetchUserPerformanceList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      limit: customPageSize,
    };
    listOfUserPerformanceApi(String(userId), payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setUserPerformanceList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
          if (searchValue) {
            fetchSearchUserPerformanceList();
          }
        } else {
          setUserPerformanceList([]);
        }
      })
      .catch((error) => {
        setUserPerformanceList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  const fetchSearchUserPerformanceList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      search: searchValue,
      limit: customPageSize,
    };
    listOfUserPerformanceApi(String(userId), payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setUserPerformanceSearchList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
        } else {
          setUserPerformanceSearchList([]);
        }
      })
      .catch((error) => {
        setUserPerformanceSearchList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  useEffect(() => {
    if (searchValue) {
      fetchSearchUserPerformanceList();
    } else {
      fetchUserPerformanceList();
    }
  }, [currentPage, customPageSize, sortOrder, columnName, searchValue]);

  const fetchUserDetails = (id: string) => {
    setLoader(true);
    viewUserApi(id)
      .then((res: any) => {
        const message = res?.message;
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setUserData(res?.data);
          const fileUrl = `${process.env.REACT_APP_FILE_BASE_URL}${res?.data?.profile_image}`;
          setUserImage(res?.data?.profile_image ? fileUrl : DefaultUserImage);
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((err) => {
        errorHandler(err);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const fetchListOfUserStats = (id: string) => {
    setLoader(true);
    listOfUserStatsApi(id)
      .then((res: any) => {
        const message = res?.message;
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setListOfUserStats(res?.data);
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((err) => {
        errorHandler(err);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
      fetchListOfUserStats(userId);
    }
  }, [userId]);

  const performanceStatisticsColumns = useMemo(
    () => [
      {
        header: UserPerformanceHeader.DomainName,
        accessorKey: UserPerformanceKey.DomainName,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => (
          <span>{cell?.row?.original?.name ?? notFound.nullData}</span>
        ),
      },
      {
        header: UserPerformanceHeader.DomainRank,
        accessorKey: UserPerformanceKey.DomainRank,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => (
          <span>{cell?.row?.original?.rank ?? notFound.nullData}</span>
        ),
      },
      {
        header: UserPerformanceHeader.TotalDomainPoints,
        accessorKey: UserPerformanceKey.TotalDomainPoints,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => (
          <span>{cell?.row?.original?.points ?? notFound.nullData}</span>
        ),
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

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-US");
    return `${formattedDate}`;
  };

  return (
    <div className="page-content pt-5 mt-4">
      <div className="d-flex my-3 justify-content-between align-items-center">
        <h5 className="ms-2 mb-0">{UserUIConstants.ViewUser}</h5>
        <div className="d-flex align-items-center justify-content-center me-4">
          <div>
            <BaseButton
              onClick={goToPreviousPath}
              className="text-dark cursor-pointer navigate-button-style"
              divClass="button-parent-style"
            >
              {UserUIConstants.UserNavigate}
            </BaseButton>
          </div>
          <div>
            <i className="mdi mdi-chevron-right fs-5"></i>
          </div>
          <div>{UserUIConstants.ViewUserNavigate}</div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-info bg-opacity-50  text-black">
          <h5 className="mb-0 text-black text-opacity-75">
            {userData?.name ?? notFound.notAvailable}
          </h5>
        </div>
        <div className="card-body">
          <Row className="align-items-center">
            <Col md={4} className="text-center">
              <img
                src={userImage}
                alt={userData?.name}
                className="img-thumbnail user-image-style"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  (e.target as HTMLImageElement).src = DefaultUserImage;
                }}
              />
              <p className="mt-2 mb-0">
                <strong>
                  <i className="bi bi-person-fill me-2"></i>
                  {UserUIConstants.UserStatus}
                  {UserUIConstants.GemSign}{" "}
                </strong>
                {userData !== null &&
                  (userData?.is_active ? (
                    <span className="badge bg-success">
                      {commonLabel.Active}
                    </span>
                  ) : (
                    <span className="badge bg-warning">
                      {commonLabel.Inactive}
                    </span>
                  ))}
              </p>
            </Col>
            <Col md={8}>
              <Row className="mt-4 mt-md-0">
                <Col sm={6}>
                  <div>
                    <p className="mb-3">
                      <strong>
                        <i className="bi bi-person-fill me-2"></i>
                        {UserUIConstants.UserName}
                        {UserUIConstants.GemSign}
                      </strong>
                      <span className="ms-1">
                        {userData?.user_name ?? notFound.notAvailable}
                      </span>
                    </p>
                    <p className="mb-3">
                      <strong>
                        <i className="bi bi-envelope-fill me-2"></i>
                        {UserUIConstants.UserEmail}
                        {UserUIConstants.GemSign}
                      </strong>
                      <span className="ms-1">
                        {userData?.email ?? notFound.notAvailable}
                      </span>
                    </p>
                    <p className="mb-3">
                      <strong>
                        <i className="bi bi-envelope-fill me-2"></i>
                        {UserUIConstants.UserPhone}
                        {UserUIConstants.GemSign}
                      </strong>
                      <span className="ms-1">
                        {userData?.contact_no ?? notFound.notAvailable}
                      </span>
                    </p>
                    <p className="mb-3">
                      <strong>
                        <i className="bi bi-envelope-fill me-2"></i>
                        {UserUIConstants.UserCountry}
                        {UserUIConstants.GemSign}
                      </strong>
                      <span className="ms-1">
                        {userData?.country_id?.country_name ??
                          notFound.notAvailable}
                      </span>
                    </p>
                    <p className="mb-3">
                      <strong>
                        <i className="bi bi-envelope-fill me-2"></i>
                        {UserUIConstants.UserState}
                        {UserUIConstants.GemSign}
                      </strong>
                      <span className="ms-1">
                        {userData?.state_id?.state_name ??
                          notFound.notAvailable}
                      </span>
                    </p>
                    <p className="mb-3">
                      <strong>
                        <i className="bi bi-calendar-event-fill me-2"></i>
                        {UserUIConstants.UserJoinDate}
                        {UserUIConstants.GemSign}
                      </strong>
                      <span className="ms-1">
                        {userData?.createdAt
                          ? formatDateTime(userData?.createdAt)
                          : notFound.notAvailable}
                      </span>
                    </p>
                  </div>
                </Col>
                <Col sm={6}>
                  <div>
                    <p className="mb-3">
                      <strong>
                        <i className="bi bi-calendar-event-fill me-2"></i>
                        {UserUIConstants.UserTotalBadges}
                        {UserUIConstants.GemSign}
                      </strong>
                      <span className="ms-1">
                        {listOfUserStats?.badges_earned ??
                          notFound.notAvailable}
                      </span>
                    </p>
                    <p className="mb-3">
                      <strong>
                        <i className="bi bi-trophy-fill me-2"></i>
                        {UserUIConstants.UserTotalQuizzesPlayed}
                        {UserUIConstants.GemSign}
                      </strong>
                      <span className="ms-1">
                        {listOfUserStats?.played_quizzes ??
                          notFound.notAvailable}
                      </span>
                    </p>
                    <p className="mb-3">
                      <strong>
                        <i className="bi bi-trophy-fill me-2"></i>
                        {UserUIConstants.UserTotalQuizCreated}
                        {UserUIConstants.GemSign}
                      </strong>
                      <span className="ms-1">
                        {listOfUserStats?.created_quizzes ??
                          notFound.notAvailable}
                      </span>
                    </p>
                    <p className="mb-3">
                      <strong>
                        <i className="bi bi-trophy-fill me-2"></i>
                        {UserUIConstants.UserTotalPoints}
                        {UserUIConstants.GemSign}
                      </strong>
                      <span className="ms-1">
                        {userData?.total_point ?? notFound.notAvailable}
                      </span>
                    </p>
                    <p className="mb-3">
                      <strong>
                        <i className="bi bi-trophy-fill me-2"></i>
                        {UserUIConstants.UserGlobalRank}
                        {UserUIConstants.GemSign}
                      </strong>
                      <span className="ms-1">
                        {userData?.global_rank ?? notFound.notAvailable}
                      </span>
                    </p>
                    <p className="mb-3">
                      <strong>
                        <i className="bi bi-trophy-fill me-2"></i>
                        {UserUIConstants.UserRegionalRank}
                        {UserUIConstants.GemSign}
                      </strong>
                      <span className="ms-1">
                        {userData?.reginal_rank ?? notFound.notAvailable}
                      </span>
                    </p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-info bg-opacity-50 text-black">
          <h5 className="mb-0 text-black text-opacity-75">
            {UserUIConstants.PerformanceStatisticsHeading}
          </h5>
        </div>
        <div className="card-body">
          <TableContainer
            customPageSize={customPageSize}
            setCustomPageSize={setCustomPageSize}
            isGlobalFilter={true}
            columns={performanceStatisticsColumns}
            data={
              searchValue
                ? userPerformanceSearchList
                : userPerformanceList || []
            }
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
            divClass="table table-bordered"
            trClass="user-table-row-container"
            thClass="user-table-head-container"
          />
        </div>
      </div>
    </div>
  );
};

export default UserView;
