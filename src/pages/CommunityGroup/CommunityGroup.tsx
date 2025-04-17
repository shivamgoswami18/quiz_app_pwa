import BaseButton from "Components/Base/BaseButton";
import BaseModal from "Components/Base/BaseModal";
import TableContainer from "Components/Base/BaseTable";
import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
  tooltipContainer,
} from "Components/constants/common";
import {
  CommunityHeader,
  CommunityKey,
  CommunityLabel,
  CommunityUIConstants,
} from "Components/constants/CommunityGroup";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useMemo, useState } from "react";
import Loader from "Components/Base/BaseLoader";
import {
  InputPlaceHolder,
  SelectPlaceHolder,
  validationMessages,
} from "Components/constants/validation";
import BaseInput from "Components/Base/BaseInput";
import { BaseSelect } from "Components/Base/BaseSelect";
import { Col, Form, Row } from "reactstrap";
import {
  addCommunityApi,
  communityListApi,
  editCommunityApi,
  editCommunityStatusApi,
  viewCommunityApi,
} from "Api/Community";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DeleteModal from "Components/Base/DeleteModal";
import { domainListApi } from "Api/QuizDomain";

const CommunityGroup = () => {
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [columnName, setColumnName] = useState("_id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageSize, setCustomPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [loader, setLoader] = useState<boolean>(false);
  const [tableLoader, setTableLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState<boolean>(false);
  const [communityList, setCommunityList] = useState<Array<any>>([]);
  const [communitySearchList, setCommunitySearchList] = useState<Array<any>>(
    []
  );
  const [communityData, setCommunityData] = useState<any>(null);
  const [communityId, setCommunityId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"addEdit" | "editStatus" | null>(
    null
  );
  const navigate = useNavigate();
  const [domainOptions, setDomainOptions] = useState<Array<any>>([]);

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
          setDomainOptions(domainOptions);
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

  const fetchCommunityList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      limit: customPageSize,
    };
    communityListApi(payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setCommunityList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
          if (searchValue) {
            fetchSearchCommunityList();
          }
        } else {
          setCommunityList([]);
        }
      })
      .catch((error) => {
        setCommunityList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  const fetchSearchCommunityList = () => {
    setTableLoader(true);
    const payload = {
      sortKey: columnName,
      sortValue: sortOrder,
      page: currentPage,
      search: searchValue,
      limit: customPageSize,
    };
    communityListApi(payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setCommunitySearchList(res?.data?.items);
          setTotalRecords(res?.data?.totalCount);
          setTotalPages(res?.data?.totalPage);
          setTotalNumberOfRows(res?.data?.itemsCount);
        } else {
          setCommunitySearchList([]);
        }
      })
      .catch((error) => {
        setCommunitySearchList([]);
        return error;
      })
      .finally(() => {
        setTableLoader(false);
      });
  };

  useEffect(() => {
    if (searchValue) {
      fetchSearchCommunityList();
    } else {
      fetchCommunityList();
    }
  }, [currentPage, customPageSize, sortOrder, columnName, searchValue]);

  const viewCommunity = (id: string) => {
    setLoader(true);
    viewCommunityApi(id)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setCommunityData(res?.data);
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

  const handleOpenModal = (
    type: "addEdit" | "editStatus",
    id?: string | null
  ) => {
    setModalType(type);
    if (type === "addEdit") {
      if (id) {
        setCommunityId(id);
        viewCommunity(id);
      } else {
        setCommunityId(null);
        setCommunityData(null);
        validation.resetForm();
      }
    } else if (id) {
      setCommunityId(id);
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setCommunityId(null);
    setCommunityData(null);
    validation.resetForm();
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: communityData ? communityData?.community_name : "",
      description: communityData ? communityData?.description : "",
      domain: communityData ? communityData?.domain?.name : "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(
        validationMessages.required(CommunityLabel.Title)
      ),
      description: Yup.string().required(
        validationMessages.required(CommunityLabel.Description)
      ),
      domain: Yup.string().required(
        validationMessages.required(CommunityLabel.Domain)
      ),
    }),
    onSubmit: (values) => {
      setBtnLoader(true);
      const selectedDomain = domainOptions?.filter(
        (item: any) => item?.label === values?.domain
      );
      const payload = {
        community_name: values.title,
        description: values.description,
        domain_id: selectedDomain[0]?.id,
      };

      let apiCall;
      if (modalType === "addEdit") {
        apiCall = communityId
          ? editCommunityApi(communityId, payload)
          : addCommunityApi(payload);
      } else if (modalType === "editStatus" && communityId !== null) {
        apiCall = editCommunityStatusApi(communityId);
      }

      handleSubmit(apiCall);
    },
  });

  const handleViewUsers = (id: number, communityGroupName: string) => {
    navigate(`/community-group/users/${id}`, {
      state: { communityGroupName: communityGroupName },
    });
  };

  const handleSubmit = (api: any) => {
    api
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          toast.success(res?.message);
          fetchCommunityList();
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

  const handleStatusSubmit = () => {
    if (communityId !== null) {
      setBtnLoader(true);
      editCommunityStatusApi(communityId)
        .then((res: any) => {
          const message = res?.message;
          if (checkStatusCodeSuccess(res?.statusCode)) {
            toast.success(message);
            handleCloseModal();
            if (searchValue) {
              fetchSearchCommunityList();
            } else {
              fetchCommunityList();
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

  const communityCoulmns = useMemo(
    () => [
      {
        header: CommunityHeader.Title,
        accessorKey: CommunityKey.Title,
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        header: CommunityHeader.Description,
        accessorKey: CommunityKey.Description,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          return tooltipContainer(cell?.row?.original?.description, 40);
        },
      },
      {
        header: CommunityHeader.Domain,
        accessorKey: CommunityKey.Domain,
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        header: CommunityHeader.Status,
        accessorKey: CommunityKey.Status,
        enableSorting: true,
        enableColumnFilter: false,
        cell: (cell: any) => {
          const row = cell.row.original;
          return (
            <div className="d-flex align-items-center">
              {row.status === commonLabel.Active ? (
                <span className="badge bg-success">{row.status}</span>
              ) : (
                <span className="badge bg-warning">{row.status}</span>
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
                className="icon-button text-info"
                onClick={() =>
                  handleOpenModal("addEdit", cell?.row?.original?._id)
                }
                startIcon={<i className="mdi mdi-pencil fs-4" />}
              />
              <span className="tooltip-text">{commonLabel.Edit}</span>
            </span>

            <span className="tooltip-container">
              <BaseButton
                className="icon-button text-dark"
                onClick={() =>
                  handleOpenModal("editStatus", cell?.row?.original?._id)
                }
                startIcon={<i className="mdi mdi-autorenew fs-4" />}
              />
              <span className="tooltip-text">{commonLabel.Status}</span>
            </span>

            <span className="tooltip-container">
              <BaseButton
                className="icon-button text-success"
                onClick={() =>
                  handleViewUsers(
                    cell?.row?.original?._id,
                    cell?.row?.original?.community_name
                  )
                }
                startIcon={<i className="mdi mdi-eye-outline fs-4" />}
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

  const handleChange = (name: string, value: string) => {
    validation.setFieldValue(name, value);
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

  document.title = CommunityLabel.CommunityPageTitle;
  return (
    <>
      <div className="page-content pt-5 mt-4">
        <Row className="d-flex my-2 justify-content-between align-items-center">
          <Col>
            <h5 className="my-0">{CommunityLabel.CommunityGroup}</h5>
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
            columns={communityCoulmns}
            data={searchValue ? communitySearchList : communityList || []}
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
          modalType === "addEdit" && communityId !== null
            ? CommunityUIConstants.EditGroup
            : CommunityUIConstants.AddNewGroup
        }
        submit={validation.handleSubmit}
        closeLabel={commonLabel.Cancel}
        submitLabel={
          modalType === "addEdit" && communityId !== null
            ? commonLabel.Update
            : commonLabel.Submit
        }
        closeLabelColor="danger"
        submitLabelColor="info"
        loader={btnLoader}
        isSubmitDisabled={
          !(modalType === "addEdit" && communityId === null)
            ? !validation.dirty
            : false
        }
      >
        <Form onSubmit={validation.handleSubmit}>
          <div className="mt-2">
            <BaseInput
              type="text"
              label={CommunityUIConstants.TitleInputLabel}
              placeholder={InputPlaceHolder(
                CommunityUIConstants.TitleInputLabel
              )}
              name="title"
              value={validation.values.title}
              onChange={validation.handleChange}
              handleBlur={validation.handleBlur}
              touched={validation.touched.title}
              error={validation.errors.title}
              required
            />
          </div>
          <div className="mt-2">
            <BaseInput
              type="textarea"
              label={CommunityUIConstants.DescriptionInputLabel}
              placeholder={InputPlaceHolder(
                CommunityUIConstants.DescriptionInputLabel
              )}
              name="description"
              value={validation.values.description}
              onChange={validation.handleChange}
              handleBlur={validation.handleBlur}
              touched={validation.touched.description}
              error={validation.errors.description}
              required
            />
          </div>
          <div className="mt-2">
            <BaseSelect
              name="domain"
              label={CommunityUIConstants.DomainInputLabel}
              options={domainOptions}
              value={validation.values.domain}
              placeholder={SelectPlaceHolder(
                CommunityUIConstants.DomainInputLabel
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
          {commonLabel.AreYouSureYouWantTo}{" "}
          {CommunityUIConstants.UpdateTheStatus}
        </p>
      </DeleteModal>

      {loader && (
        <div className="full-screen-loader">
          <Loader color="success" />
        </div>
      )}
    </>
  );
};

export default CommunityGroup;
