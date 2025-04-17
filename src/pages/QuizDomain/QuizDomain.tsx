import {
  addDomainApi,
  deleteDomainApi,
  domainListApi,
  editDomainApi,
  viewDomainApi,
} from "Api/QuizDomain";
import BaseButton from "Components/Base/BaseButton";
import BaseInput from "Components/Base/BaseInput";
import Loader from "Components/Base/BaseLoader";
import BaseModal from "Components/Base/BaseModal";
import TableContainer from "Components/Base/BaseTable";
import DeleteModal from "Components/Base/DeleteModal";
import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
} from "Components/constants/common";
import {
  DomainHeader,
  DomainKey,
  DomainLabel,
  DomainUIConstants,
} from "Components/constants/Domain";
import {
  InputPlaceHolder,
  validationMessages,
} from "Components/constants/validation";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Col, Form, Row } from "reactstrap";
import * as Yup from "yup";

const QuizDomain = () => {
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
  const [domainList, setDomainList] = useState<Array<any>>([]);
  const [domainSearchList, setDomainSearchList] = useState<Array<any>>([]);
  const [domainData, setDomainData] = useState<any>(null);
  const [domainId, setDomainId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"addEdit" | "delete" | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchDomainList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      limit: customPageSize,
    };
    domainListApi(payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setDomainList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
          if (searchValue) {
            fetchSearchDomainList();
          }
        }
      })
      .catch((error) => {
        setDomainList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  const fetchSearchDomainList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      search: searchValue,
      limit: customPageSize,
    };
    domainListApi(payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setDomainSearchList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
        }
      })
      .catch((error) => {
        setDomainSearchList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  useEffect(() => {
    if (searchValue) {
      fetchSearchDomainList();
    } else {
      fetchDomainList();
    }
  }, [currentPage, customPageSize, sortOrder, columnName, searchValue]);

  const viewDomain = (id: string) => {
    setLoader(true);
    viewDomainApi(id)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setDomainData(res?.data);
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

  const validationSchema = Yup.object({
    domain: Yup.string().required(
      validationMessages.required(DomainLabel.Domain)
    ),
  });

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      domain: domainData ? domainData?.name : "",
    },
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        name: values.domain,
      };

      const apiCall =
        modalType === "addEdit" && domainId !== null
          ? editDomainApi(domainId, payload)
          : addDomainApi(payload);

      handleSubmit(apiCall);
    },
  });

  const handleOpenModal = (type: "addEdit" | "delete", id?: string | null) => {
    setModalType(type);
    if (type === "addEdit") {
      if (id) {
        setDomainId(id);
        viewDomain(id);
      } else {
        setDomainId(null);
        setDomainData(null);
        validation.resetForm();
      }
    } else if (id) {
      setDomainId(id);
      setShowDeleteModal(true);
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setDomainId(null);
    setDomainData(null);
    setShowDeleteModal(false);
    validation.resetForm();
  };

  const handleDeleteDomain = () => {
    if (domainId) {
      handleSubmit(deleteDomainApi(domainId));
    }
  };

  const handleSubmit = (api: any) => {
    setBtnLoader(true);
    api
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          toast.success(res?.message);
          fetchDomainList();
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

  const domainColumns = useMemo(
    () => [
      {
        header: DomainHeader.Domain,
        accessorKey: DomainKey.Domain,
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
                className="icon-button text-info"
                onClick={() =>
                  handleOpenModal("addEdit", cell?.row?.original?._id)
                }
                startIcon={
                  <i className="mdi mdi-pencil fs-4 text-info cursor-pointer" />
                }
              />
              <span className="tooltip-text">{commonLabel.Edit}</span>
            </span>

            <span className="tooltip-container d-none">
              <BaseButton
                className="icon-button text-info"
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

  document.title = DomainLabel.DomainPageTitle;

  return (
    <>
      <div className="page-content pt-5 mt-4">
        <Row className="d-flex my-2 justify-content-between align-items-center">
          <Col>
            <h5 className="my-0">{DomainLabel.QuizDomain}</h5>
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
            columns={domainColumns}
            data={searchValue ? domainSearchList : domainList || []}
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
          modalType === "addEdit" && domainId !== null
            ? DomainLabel.EditDomain
            : DomainLabel.AddDomain
        }
        submit={validation.handleSubmit}
        closeLabel={commonLabel.Cancel}
        submitLabel={
          modalType === "addEdit" && domainId !== null
            ? commonLabel.Update
            : commonLabel.Submit
        }
        closeLabelColor="danger"
        submitLabelColor="info"
        loader={btnLoader}
        isSubmitDisabled={
          !(modalType === "addEdit" && domainId === null)
            ? !validation.dirty
            : false
        }
      >
        <Form onSubmit={validation.handleSubmit}>
          <div>
            <BaseInput
              label={DomainUIConstants.DomainInputLabel}
              name="domain"
              type="text"
              placeholder={InputPlaceHolder(
                DomainUIConstants.DomainPlaceholder
              )}
              onChange={validation.handleChange}
              handleBlur={validation.handleBlur}
              value={validation.values.domain || ""}
              error={validation.errors.domain}
              touched={validation.touched.domain}
              required
            />
          </div>
        </Form>
      </BaseModal>

      <DeleteModal
        open={showDeleteModal}
        toggle={handleCloseModal}
        title={commonLabel.Delete}
        submit={handleDeleteDomain}
        closeLabel={commonLabel.Cancel}
        submitLabel={commonLabel.Delete}
        closeLabelColor="danger"
        submitLabelColor="info"
        loader={btnLoader}
      >
        <p className="mb-0">{commonLabel.DeleteConfirmation}</p>
      </DeleteModal>

      {loader && (
        <div className="full-screen-loader">
          <Loader color="success" />
        </div>
      )}
    </>
  );
};

export default QuizDomain;
