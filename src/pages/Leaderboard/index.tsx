import {
  globalLeaderboardListApi,
  domainLeaderboardListApi,
} from "Api/Leaderboard";
import { domainListApi } from "Api/QuizDomain";
import Loader from "Components/Base/BaseLoader";
import { BaseSelect } from "Components/Base/BaseSelect";
import TableContainer from "Components/Base/BaseTable";
import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
  getItem,
} from "Components/constants/common";
import {
  LeaderboardHeader,
  LeaderboardKey,
  LeaderboardLabel,
  LeaderboardTypeOption,
  medalClasses,
} from "Components/constants/Leaderboard";
import { SelectPlaceHolder } from "Components/constants/validation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";

const Leaderboard = () => {
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [columnName, setColumnName] = useState("global_rank");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageSize, setCustomPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [leaderboardList, setLeaderboardList] = useState<Array<any>>([]);
  const [domainList, setDomainList] = useState<any>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [leaderboardType, setLeaderboardType] = useState("global");
  const [selectedDomain, setSelectedDomain] = useState("");

  const fetchDomainList = () => {
    setLoader(true);
    domainListApi()
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          const domainOptions = res?.data?.items?.map((item: any) => ({
            value: item?.name,
            label: item?.name,
            id: item?._id,
          }));
          setDomainList(domainOptions);
        } else {
          toast.error(res?.message);
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
    fetchDomainList();
  }, []);

  const fetchLeaderboardData = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      limit: customPageSize,
      ...(searchValue && { search: searchValue }),
    };
    const adminId = getItem(commonLabel.adminId);

    const apiCall =
      leaderboardType === "global"
        ? globalLeaderboardListApi
        : domainLeaderboardListApi;

    const finalPayload =
      leaderboardType === "domain"
        ? {
            ...payload,
            domainId: domainList?.find(
              (domain: any) =>
                domain.value.toLowerCase() === selectedDomain.toLowerCase()
            )?.id,
          }
        : payload;

    apiCall(String(adminId), finalPayload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setLeaderboardList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
        } else {
          setLeaderboardList([]);
        }
      })
      .catch(() => {
        setLeaderboardList([]);
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  useEffect(() => {
    if (
      leaderboardType === "global" ||
      (leaderboardType === "domain" && selectedDomain)
    ) {
      fetchLeaderboardData();
    }
  }, [
    currentPage,
    customPageSize,
    sortOrder,
    columnName,
    searchValue,
    leaderboardType,
    selectedDomain,
  ]);

  const leaderboardColumn = useMemo(
    () => [
      {
        header: LeaderboardHeader.Rank,
        accessorKey:
          leaderboardType === "global"
            ? LeaderboardKey.GlobalRank
            : LeaderboardKey.DomainRank,
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        header: LeaderboardHeader.Badge,
        accessorKey: LeaderboardKey.Badge,
        enableSorting: false,
        cell: (cell: any) => {
          const globalRank = cell.row.original.global_rank;
          const domainRank = cell.row.original.domain_rank;
          const colorClass =
            medalClasses[
              leaderboardType === "global" ? globalRank : domainRank
            ] ?? "default-medal";

          return (
            <div className="d-flex justify-content-start enable-action flex-wrap gap-2 icon">
              <i className={`mdi mdi-medal-outline fs-4 ${colorClass}`}></i>
            </div>
          );
        },
        enableColumnFilter: false,
      },
      {
        header: LeaderboardHeader.Name,
        accessorKey: LeaderboardKey.Name,
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        header: LeaderboardHeader.Points,
        accessorKey: LeaderboardKey.Points,
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    [selectedDomain]
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

  const handleLeaderboardTypeChange = (name: string, value: string) => {
    setLeaderboardType(value);
    if (value === "domain") {
      setColumnName("domain_rank");
    } else {
      setColumnName("global_rank");
    }
    setSelectedDomain("");
  };

  document.title = LeaderboardLabel.LeaderboardPageTitle;
  return (
    <>
      <div className="page-content pt-5 mt-4">
        <Row className="my-3">
          <Col>
            <h5 className="my-0">{LeaderboardLabel.Leaderboard}</h5>
          </Col>
        </Row>
        <div className="card p-2">
          <div className="mx-2 mb-2">
            <div className="row">
              <div className="col-12 col-sm-6 col-md-4 mb-3">
                <BaseSelect
                  name="leaderboardType"
                  label={LeaderboardLabel.LeaderboardType}
                  options={LeaderboardTypeOption}
                  value={leaderboardType}
                  placeholder={SelectPlaceHolder(
                    LeaderboardLabel.LeaderboardType
                  )}
                  handleChange={handleLeaderboardTypeChange}
                />
              </div>
              <div className="col-12 col-sm-6 col-md-4 mb-3">
                <BaseSelect
                  name="domain"
                  label={LeaderboardLabel.Domain}
                  options={domainList}
                  value={selectedDomain}
                  placeholder={SelectPlaceHolder(LeaderboardLabel.Domain)}
                  handleChange={(name: string, value: string) =>
                    setSelectedDomain(value)
                  }
                  isDisabled={leaderboardType !== "domain"}
                />
              </div>
            </div>
          </div>
          <TableContainer
            customPageSize={customPageSize}
            setCustomPageSize={setCustomPageSize}
            isGlobalFilter={true}
            columns={leaderboardColumn}
            data={leaderboardList || []}
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

      {loader && (
        <div className="full-screen-loader">
          <Loader color="success" />
        </div>
      )}
    </>
  );
};

export default Leaderboard;
