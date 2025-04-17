import { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import BaseButton from "Components/Base/BaseButton";
import { useLocation, useNavigate } from "react-router-dom";
import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
} from "Components/constants/common";
import {
  DomainQuestionConstants,
  DomainQuestionOptionUIConstants,
  DomainQuestionPreviewUIConstants,
  QuestionCardConstants,
  QuestionCardUIConstants,
} from "../../Components/constants/DomainQuestion";
import BaseModal from "Components/Base/BaseModal";
import DomainQuestionPreview from "./DomainQuestionPreview";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  validationMessages,
  whiteSpaceRegex,
} from "Components/constants/validation";
import DeleteModal from "Components/Base/DeleteModal";
import { toast } from "react-toastify";
import {
  addDomainQuestionApi,
  deleteDomainQuestionApi,
  domainWiseQuestionListApi,
  editDomainQuestionApi,
  viewDomainQuestionApi,
} from "Api/DomainQuestion";
import Loader from "Components/Base/BaseLoader";
import { useInfiniteScroll } from "Components/Base/InfiniteScroll";
import { DebouncedInput } from "Components/Base/DebouncedInput";
import CkeditorComponent from "Components/Base/CkeditorComponent";
import Option from "./Option";

const DomainQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const domainName = location.state?.domainName;
  const domainId = location.state?.domainId;
  const [correctOption, setCorrectOption] = useState<string>("A");
  const [selectedOption, setSelectedOption] = useState("2");
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [domainQuestionList, setDomainQuestionList] = useState<Array<any>>([]);
  const [btnLoader, setBtnLoader] = useState<boolean>(false);
  const [selectDeleteQuestionId, setSelectDeleteQuestionId] = useState<
    string | null
  >(null);
  const [modalType, setModalType] = useState<"addEdit" | null>(null);
  const [domainQuestionData, setDomainQuestionData] = useState<any>(null);
  const [limit, setLimit] = useState(10);
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);
  const [questionLoader, setQuestionLoader] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState("");
  const [onValueSearch, setOnValueSearch] = useState<string>("");
  const [persistentFormValues, setPersistentFormValues] = useState({
    editorData: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  });

  const fetchDomainWiseQuestionList = () => {
    setQuestionLoader(true);
    const payload = {
      sortKey: "_id",
      limit: limit,
      search: searchValue,
    };
    domainWiseQuestionListApi(domainId, payload)
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setDomainQuestionList(res?.data?.items);
          setTotalQuestions(res?.data?.totalCount);
        } else {
          setDomainQuestionList([]);
        }
      })
      .catch((err: any) => {
        setDomainQuestionList([]);
      })
      .finally(() => {
        setQuestionLoader(false);
      });
  };

  const viewDomainQuestion = (id: string) => {
    setLoader(true);
    viewDomainQuestionApi(id)
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setDomainQuestionData(res?.data);
          setSelectedOption(
            res?.data?.options.length && res?.data?.options.length === 4
              ? "4"
              : "2"
          );
          const rightOption = res?.data?.options?.filter(
            (question: any) => question?.is_correct === true
          );
          setCorrectOption(rightOption[0]?.option);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err: any) => {
        errorHandler(err);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchDomainWiseQuestionList();
  }, [limit, searchValue]);

  const loadMore = () => {
    setLimit((prev) => prev + 10);
  };

  const lastQuestionRef = useInfiniteScroll({
    loading: questionLoader,
    hasMore:
      totalQuestions !== null && domainQuestionList.length < totalQuestions,
    onLoadMore: loadMore,
  });

  const validationSchema2Options = Yup.object({
    editorData: Yup.string().required(
      validationMessages.required(DomainQuestionConstants.Question)
    ),
    option1: Yup.string()
      .required(
        validationMessages.required(DomainQuestionOptionUIConstants.Option1)
      )
      .test(
        QuestionCardUIConstants.NoLeadingWhitespaceMessage,
        QuestionCardUIConstants.WhitespaceNotAllowedMessage,
        (value) => !whiteSpaceRegex.test(value || "")
      ),
    option2: Yup.string()
      .required(
        validationMessages.required(DomainQuestionOptionUIConstants.Option2)
      )
      .test(
        QuestionCardUIConstants.NoLeadingWhitespaceMessage,
        QuestionCardUIConstants.WhitespaceNotAllowedMessage,
        (value) => !whiteSpaceRegex.test(value || "")
      ),
  });

  const validationSchema4Options = Yup.object({
    editorData: Yup.string().required(
      validationMessages.required(DomainQuestionConstants.Question)
    ),
    option1: Yup.string()
      .required(
        validationMessages.required(DomainQuestionOptionUIConstants.Option1)
      )
      .test(
        QuestionCardUIConstants.NoLeadingWhitespaceMessage,
        QuestionCardUIConstants.WhitespaceNotAllowedMessage,
        (value) => !whiteSpaceRegex.test(value || "")
      ),
    option2: Yup.string()
      .required(
        validationMessages.required(DomainQuestionOptionUIConstants.Option2)
      )
      .test(
        QuestionCardUIConstants.NoLeadingWhitespaceMessage,
        QuestionCardUIConstants.WhitespaceNotAllowedMessage,
        (value) => !whiteSpaceRegex.test(value || "")
      ),
    option3: Yup.string()
      .required(
        validationMessages.required(DomainQuestionOptionUIConstants.Option3)
      )
      .test(
        QuestionCardUIConstants.NoLeadingWhitespaceMessage,
        QuestionCardUIConstants.WhitespaceNotAllowedMessage,
        (value) => !whiteSpaceRegex.test(value || "")
      ),
    option4: Yup.string()
      .required(
        validationMessages.required(DomainQuestionOptionUIConstants.Option4)
      )
      .test(
        QuestionCardUIConstants.NoLeadingWhitespaceMessage,
        QuestionCardUIConstants.WhitespaceNotAllowedMessage,
        (value) => !whiteSpaceRegex.test(value || "")
      ),
  });

  const validationSchema =
    selectedOption === "2"
      ? validationSchema2Options
      : validationSchema4Options;

  const initialValues =
    selectedOption === "2"
      ? {
          editorData:
            domainQuestionData?.question ?? persistentFormValues.editorData,
          option1:
            domainQuestionData?.options[0]?.description ??
            persistentFormValues.option1,
          option2:
            domainQuestionData?.options[1]?.description ??
            persistentFormValues.option2,
        }
      : {
          editorData:
            domainQuestionData?.question ?? persistentFormValues.editorData,
          option1:
            domainQuestionData?.options[0]?.description ??
            persistentFormValues.option1,
          option2:
            domainQuestionData?.options[1]?.description ??
            persistentFormValues.option2,
          option3:
            domainQuestionData?.options[2]?.description ??
            persistentFormValues.option3,
          option4:
            domainQuestionData?.options[3]?.description ??
            persistentFormValues.option4,
        };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const optionsArray = [
        {
          option: "A",
          description: values.option1,
          is_correct: correctOption === "A",
        },
        {
          option: "B",
          description: values.option2,
          is_correct: correctOption === "B",
        },
        {
          option: "C",
          description: values.option3,
          is_correct: correctOption === "C",
        },
        {
          option: "D",
          description: values.option4,
          is_correct: correctOption === "D",
        },
      ];

      const payload = {
        domain_id: domainId,
        domain_name: domainName,
        question: values.editorData,
        question_type: DomainQuestionConstants.MCQ,
        options:
          selectedOption === "2" ? optionsArray.slice(0, 2) : optionsArray,
      };

      const apiCall =
        modalType === "addEdit" && selectDeleteQuestionId !== null
          ? editDomainQuestionApi(selectDeleteQuestionId, payload)
          : addDomainQuestionApi(payload);
      handleSubmit(apiCall);
    },

    enableReinitialize: true,
  });

  const handleSubmit = (api: any) => {
    setBtnLoader(true);
    api
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          toast.success(res?.message);
          handleCloseModal();
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err: any) => {
        if (
          err?.response?.data?.message ===
          DomainQuestionConstants.RequestEntityTooLarge
        ) {
          toast.error(DomainQuestionConstants.PleaseAddImageLessThen10MB);
        } else {
          errorHandler(err);
        }
      })
      .finally(() => {
        setBtnLoader(false);
        fetchDomainWiseQuestionList();
      });
  };

  const handleOpenModal = (type: "addEdit", id?: string | null) => {
    setModalType(type);
    if (type === "addEdit") {
      if (id) {
        viewDomainQuestion(id);
      } else {
        setSelectDeleteQuestionId(null);
        setDomainQuestionData(null);
        setPersistentFormValues({
          editorData: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
        });
        formik.resetForm();
      }
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setPersistentFormValues({
      editorData: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
    });
    setSelectDeleteQuestionId(null);
    setDomainQuestionData(null);
    formik.resetForm();
    setCorrectOption("A");
    setSelectedOption("2");
  };

  const handleDeleteCloseModal = () => {
    setIsDeleteModal(false);
  };

  const handleDeleteSubmitModal = () => {
    if (selectDeleteQuestionId) {
      setBtnLoader(true);
      setIsDeleteModal(false);
      deleteDomainQuestionApi(selectDeleteQuestionId)
        .then((res) => {
          if (checkStatusCodeSuccess(res?.statusCode)) {
            toast.success(res?.message);
          } else {
            toast.error(res?.message);
          }
        })
        .catch((err) => {
          errorHandler(err);
        })
        .finally(() => {
          setBtnLoader(false);
          fetchDomainWiseQuestionList();
          handleDeleteCloseModal();
        });
    }
  };

  const handleSearchValueChange = (value: any) => {
    if (value !== searchValue) {
      setSearchValue(value);
    }
  };

  const handleValueChange = (newValue: string) => {
    setOnValueSearch(newValue);
    handleSearchValueChange(newValue);
  };

  return (
    <>
      <div className="page-content pt-5 mt-4">
        <Row className="d-flex my-2 justify-content-between align-items-center">
          <Col>
            <span>
              <a className="text-dark" href="/domain-question">
                {DomainQuestionConstants.DomainQuestions}
              </a>
              <i className="mdi mdi-chevron-right text-top"></i>
              {domainName}
              {DomainQuestionConstants.DomainQuestionHeading}
            </span>
          </Col>
          <Col className="d-flex justify-content-end gap-2">
            <BaseButton
              className="btn btn-info d-flex gap-2"
              onClick={() => handleOpenModal("addEdit")}
              dataTest="button-add"
            >
              <i className="mdi mdi-plus" /> {DomainQuestionConstants.Add}
            </BaseButton>
            <BaseButton
              onClick={() => {
                navigate(`/${domainName}/question/preview`);
              }}
              className="btn btn-info d-flex gap-2"
            >
              <i className="mdi mdi-download" />{" "}
              {DomainQuestionConstants.Import}
            </BaseButton>
          </Col>
        </Row>

        <Row>
          <Col className="d-flex  overflow-x-hidden gap-3">
            <h5 className="mt-2">
              {DomainQuestionPreviewUIConstants.PreviewHeading}
            </h5>
            <div className="search-box me-2 mb-2 d-inline-block position-relative">
              <i className="bx bx-search-alt position-absolute top-50 start-0 translate-middle-y ps-3"></i>
              <DebouncedInput
                value={onValueSearch ?? ""}
                onChange={(value) => handleValueChange(value)}
                placeholder={commonLabel.Search}
                className="form-control ps-5"
              />
            </div>
          </Col>
        </Row>

        {domainQuestionList.length === 0 ? (
          <div className="py-4 text-center bg-white">
            <div>
              <span className="fs-1 text-success">
                <i className="mdi mdi-head-question-outline" />
              </span>
            </div>
            <div className="mt-4">
              <h5>{QuestionCardConstants.dataNotFound}</h5>
              <p className="text-muted">
                {QuestionCardConstants.trySearchingWithAnotherKeyword}
              </p>
            </div>
          </div>
        ) : (
          <>
            <DomainQuestionPreview
              setIsDeleteModal={setIsDeleteModal}
              domainQuestionList={domainQuestionList}
              setSelectDeleteQuestionId={setSelectDeleteQuestionId}
              handleOpenModal={handleOpenModal}
              lastQuestionRef={lastQuestionRef}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
            {questionLoader && (
              <div className="d-flex justify-content-center align-content-center mb-3">
                <Loader color="success" />
              </div>
            )}
          </>
        )}

        <BaseModal
          open={modalType === "addEdit"}
          toggle={handleCloseModal}
          title={
            modalType === "addEdit" && selectDeleteQuestionId !== null
              ? QuestionCardConstants.EditQuestion
              : QuestionCardConstants.AddQuestion
          }
          submit={formik.handleSubmit}
          closeLabel={commonLabel.Cancel}
          submitLabel={
            modalType === "addEdit" && selectDeleteQuestionId !== null
              ? commonLabel.Update
              : commonLabel.Submit
          }
          closeLabelColor="danger"
          submitLabelColor="info"
          loader={btnLoader}
        >
          <CkeditorComponent
            formik={formik}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            correctOption={correctOption}
            setCorrectOption={setCorrectOption}
            setPersistentFormValues={setPersistentFormValues}
            persistentFormValues={persistentFormValues}
            isEditing={selectDeleteQuestionId !== null}
          >
            <Option
              formik={formik}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              correctOption={correctOption}
              setCorrectOption={setCorrectOption}
            />
          </CkeditorComponent>
        </BaseModal>

        <DeleteModal
          open={isDeleteModal}
          toggle={handleDeleteCloseModal}
          title={commonLabel.Delete}
          submit={handleDeleteSubmitModal}
          closeLabel={commonLabel.Cancel}
          submitLabel={commonLabel.Delete}
          closeLabelColor="danger"
          submitLabelColor="info"
          loader={btnLoader}
        >
          <p>{commonLabel.DeleteConfirmation}</p>
        </DeleteModal>
      </div>

      {loader && (
        <div className="full-screen-loader">
          <Loader color="success" />
        </div>
      )}
    </>
  );
};

export default DomainQuestion;
