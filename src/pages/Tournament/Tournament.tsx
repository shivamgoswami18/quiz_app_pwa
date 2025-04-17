import { editTournamentStatusApi, tournamentListApi } from "Api/Tournament";
import BaseButton from "Components/Base/BaseButton";
import BaseModal from "Components/Base/BaseModal";
import TableContainer from "Components/Base/BaseTable";
import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
  formatNameArrayForDisplay,
  notFound,
} from "Components/constants/common";
import {
  TournamentHeader,
  TournamentKey,
  TournamentLabel,
} from "Components/constants/Tournament";
import { formatDate } from "Components/constants/validation";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";

const Tournament = () => {
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
  const [tournamentId, setTournamentId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"editStatus" | null>(null);
  const navigate = useNavigate();
  const [tournamentList, setTournamentList] = useState<Array<any>>([]);
  const [tournamentSearchList, setTournamentSearchList] = useState<Array<any>>(
    []
  );

  const fetchTournamentList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      limit: customPageSize,
    };
    tournamentListApi(payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setTournamentList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
          if (searchValue) {
            fetchSearchTournamentList();
          }
        } else {
          setTournamentList([]);
        }
      })
      .catch((error) => {
        setTournamentList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  const fetchSearchTournamentList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      search: searchValue,
      limit: customPageSize,
    };
    tournamentListApi(payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setTournamentSearchList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
        } else {
          setTournamentSearchList([]);
        }
      })
      .catch((error) => {
        setTournamentSearchList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  useEffect(() => {
    if (searchValue) {
      fetchSearchTournamentList();
    } else {
      fetchTournamentList();
    }
  }, [currentPage, customPageSize, sortOrder, columnName, searchValue]);

  const handleOpenModal = (type: "editStatus", id: string | null) => {
    setModalType(type);
    setTournamentId(id);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setTournamentId(null);
  };

  const handleViewTournament = (
    id: string | null,
    domains: any,
    name: string
  ) => {
    const selectedListOfDomain = domains.map((item: any) => item._id);
    navigate(`/tournament/view/${id}`, {
      state: {
        selectedListOfDomain: selectedListOfDomain,
        tournamentId: id,
        tournamentName: name,
      },
    });
  };

  const handleSubmitModal = () => {
    if (!tournamentId) return;
    setBtnLoader(true);
    let apiCall;
    if (modalType === "editStatus") {
      apiCall = editTournamentStatusApi(tournamentId);
    }

    if (apiCall) {
      apiCall
        .then((res) => {
          const message = res?.message;
          if (checkStatusCodeSuccess(res?.statusCode)) {
            toast.success(message);
            handleCloseModal();
            if (searchValue) {
              fetchSearchTournamentList();
            } else {
              fetchTournamentList();
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

  const handleAddTournament = () => {
    navigate("/tournament/add");
  };

  const handleEditTournament = (id: string | null) => {
    setTournamentId(id);
    navigate(`/tournament/edit/${id}`);
  };

  const tournamentCoulmns = useMemo(
    () => [
      {
        header: TournamentHeader.Title,
        accessorKey: TournamentKey.Title,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <div>{cell?.row?.original?.title ?? notFound.nullData}</div>;
        },
      },
      {
        header: TournamentHeader.StartDate,
        accessorKey: TournamentKey.StartDate,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          return (
            <div>
              {formatDate(cell?.row?.original?.start_time, "display") ??
                notFound.nullData}
            </div>
          );
        },
      },
      {
        header: TournamentHeader.EndDate,
        accessorKey: TournamentKey.EndDate,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          return (
            <div>
              {formatDate(cell?.row?.original?.end_time, "display") ??
                notFound.nullData}
            </div>
          );
        },
      },
      {
        header: TournamentHeader.NoOfQuizzes,
        accessorKey: TournamentKey.NoOfQuizzes,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <div>{cell?.row?.original?.quiz_count ?? 0}</div>;
        },
      },
      {
        header: TournamentHeader.Status,
        accessorKey: TournamentKey.Status,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          return (
            <div className="d-flex justify-content-start gap-2 icon">
              {(() => {
                const status = cell?.row?.original?.status;
                if (status === commonLabel.Publish) {
                  return (
                    <span className="badge bg-success">
                      {commonLabel.Publish}
                    </span>
                  );
                } else if (status === commonLabel.Draft) {
                  return (
                    <span className="badge bg-warning">
                      {commonLabel.Draft}
                    </span>
                  );
                } else {
                  return (
                    <span className="badge bg-success">
                      {commonLabel.Complete}
                    </span>
                  );
                }
              })()}
            </div>
          );
        },
      },
      {
        header: TournamentHeader.Domain,
        accessorKey: TournamentKey.Domain,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          const domains = cell?.row?.original?.domain_id || [];
          if (domains.length === 0) {
            return <div>{notFound.nullData}</div>;
          }
          const { displayText, fullText } = formatNameArrayForDisplay(domains);
          return (
            <span className="tooltip-container">
              <span className="cursor-pointer">{displayText}</span>
              {domains.length > 1 && (
                <span className="tooltip-text">{fullText}</span>
              )}
            </span>
          );
        },
      },
      {
        header: commonLabel.Action,
        accessorKey: commonLabel.Action,
        cell: (cell: any) => (
          <div className="d-flex justify-content-start enable-action flex-wrap gap-2 icon">
            {cell?.row?.original?.status === commonLabel.Draft && (
              <>
                <span className="tooltip-container">
                  <BaseButton
                    className="icon-button"
                    onClick={() =>
                      handleEditTournament(cell?.row?.original?._id)
                    }
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
                      handleOpenModal("editStatus", cell?.row?.original?._id)
                    }
                    startIcon={
                      <i className="mdi mdi-autorenew fs-4 text-dark cursor-pointer" />
                    }
                  />
                  <span className="tooltip-text">{commonLabel.Status}</span>
                </span>
              </>
            )}
            <span className="tooltip-container">
              <BaseButton
                className="icon-button"
                onClick={() =>
                  handleViewTournament(
                    cell?.row?.original?._id,
                    cell?.row?.original?.domain_id,
                    cell?.row?.original?.title
                  )
                }
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

  document.title = TournamentLabel.TournamentPageTitle;
  return (
    <>
      <div className="page-content pt-5 mt-4">
        <Row className="d-flex my-2 justify-content-between align-items-center">
          <Col>
            <h5 className="my-0">{TournamentLabel.Tournaments}</h5>
          </Col>
          <Col className="d-flex justify-content-end">
            <BaseButton
              className="btn btn-info"
              onClick={() => handleAddTournament()}
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
            columns={tournamentCoulmns}
            data={searchValue ? tournamentSearchList : tournamentList || []}
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
        title={TournamentLabel.EditStatus}
        submit={handleSubmitModal}
        closeLabel={commonLabel.Cancel}
        submitLabel={commonLabel.Update}
        closeLabelColor="danger"
        submitLabelColor="info"
        loader={btnLoader}
      >
        <p>{commonLabel.Are_You_Sure_You_Want_To_Update_The_Status}</p>
      </BaseModal>
    </>
  );
};

export default Tournament;
