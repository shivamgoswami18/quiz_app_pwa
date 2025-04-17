import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
} from "Components/constants/common";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "Components/Base/BaseLoader";
import { QuizzesLabel, QuizzesUIConstants } from "Components/constants/Quizzes";
import BaseButton from "Components/Base/BaseButton";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  CardBody,
  CardHeader,
  Col,
  Row,
} from "reactstrap";
import {
  addBonusQuestionApi,
  deleteBonusQuestionApi,
  editBonusQuestionApi,
  editQuizStatusApi,
  quizQuestionListWithSelectionApi,
  updateQuizQuestionsAPi,
  viewBonusQuestionApi,
} from "Api/Quiz";
import { toast } from "react-toastify";
import {
  DomainQuestionConstants,
  DomainQuestionOptionUIConstants,
  DomainQuestionPreviewUIConstants,
  QuestionCardUIConstants,
} from "Components/constants/DomainQuestion";
import BaseCheckbox from "Components/Base/BaseCheckbox";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  validationMessages,
  whiteSpaceRegex,
} from "Components/constants/validation";
import BaseModal from "Components/Base/BaseModal";
import DeleteModal from "Components/Base/DeleteModal";
import { useInfiniteScroll } from "Components/Base/InfiniteScroll";
import BonusQuestionOption from "./BonusQuestionOption";
import CkeditorComponent from "Components/Base/CkeditorComponent";

const Questions = () => {
  const location = useLocation();
  const domainId = location.state?.domainId;
  const quizId = location.state?.quizId;
  const toalQuestions = location.state?.toalQuestions;
  const quizName = location.state?.quizName;
  const [questionLoader, setQuestionLoader] = useState<boolean>(false);
  const [
    quizQuestionListWithSelectionList,
    setQuizQuestionListWithSelectionList,
  ] = useState<Array<any>>([]);
  const [open, setOpen] = useState("-1");
  const [btnLoader, setBtnLoader] = useState<boolean>(false);
  const [checkedQuestionsMap, setCheckedQuestionsMap] = useState<{
    [id: string]: boolean;
  }>({});
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const navigate = useNavigate();
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);
  const [limit, setLimit] = useState(10);
  const [modalType, setModalType] = useState<"addEdit" | null>(null);
  const [correctOption, setCorrectOption] = useState<string>("A");
  const [selectedOption, setSelectedOption] = useState("2");
  const [bonusQuestionData, setBonusQuestionData] = useState<any>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [selectBonusQuestionId, setSelectBonusQuestionId] = useState<
    string | null
  >(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [draftStatusLoader, setDraftStatusLoader] = useState<boolean>(false);
  const [publishStatusLoader, setPublishStatusLoader] =
    useState<boolean>(false);
  const [persistentFormValues, setPersistentFormValues] = useState({
    editorData: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  });

  const viewBonusQuestion = (id: string) => {
    setLoader(true);
    viewBonusQuestionApi(id)
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setBonusQuestionData(res?.data);
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

  const toggle = (id: any) => {
    if (open === id) {
      setOpen("-1");
    } else {
      setOpen(id);
    }
  };

  const handleCheckboxChange = (questionId: string) => {
    setCheckedQuestionsMap((prevState) => {
      const updatedCheckedQuestionsMap = {
        ...prevState,
        [questionId]: !prevState[questionId],
      };
      const allCheckedState = quizQuestionListWithSelectionList.every(
        (q: any) => updatedCheckedQuestionsMap[q._id] === true
      );
      setSelectAll(allCheckedState);
      return updatedCheckedQuestionsMap;
    });
  };

  const handleSelectAllChange = () => {
    const newSelectAllState = !selectAll;
    setSelectAll(newSelectAllState);
    const newMap = { ...checkedQuestionsMap };
    quizQuestionListWithSelectionList.forEach((question: any) => {
      newMap[question._id] = newSelectAllState;
    });
    setCheckedQuestionsMap(newMap);
  };

  const handlePublishQuizSubmit = () => {
    setBtnLoader(true);
    editQuizStatusApi(quizId)
      .then((res) => {
        const message = res?.message;
        if (checkStatusCodeSuccess(res?.statusCode)) {
          toast.success(message);
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
  };

  const handleSubmit = (statusType: string) => {
    const regularQuestions = quizQuestionListWithSelectionList.filter(
      (question: any) => !question.is_bonus_question
    );
    const selectedRegularQuestions = regularQuestions
      .filter((question: any) => checkedQuestionsMap[question._id])
      .map(({ _id }: any) => ({
        domain_question_id: _id,
        quiz_id: quizId,
        domain_id: domainId,
        is_bonus_question: false,
      }));
    const bonusQuestions = quizQuestionListWithSelectionList
      .filter((question: any) => question.is_bonus_question)
      .map((question: any) => ({
        ...question,
        quiz_id: quizId,
      }));
    const finalQuestions = [...selectedRegularQuestions, ...bonusQuestions];
    if (
      statusType !== QuizzesUIConstants.QuizStatusPublish ||
      (statusType === QuizzesUIConstants.QuizStatusPublish &&
        finalQuestions.length == toalQuestions)
    ) {
      if (finalQuestions.length > 0) {
        const payload = {
          quizId: quizId,
          quizQuestions: finalQuestions,
        };
        if (statusType === QuizzesUIConstants.QuizStatusPublish) {
          setPublishStatusLoader(true);
        } else {
          setDraftStatusLoader(true);
        }
        updateQuizQuestionsAPi(payload)
          .then((res: any) => {
            if (checkStatusCodeSuccess(res?.statusCode)) {
              toast.success(res?.message);
              if (statusType === QuizzesUIConstants.QuizStatusPublish) {
                handlePublishQuizSubmit();
              }
              navigate("/quizzes");
            } else {
              toast.error(res?.message);
            }
          })
          .catch((err: any) => {
            errorHandler(err);
          })
          .finally(() => {
            if (statusType === QuizzesUIConstants.QuizStatusPublish) {
              setPublishStatusLoader(false);
            } else {
              setDraftStatusLoader(false);
            }
          });
      } else {
        toast.error(QuizzesUIConstants.AddAtleastOneQuestionToDraftAQuiz);
      }
    } else {
      toast.error(
        `${QuizzesUIConstants.Add} ${toalQuestions} ${QuizzesUIConstants.QuestionsIntoQuiz}`
      );
    }
  };

  const fetchQuizQuestionListWithSelectionList = () => {
    setQuestionLoader(true);
    const payload = {
      quizId: quizId,
      domainId: domainId,
      limit: limit,
    };

    quizQuestionListWithSelectionApi(payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          const selectedQuizQuestions = res?.data?.items || [];
          setCheckedQuestionsMap((prevMap) => {
            const updatedCheckedQuestionsMap = { ...prevMap };
            selectedQuizQuestions.forEach((question: any) => {
              if (selectAll) {
                updatedCheckedQuestionsMap[question._id] = true;
              } else if (!(question._id in updatedCheckedQuestionsMap)) {
                updatedCheckedQuestionsMap[question._id] =
                  question.is_selected || false;
              }
            });
            return updatedCheckedQuestionsMap;
          });

          setQuizQuestionListWithSelectionList(selectedQuizQuestions);
          setTotalQuestions(res?.data?.totalCount);
          if (!selectAll) {
            const allSelected = selectedQuizQuestions.every(
              (question: any) => question.is_selected === true
            );
            setSelectAll(allSelected);
          }
        } else {
          setQuizQuestionListWithSelectionList([]);
          setCheckedQuestionsMap({});
          setSelectAll(false);
        }
      })
      .catch((error) => {
        setQuizQuestionListWithSelectionList([]);
        setCheckedQuestionsMap({});
        setSelectAll(false);
      })
      .finally(() => {
        setQuestionLoader(false);
      });
  };

  useEffect(() => {
    fetchQuizQuestionListWithSelectionList();
  }, [limit]);

  const handleOpenModal = (type: "addEdit", id?: string | null) => {
    setModalType(type);
    if (type === "addEdit") {
      if (id) {
        viewBonusQuestion(id);
      } else {
        setSelectBonusQuestionId(null);
        setBonusQuestionData(null);
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
    setSelectBonusQuestionId(null);
    setBonusQuestionData(null);
    formik.resetForm();
    setCorrectOption("A");
    setSelectedOption("2");
  };

  const handleDeleteCloseModal = () => {
    setIsDeleteModal(false);
  };

  const handleDeleteSubmitModal = () => {
    if (selectBonusQuestionId) {
      setBtnLoader(true);
      setIsDeleteModal(false);
      deleteBonusQuestionApi(selectBonusQuestionId)
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
          fetchQuizQuestionListWithSelectionList();
          handleDeleteCloseModal();
        });
    }
  };

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
            bonusQuestionData?.question ?? persistentFormValues.editorData,
          option1:
            bonusQuestionData?.options[0]?.description ??
            persistentFormValues.option1,
          option2:
            bonusQuestionData?.options[1]?.description ??
            persistentFormValues.option2,
        }
      : {
          editorData:
            bonusQuestionData?.question ?? persistentFormValues.editorData,
          option1:
            bonusQuestionData?.options[0]?.description ??
            persistentFormValues.option1,
          option2:
            bonusQuestionData?.options[1]?.description ??
            persistentFormValues.option2,
          option3:
            bonusQuestionData?.options[2]?.description ??
            persistentFormValues.option3,
          option4:
            bonusQuestionData?.options[3]?.description ??
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

      const addBonusQuestionPayload = {
        quiz_id: quizId,
        question: values.editorData,
        is_bonus_question: true,
        options:
          selectedOption === "2" ? optionsArray.slice(0, 2) : optionsArray,
      };

      const editBonusQuestionPayload = {
        quiz_id: quizId,
        question: values.editorData,
        is_bonus_question: true,
        options:
          selectedOption === "2" ? optionsArray.slice(0, 2) : optionsArray,
      };

      const apiCall =
        modalType === "addEdit" && selectBonusQuestionId !== null
          ? editBonusQuestionApi(
              editBonusQuestionPayload,
              selectBonusQuestionId
            )
          : addBonusQuestionApi(addBonusQuestionPayload);
      handleBonusQuestionSubmit(apiCall);
    },
    enableReinitialize: true,
  });

  const handleBonusQuestionSubmit = (api: any) => {
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
        fetchQuizQuestionListWithSelectionList();
      });
  };

  const loadMore = () => {
    setLimit((prev) => prev + 10);
  };

  const lastQuestionRef = useInfiniteScroll({
    loading: questionLoader,
    hasMore:
      totalQuestions !== null &&
      quizQuestionListWithSelectionList.length < totalQuestions,
    onLoadMore: loadMore,
  });

  return (
    <>
      <div className="page-content pt-5 mt-4">
        <Row className="d-flex my-2 justify-content-between align-items-center">
          <Col>
            <span>
              <BaseButton
                onClick={() => {
                  navigate(`/quizzes/edit/${quizId}`, {
                    state: { quizId: quizId },
                  });
                }}
                className="text-dark cursor-pointer navigate-button-style"
                divClass="button-parent-style"
              >
                {QuizzesUIConstants.QuizDetails}
              </BaseButton>
              <i className="mdi mdi-chevron-right text-top"></i>
              {quizName}
            </span>
          </Col>
          <Col className="d-flex justify-content-end gap-2 align-items-center flex-column-reverse flex-sm-row">
            {quizQuestionListWithSelectionList.length > 0 && (
              <BaseCheckbox
                id="select-all-checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
                label={QuizzesUIConstants.SelectAll}
              />
            )}
            <BaseButton
              className="btn btn-info d-flex gap-2"
              onClick={() => handleOpenModal("addEdit")}
              dataTest="button-bonus"
            >
              <i className="mdi mdi-plus" /> {commonLabel.Bonus}
            </BaseButton>
          </Col>
        </Row>

        {quizQuestionListWithSelectionList.length === 0 ? (
          <div className="py-4 text-center bg-white">
            <div>
              <span className="fs-1 text-success">
                <i className="mdi mdi-head-question-outline" />
              </span>
            </div>
            <div className="mt-4">
              <h5>{QuizzesLabel.dataNotFound}</h5>
            </div>
          </div>
        ) : (
          <>
            <div>
              {quizQuestionListWithSelectionList?.map(
                (question: any, index: any) => (
                  <div
                    className="card"
                    key={question._id}
                    ref={
                      index === quizQuestionListWithSelectionList.length - 1
                        ? lastQuestionRef
                        : null
                    }
                  >
                    <Accordion open={open} toggle={toggle}>
                      <AccordionItem>
                        <AccordionHeader targetId={`${index}`}>
                          <CardHeader className="border-0 text-black pt-0 pb-0 position-relative">
                            <div className="d-flex align-items-start gap-2">
                              {!question?.is_bonus_question && (
                                <span>
                                  <BaseCheckbox
                                    id={`checkbox-${index}`}
                                    checked={
                                      checkedQuestionsMap[question._id] || false
                                    }
                                    onChange={() =>
                                      handleCheckboxChange(question._id)
                                    }
                                    label=""
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </span>
                              )}
                              {question?.is_bonus_question && (
                                <div className="ribbon-box shadow-none mb-lg-0 ribbon-style-bonus">
                                  <div className="ribbon ribbon-success ribbon-shape">
                                    {commonLabel.Bonus}
                                  </div>
                                </div>
                              )}
                              <div
                                className={`${
                                  question?.is_bonus_question ? "mt-4 pt-2" : ""
                                }`}
                              >
                                <div className="d-flex align-items-start gap-2">
                                  {!question?.is_bonus_question && (
                                    <p className="mb-0">{`${
                                      DomainQuestionPreviewUIConstants.QForQuestionNumber
                                    }${index + 1}${
                                      DomainQuestionPreviewUIConstants.DotForQuestionNumber
                                    }`}</p>
                                  )}
                                  <div
                                    className="preview-question-style"
                                    dangerouslySetInnerHTML={{
                                      __html: `${question?.question}`,
                                    }}
                                  />
                                </div>
                                {question?.is_bonus_question && (
                                  <div className="d-flex gap-2 mt-2">
                                    <BaseButton
                                      className="btn btn-info d-flex justify-content-center align-content-center rounded-circle px-2 py-1"
                                      onClick={(e: any) => {
                                        e.stopPropagation();
                                        setSelectBonusQuestionId(question?._id);
                                        handleOpenModal(
                                          "addEdit",
                                          question?._id
                                        );
                                      }}
                                    >
                                      <i className="mdi mdi-pencil" />
                                    </BaseButton>
                                    <BaseButton
                                      className="btn btn-danger d-flex justify-content-center align-content-center rounded-circle px-2 py-1"
                                      onClick={(e: any) => {
                                        e.stopPropagation();
                                        setIsDeleteModal(true);
                                        setSelectBonusQuestionId(question?._id);
                                      }}
                                    >
                                      <i className="mdi mdi-delete" />
                                    </BaseButton>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </AccordionHeader>
                        <AccordionBody accordionId={`${index}`}>
                          <CardBody className="p-0">
                            {question?.options?.map(
                              (option: any) => (
                                <p
                                  key={`${question._id}-${option.option}`}
                                  className={`ps-3 ${
                                    option.is_correct
                                      ? "bg-success text-white rounded-2 py-2"
                                      : ""
                                  }`}
                                >
                                  {`${option.option}. ${option.description}`}
                                </p>
                              )
                            )}
                          </CardBody>
                        </AccordionBody>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )
              )}

              <div className="d-flex justify-content-end mb-2 gap-2">
                <BaseButton
                  onClick={() => handleSubmit("draft")}
                  label={QuizzesUIConstants.SaveAsDraft}
                  loader={draftStatusLoader}
                  color="warning"
                />
                <BaseButton
                  onClick={() => handleSubmit("publish")}
                  label={commonLabel.Publish}
                  loader={publishStatusLoader}
                  color="success"
                />
              </div>
            </div>
            {questionLoader && (
              <div className="d-flex justify-content-center align-content-center mb-3">
                <Loader color="success" />
              </div>
            )}
          </>
        )}
      </div>

      <BaseModal
        open={modalType === "addEdit"}
        toggle={handleCloseModal}
        title={
          modalType === "addEdit" && selectBonusQuestionId !== null
            ? QuizzesLabel.EditBonusQuestion
            : QuizzesLabel.AddBonusQuestion
        }
        submit={formik.handleSubmit}
        closeLabel={commonLabel.Cancel}
        submitLabel={
          modalType === "addEdit" && selectBonusQuestionId !== null
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
          isEditing={selectBonusQuestionId !== null}
        >
          <BonusQuestionOption
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

      {loader && (
        <div className="full-screen-loader">
          <Loader color="success" />
        </div>
      )}
    </>
  );
};

export default Questions;
