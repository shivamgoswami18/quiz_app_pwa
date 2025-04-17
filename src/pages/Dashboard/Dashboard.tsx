import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import StatCard from "./StatCard";
import Flatpickr from "react-flatpickr";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import {
  ToggleDropdown,
  checkStatusCodeSuccess,
  commonLabel,
} from "Components/constants/common";
import { toast } from "react-toastify";
import {
  dashboardFeedbackTrendsDataApi,
  dashboardQuizDataApi,
  dashboardQuizStatisticsDataApi,
  dashboardTopPerformersDataApi,
} from "Api/Dashboard";
import "../../Styles/Dashboard.css";
import {
  CardData,
  DashboardData,
  FeedbackChartData,
  FeedbackChartOptions,
  QuizChartData,
  QuizChartOptions,
  TopPerformers,
  TopPerformersTournament,
} from "../../Components/constants/Dashboard";
import BaseButton from "Components/Base/BaseButton";
import TableContainer from "Components/Base/BaseTable";

const Dashboard: React.FC = () => {
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageSize, setCustomPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  const [tableLoader, setTableLoader] = useState(false);

  const topPerformersColumns = [
    {
      header: DashboardData.PERFORMERS_CLOUMN_PLAYER_HEADER,
      accessorKey: DashboardData.PERFORMERS_CLOUMN_PLAYER_ACCESSORKEY,
      cell: (cell: any) => {
        const row = cell.row.original; // Access the row data
        return (
          <div className="d-flex align-items-center">
            <img
              src={row.image}
              alt={row.name}
              className="dashboard-performers-table-image-style"
            />
            <span>{row.name}</span>
          </div>
        );
      },
      enableColumnFilter: false,
    },
    {
      header: DashboardData.PERFORMERS_CLOUMN_TOURNAMENTS_WON_HEADER,
      accessorKey: DashboardData.PERFORMERS_CLOUMN_TOURNAMENTS_WON_ACCESSORKEY,
      cell: (cell: any) => cell.getValue(),
      enableColumnFilter: false,
    },
    {
      header: DashboardData.PERFORMERS_CLOUMN_TOTAL_POINTS_HEADER,
      accessorKey: DashboardData.PERFORMERS_CLOUMN_TOTAL_POINTS_ACCESSORKEY,
      cell: (cell: any) => cell.getValue(),
      enableColumnFilter: false,
    },
    {
      header: DashboardData.PERFORMERS_CLOUMN_ACCURACY_HEADER,
      accessorKey: DashboardData.PERFORMERS_CLOUMN_ACCURACY_ACCESSORKEY,
      cell: (cell: any) => {
        const row = cell.row.original; // Access the row data
        return (
          <div className="d-flex align-items-center">
            <span className="badge bg-success-subtle text-success">
              {row.accuracy}
            </span>
          </div>
        );
      },
      enableColumnFilter: false,
    },
  ];

  const [date, setDate] = useState<Date[]>([]);
  const [loader, setLoader] = useState(false);
  const [dashboardQuizData, setDashboardQuizData] = useState(null);
  const [dashboardQuizStatisticsData, setDashboardQuizStatisticsData] =
    useState(null);
  const [dashboardTopPerformersData, setDashboardTopPerformersData] =
    useState(null);
  const [dashboardFeedbackTrendsData, setDashboardFeedbackTrendsData] =
    useState(null);

  const fetchDashboardData = async (api: any, setData: any) => {
    setLoader(true);
    await api()
      .then((res: any) => {
        const message = res?.message;
        if (checkStatusCodeSuccess(res?.code)) {
          toast.success(message);
          setData(res?.data);
        } else {
          toast.error(message);
        }
      })
      .catch((err: any) => {
        const errorMessage = err?.response?.data?.message || err?.message;
        toast.error(errorMessage);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  // useEffect(() => {
  //   fetchDashboardData(dashboardQuizDataApi, setDashboardQuizData);
  //   fetchDashboardData(
  //     dashboardQuizStatisticsDataApi,
  //     setDashboardQuizStatisticsData
  //   );
  //   fetchDashboardData(
  //     dashboardTopPerformersDataApi,
  //     setDashboardTopPerformersData
  //   );
  //   fetchDashboardData(
  //     dashboardFeedbackTrendsDataApi,
  //     setDashboardFeedbackTrendsData
  //   );
  // }, []);

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

  document.title = DashboardData.DASHBOARD_PAGE_TITLE;

  return (
    <div className="page-content">
      <Container fluid className="px-0">
        <div className="d-flex flex-column flex-md-row justify-content-between mx-3 mb-3 gap-3">
          <div>
            <h4 className="fs-16 mb-1">{DashboardData.GOOD_MORNING_ADMIN}</h4>
            <p className="text-muted mb-0">
              {DashboardData.HERES_WHATS_HAPPENING}
            </p>
          </div>
          <div className="text-md-end">
            <div className="btn-group">
              <Flatpickr
                value={date}
                onChange={(selectedDates) => setDate(selectedDates)}
                options={{
                  mode: "range",
                  dateFormat: "d M, Y",
                }}
                className="form-control bg-light border-2 active rounded-pill"
                placeholder={DashboardData.FILTER_BY_DATE}
              />
            </div>
          </div>
        </div>

        <Row className="h-100 mt-2">
          {CardData?.map((item, index) => (
            <Col key={index} lg={4} md={6} className="mb-3">
              <StatCard
                icon={item?.icon}
                title={item?.title}
                value={item?.value}
              />
            </Col>
          ))}
        </Row>

        <Row className="h-100 mt-2 mb-4 d-flex justify-content-center">
          {/* Pie Chart */}
          <Col xl={4} md={12} sm={12} className="mb-4">
            <div className="card h-100 pie-chart-style">
              <div className="card-header d-flex align-items-center">
                <h4 className="card-title mb-0 flex-grow-1">
                  {DashboardData.QUIZ_STATISTICS}
                </h4>
                <div className="btn-group">
                  <BaseButton
                    color="secondary"
                    type="button"
                    className="shadow-none rounded-pill"
                    startIcon={<i className="mdi mdi-download me-1"></i>}
                    label={DashboardData.EXPORT_REPORT}
                  />
                </div>
              </div>
              <div className="card-body d-flex justify-content-center align-items-center">
                <PieChart data={QuizChartData} options={QuizChartOptions} />
              </div>
            </div>
          </Col>

          {/* Top Performers */}
          <Col xl={8} className="mb-4">
            <div className="card h-100">
              <div className="card-header d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="card-title mb-0 flex-grow-1">
                    {DashboardData.TOP_PERFORMERS}
                  </h4>
                </div>
                <div className="d-flex flex-column flex-md-row gap-3 gap-md-0">
                  <div>
                    <ToggleDropdown
                      options={TopPerformersTournament?.map(
                        (option) => option.label
                      )}
                      onSelect={() => {}}
                      defaultValue={DashboardData.SELECT_TOURNAMENT}
                      className="z-3 show me-3"
                    />
                  </div>
                  <div className="btn-group">
                    <BaseButton
                      color="secondary"
                      type="button"
                      className="shadow-none rounded-pill"
                      startIcon={<i className="mdi mdi-download me-1"></i>}
                      label={DashboardData.EXPORT_REPORT}
                    />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <TableContainer
                  customPageSize={customPageSize}
                  setCustomPageSize={setCustomPageSize}
                  isGlobalFilter={false}
                  columns={topPerformersColumns}
                  data={searchValue ? TopPerformers : TopPerformers || []}
                  tableClass="table bg-white"
                  manualPagination={false}
                  manualFiltering={false}
                  tableLoader={tableLoader}
                  hasManualPagination={false}
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
          </Col>
        </Row>

        {/* Bar Chart */}
        <Row className="h-100 mt-2 mb-4">
          <Col xl={12}>
            <div className="card h-100">
              <div className="card-header d-flex align-items-center">
                <h4 className="card-title mb-0 flex-grow-1">
                  {DashboardData.FEEDBACK_TRENDS}
                </h4>
              </div>
              <div className="card-body">
                <BarChart
                  data={FeedbackChartData}
                  options={FeedbackChartOptions}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
