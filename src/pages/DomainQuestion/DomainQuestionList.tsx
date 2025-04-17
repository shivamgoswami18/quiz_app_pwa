import { domainListApi } from "Api/QuizDomain";
import BaseButton from "Components/Base/BaseButton";
import Loader from "Components/Base/BaseLoader";
import BaseModal from "Components/Base/BaseModal";
import { BaseSelect } from "Components/Base/BaseSelect";
import TableContainer from "Components/Base/BaseTable";
import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
} from "Components/constants/common";
import {
  DomainQuestionUIConstants,
  DomainQuestionHeader,
  DomainQuestionKey,
  DomainQuestionLabel,
} from "Components/constants/DomainQuestion";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Form, Row } from "reactstrap";
import {
  SelectPlaceHolder,
  validationMessages,
} from "Components/constants/validation";

const DomainQuestionList = () => {
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
  const navigate = useNavigate();
  const [domainQuestionList, setDomainQuestionList] = useState<Array<any>>([]);
  const [domainQuestionSearchList, setDomainQuestionSearchList] = useState<
    Array<any>
  >([]);
  const [modalType, setModalType] = useState<"selectDomain" | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [domainId, setDomainId] = useState<string | null>(null);
  const [domainList, setDomainList] = useState<any>(null);

  const fetchDomainQuestionList = () => {
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
          setDomainQuestionList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
          if (searchValue) {
            fetchSearchDomainQuestionList();
          }
        } else {
          setDomainQuestionList([]);
        }
      })
      .catch((error) => {
        setDomainQuestionList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  const fetchSearchDomainQuestionList = () => {
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
          setDomainQuestionSearchList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
        } else {
          setDomainQuestionSearchList([]);
        }
      })
      .catch((error) => {
        setDomainQuestionSearchList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  useEffect(() => {
    if (searchValue) {
      fetchSearchDomainQuestionList();
    } else {
      fetchDomainQuestionList();
    }
  }, [currentPage, customPageSize, sortOrder, columnName, searchValue]);

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

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      domain: selectedDomain || "",
    },
    validationSchema: Yup.object({
      domain: Yup.string().required(
        validationMessages.required(DomainQuestionLabel.Domain)
      ),
    }),
    onSubmit: () => {
      setBtnLoader(true);
      if (selectedDomain) {
        navigate(`/${domainId}/question/add`, {
          state: { domainName: selectedDomain, domainId: domainId },
        });
        handleCloseModal();
      }
      setBtnLoader(false);
    },
  });

  const handleOpenModal = (type: "selectDomain") => {
    setModalType(type);
    fetchDomainList();
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedDomain(null);
    validation.resetForm();
  };

  const handleEditDomainQuestion = (domain: string, id: string) => {
    if (id) {
      navigate(`/${id}/question/edit`, {
        state: { domainName: domain, domainId: id },
      });
      handleCloseModal();
    }
  };

  const domainQuestionColumns = useMemo(
    () => [
      {
        header: DomainQuestionHeader.Domain,
        accessorKey: DomainQuestionKey.Domain,
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        header: DomainQuestionHeader.Question,
        accessorKey: DomainQuestionKey.Question,
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
                onClick={() => {
                  handleEditDomainQuestion(
                    cell?.row?.original?.name,
                    cell?.row?.original?._id
                  );
                }}
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

  const handleChange = (name: string, value: string) => {
    setSelectedDomain(value);
    const filteredDomain = domainList?.find(
      (item: any) => item.value === value
    );
    setDomainId(filteredDomain?.id);
  };

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

  document.title = DomainQuestionLabel.DomainQuestionPageTitle;
  return (
    <>
      <div className="page-content pt-5 mt-4">
        <Row className="d-flex my-2 justify-content-between align-items-center">
          <Col>
            <h5 className="my-0">{DomainQuestionLabel.DomainQuestion}</h5>
          </Col>
          <Col className="d-flex justify-content-end">
            <BaseButton
              className="btn btn-info"
              onClick={() => handleOpenModal("selectDomain")}
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
            columns={domainQuestionColumns}
            data={
              searchValue ? domainQuestionSearchList : domainQuestionList || []
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
          />
        </div>
      </div>

      <BaseModal
        open={modalType !== null}
        toggle={handleCloseModal}
        title={DomainQuestionLabel.SelectDomain}
        submit={validation.handleSubmit}
        closeLabel={commonLabel.Cancel}
        submitLabel={commonLabel.Submit}
        closeLabelColor="danger"
        submitLabelColor="info"
        loader={btnLoader}
      >
        <Form>
          <div>
            <BaseSelect
              name="domain"
              label={DomainQuestionUIConstants.DomainInputLabel}
              options={domainList}
              value={selectedDomain}
              placeholder={SelectPlaceHolder(
                DomainQuestionUIConstants.DomainPlaceholder
              )}
              handleChange={handleChange}
              handleBlur={validation.handleBlur}
              error={validation.errors.domain}
              touched={validation.touched.domain}
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

export default DomainQuestionList;
