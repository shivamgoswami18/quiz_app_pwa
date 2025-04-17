import { addFactApi, editFactApi, factListApi, viewFactApi } from "Api/Fact";
import BaseButton from "Components/Base/BaseButton";
import TableContainer from "Components/Base/BaseTable";
import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
  tooltipContainer,
} from "Components/constants/common";
import { FactHeader, FactKey, FactLabel } from "Components/constants/Fact";
import { useEffect, useMemo, useState } from "react";
import { Col, Form, Row } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  InputPlaceHolder,
  validationMessages,
} from "Components/constants/validation";
import BaseModal from "Components/Base/BaseModal";
import BaseInput from "Components/Base/BaseInput";
import Loader from "Components/Base/BaseLoader";

const Fact = () => {
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [columnName, setColumnName] = useState("_id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageSize, setCustomPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [loader, setLoader] = useState<boolean>(false);
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [btnLoader, setBtnLoader] = useState<boolean>(false);
  const [factList, setFactList] = useState<Array<any>>([]);
  const [factSearchList, setFactSearchList] = useState<Array<any>>([]);
  const [factData, setFactData] = useState<any>(null);
  const [factId, setFactId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"addEdit" | null>(null);

  const fetchFactList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      limit: customPageSize,
    };
    factListApi(payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setFactList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
          if (searchValue) {
            fetchSearchFactList();
          }
        }
      })
      .catch((error) => {
        setFactList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  const fetchSearchFactList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      search: searchValue,
      limit: customPageSize,
    };
    factListApi(payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setFactSearchList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
        }
      })
      .catch((error) => {
        setFactSearchList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  useEffect(() => {
    if (searchValue) {
      fetchSearchFactList();
    } else {
      fetchFactList();
    }
  }, [currentPage, customPageSize, sortOrder, columnName, searchValue]);

  const viewFact = (id: string) => {
    setLoader(true);
    viewFactApi(id)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setFactData(res?.data);
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

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: factData ? factData?.title : "",
      date: factData ? factData.date.split("T")[0] : "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(
        validationMessages.required(FactLabel.Title)
      ),
      date: Yup.date().required(validationMessages.required(FactLabel.Date)),
    }),
    onSubmit: (values) => {
      const payload = {
        title: values.title,
        date: values.date,
      };

      const apiCall =
        modalType === "addEdit" && factId !== null
          ? editFactApi(payload, factId)
          : addFactApi(payload);

      handleSubmit(apiCall);
    },
  });

  const handleSubmit = (api: any) => {
    setBtnLoader(true);
    api
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          toast.success(res?.message);
          fetchFactList();
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

  const handleOpenModal = (type: "addEdit", id?: string | null) => {
    setModalType(type);
    if (type === "addEdit") {
      if (id) {
        setFactId(id);
        viewFact(id);
      } else {
        setFactId(null);
        setFactData(null);
        validation.resetForm();
      }
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setFactId(null);
    setFactData(null);
    validation.resetForm();
  };

  const factColumns = useMemo(
    () => [
      {
        header: FactHeader.Title,
        accessorKey: FactKey.Title,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          const row = cell?.row?.original;
          return <span>{tooltipContainer(row?.title, 110)}</span>;
        },
      },
      {
        header: FactHeader.Date,
        accessorKey: FactKey.Date,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          const row = cell?.row?.original;
          return (
            <div className="d-flex align-items-center">
              {new Date(row?.date).toLocaleDateString()}
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
                  handleOpenModal("addEdit", cell?.row?.original?._id)
                }
                startIcon={
                  <i className="mdi mdi-pencil fs-4 text-info cursor-pointer" />
                }
              />
              <span className="tooltip-text">{commonLabel.Edit}</span>
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

  document.title = FactLabel.FactPageTitle;
  return (
    <>
      <div className="page-content pt-5 mt-4">
        <Row className="d-flex my-2 justify-content-between align-items-center">
          <Col>
            <h5 className="my-0">{FactLabel.FactHeading}</h5>
          </Col>
          <Col className="d-flex justify-content-end">
            <BaseButton
              className="btn btn-info"
              onClick={() => handleOpenModal("addEdit")}
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
            columns={factColumns}
            data={searchValue ? factSearchList : factList || []}
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
        open={modalType === "addEdit"}
        toggle={handleCloseModal}
        title={
          modalType === "addEdit" && factId !== null
            ? FactLabel.EditFact
            : FactLabel.AddFact
        }
        submit={validation.handleSubmit}
        closeLabel={commonLabel.Cancel}
        submitLabel={
          modalType === "addEdit" && factId !== null
            ? commonLabel.Update
            : commonLabel.Submit
        }
        closeLabelColor="danger"
        submitLabelColor="info"
        loader={btnLoader}
        isSubmitDisabled={
          !(modalType === "addEdit" && factId === null)
            ? !validation.dirty
            : false
        }
      >
        <Form onSubmit={validation.handleSubmit}>
          <div className="mb-3">
            <BaseInput
              label={FactLabel.Title}
              name="title"
              type="text"
              placeholder={InputPlaceHolder(FactLabel.Title)}
              onChange={validation.handleChange}
              handleBlur={validation.handleBlur}
              value={validation.values.title || ""}
              error={validation.errors.title}
              touched={validation.touched.title}
              required
            />
          </div>
          <div>
            <BaseInput
              label={FactLabel.Date}
              name="date"
              type="date"
              placeholder={InputPlaceHolder(FactLabel.Date)}
              onChange={validation.handleChange}
              handleBlur={validation.handleBlur}
              value={validation.values.date || ""}
              error={validation.errors.date}
              touched={validation.touched.date}
              required
            />
          </div>
        </Form>
      </BaseModal>

      {loader && (
        <div className="full-screen-loader">
          <Loader color="success" />
        </div>
      )}
    </>
  );
};

export default Fact;
