import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  addQuizDetailsApi,
  editQuizDetailsApi,
  viewQuizDetailsApi,
} from "Api/Quiz";
import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
  getItem,
} from "Components/constants/common";
import { toast } from "react-toastify";
import {
  DifficultyLevelOption,
  QuizOption,
  QuizzesLabel,
  QuizzesUIConstants,
} from "Components/constants/Quizzes";
import BaseInput from "Components/Base/BaseInput";
import { BaseSelect } from "Components/Base/BaseSelect";
import { Col, Form, Label, Row } from "reactstrap";
import BaseButton from "Components/Base/BaseButton";
import {
  durationFormatRegex,
  durationValueRegex,
  fileLimitErrorMessage,
  fileTypeImagerrorMessage,
  formatDate,
  InputPlaceHolder,
  SelectPlaceHolder,
  validationMessages,
} from "Components/constants/validation";
import Loader from "Components/Base/BaseLoader";
import { domainListApi } from "Api/QuizDomain";
import DefaultQuizImage from "../../assets/images/file.png";
import { fileUploadApi } from "Api/AuthApi";
import { FaEdit } from "react-icons/fa";

const QuizForm = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [btnLoader, setBtnLoader] = useState<boolean>(false);
  const [quizDetails, setQuizDetails] = useState<any>(null);
  const navigate = useNavigate();
  const { quizId } = useParams();
  const location = useLocation();
  const quizStateId = location.state?.quizId;
  const finalQuizId = quizId || quizStateId;
  const isEdit = Boolean(finalQuizId);
  const [domainOptions, setDomainOptions] = useState<Array<any>>([]);
  const [quizImage, setQuizImage] = useState("");
  const [updatedQuizImage, setUpdatedQuizImage] = useState<string>("");

  useEffect(() => {
    if (updatedQuizImage) {
      const fileUrl = `${process.env.REACT_APP_FILE_BASE_URL}${updatedQuizImage}`;
      setQuizImage(fileUrl);
    }
  }, [quizImage]);

  const fetchQuizDetails = () => {
    setLoader(true);
    viewQuizDetailsApi(finalQuizId)
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setQuizDetails(res?.data);
          const fileUrl = `${process.env.REACT_APP_FILE_BASE_URL}${res?.data?.quiz_image}`;
          setQuizImage(res?.data?.quiz_image ? fileUrl : DefaultQuizImage);
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
    if (isEdit) {
      fetchQuizDetails();
    }
  }, [isEdit, quizId]);

  useEffect(() => {
    fetchDomainList();
  }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: quizDetails ? quizDetails?.title : "",
      domain: quizDetails ? quizDetails?.domain?.name : "",
      type: quizDetails ? quizDetails?.type : "",
      questions: quizDetails ? quizDetails?.total_questions : "",
      duration: quizDetails ? quizDetails?.duration : "10:00",
      difficultyLevel: quizDetails ? quizDetails?.difficulty_level : "",
      maximumParticipant: quizDetails ? quizDetails.maximum_participant : "",
      startDate: quizDetails
        ? formatDate(quizDetails?.start_time, "input")
        : "",
      endDate: quizDetails ? formatDate(quizDetails?.end_time, "input") : "",
      quizImage: quizDetails ? quizDetails?.quiz_image : "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(
        validationMessages.required(QuizzesLabel.Title)
      ),
      domain: Yup.string().required(
        validationMessages.required(QuizzesLabel.Domain)
      ),
      type: Yup.string().required(
        validationMessages.required(QuizzesLabel.Type)
      ),
      questions: Yup.number()
        .required(QuizzesLabel.Question)
        .min(
          1,
          validationMessages.greaterThan(1, QuizzesLabel.QuestionValidation)
        ),
      duration: Yup.string()
        .matches(durationFormatRegex, QuizzesLabel.DurationFormatValidation)
        .required(validationMessages.required(QuizzesLabel.Duration)),
      difficultyLevel: Yup.string().required(
        validationMessages.required(QuizzesLabel.DifficultyLevel)
      ),
      maximumParticipant: Yup.number()
        .required(validationMessages.required(QuizzesLabel.MaximumParticipant))
        .min(
          1,
          validationMessages.greaterThan(
            1,
            QuizzesLabel.MaximumParticipantValidation
          )
        ),
      startDate: Yup.string().required(
        validationMessages.required(QuizzesLabel.StartDate)
      ),
      endDate: Yup.string()
        .required(validationMessages.required(QuizzesLabel.EndDate))
        .test(
          commonLabel.Is_Greater,
          validationMessages.greaterTime(
            QuizzesLabel.StartDateValidation,
            QuizzesLabel.EndDateValidation
          ),
          function (value) {
            const { startDate } = this.parent;
            return new Date(value) > new Date(startDate);
          }
        ),
      quizImage: Yup.string().required(
        validationMessages.required(QuizzesLabel.QuizImage)
      ),
    }),
    onSubmit: (values) => {
      setBtnLoader(true);
      const selectedDomain = domainOptions?.filter(
        (item: any) => item?.label === values?.domain
      );
      const adminId = getItem(commonLabel.adminId);
      const payload: any = {
        title: values.title,
        total_questions: values.questions,
        duration: values.duration,
        start_time: values.startDate,
        end_time: values.endDate,
        difficulty_level: values.difficultyLevel,
        domain_id: selectedDomain[0]?.id,
        status: commonLabel.Draft,
        rewards: QuizzesUIConstants.Gold,
        type: values.type,
        maximum_participant: values.maximumParticipant,
        quiz_image: quizDetails?.quiz_image || "",
        total_draft_questions: quizDetails?.total_draft_questions || 0,
      };

      if (
        values.type === QuizzesLabel.Public ||
        values.type === QuizzesLabel.Tournament
      ) {
        payload.added_by = adminId;
      }

      if (updatedQuizImage) {
        payload.quiz_image = updatedQuizImage;
      }

      if (!isEdit && values.type === QuizzesLabel.Private) {
        toast.warning(QuizzesLabel.AdminPrivateQuizWarningMessage);
      }

      const apiCall = isEdit
        ? editQuizDetailsApi(finalQuizId, payload)
        : addQuizDetailsApi(payload);

      handleSubmit(apiCall, selectedDomain[0]?.id);
    },
  });

  const handleSubmit = (api: any, domainId: string) => {
    api
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          toast.success(res?.message);
          navigate(`/quizzes/quizQuestion`, {
            state: {
              domainId: domainId,
              quizId: res?.data?.id || finalQuizId,
              toalQuestions: validation.values.questions,
              quizName: res?.data?.title || validation.values.title,
            },
          });
          setUpdatedQuizImage("");
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

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith(QuizzesLabel.ImageTypeForQuiz)) {
        toast.error(fileTypeImagerrorMessage);
        return;
      }
      if (file.size > 1048576) {
        toast.error(fileLimitErrorMessage);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setQuizImage(reader.result);
          validation.setFieldValue("quizImage", reader.result);
        }
      };
      reader.readAsDataURL(file);
      setLoader(true);
      const formData = new FormData();
      formData.append("files", file);
      await fileUploadApi(formData)
        .then((res: any) => {
          if (checkStatusCodeSuccess(res?.statusCode)) {
            toast.success(res?.message);
            const uploadedFile = res?.data?.[0]?.file;
            if (uploadedFile) {
              const fileUrl = `${process.env.REACT_APP_FILE_BASE_URL}${uploadedFile}`;
              setUpdatedQuizImage(uploadedFile);
              setQuizImage(fileUrl);
              validation.setFieldValue("quizImage", uploadedFile);
            }
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
    }
  };

  const handleChange = (name: string, value: string) => {
    validation.setFieldValue(name, value);
  };

  const handleCancel = () => {
    navigate("/quizzes");
  };

  return (
    <div className="page-content pt-5 mt-4">
      <div className="flex-grow-1">
        <Row className="d-flex my-2 justify-content-between align-items-center py-2 overflow-x-hidden">
          <Col md={6}>
            <h5 className="ms-2 my-0">
              {isEdit
                ? QuizzesUIConstants.EditQuiz
                : QuizzesUIConstants.AddQuiz}
            </h5>
          </Col>
          <Col
            md={6}
            className="mt-2 mt-md-0 d-flex justify-content-start mx-2 justify-content-md-end mx-md-0"
          >
            <span className="d-flex align-items-center me-2">
              <a className="text-dark" href="/quizzes">
                {QuizzesUIConstants.QuizNavigate}
              </a>
              <i className="mdi mdi-chevron-right text-top"></i>
              {isEdit
                ? QuizzesUIConstants.EditQuizNavigate
                : QuizzesUIConstants.AddQuizNavigate}
            </span>
          </Col>
        </Row>
        <div className="card p-4">
          <Form id="quizForm" onSubmit={validation.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <BaseInput
                  label={QuizzesUIConstants.TitleInputLabel}
                  name="title"
                  type="text"
                  placeholder={InputPlaceHolder(
                    QuizzesUIConstants.TitleInputPlaceholder
                  )}
                  onChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  value={validation.values.title || ""}
                  error={validation.errors.title}
                  touched={validation.touched.title}
                  required
                />
              </Col>
              <Col md={6} className="mb-3">
                <BaseInput
                  label={QuizzesUIConstants.QuestionsLabel}
                  name="questions"
                  type="number"
                  placeholder={InputPlaceHolder(
                    QuizzesUIConstants.QuestionsPlaceholder
                  )}
                  onChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  value={validation.values.questions || ""}
                  error={validation.errors.questions}
                  touched={validation.touched.questions}
                  required
                />
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <BaseInput
                  label={QuizzesUIConstants.DurationLabel}
                  name="duration"
                  type="text"
                  placeholder={QuizzesUIConstants.DurationPlaceholder}
                  onChange={(e) => {
                    const value = e.target.value.replace(
                      durationValueRegex,
                      ""
                    );
                    validation.setFieldValue("duration", value);
                  }}
                  handleBlur={validation.handleBlur}
                  value={validation.values.duration || ""}
                  error={validation.errors.duration}
                  touched={validation.touched.duration}
                  required
                />
              </Col>
              <Col md={6} className="mb-3">
                <BaseInput
                  label={QuizzesUIConstants.MaximumParticipantLabel}
                  name="maximumParticipant"
                  type="number"
                  placeholder={InputPlaceHolder(
                    QuizzesUIConstants.MaximumParticipantPlaceholder
                  )}
                  onChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  value={validation.values.maximumParticipant || ""}
                  error={validation.errors.maximumParticipant}
                  touched={validation.touched.maximumParticipant}
                  required
                />
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <BaseInput
                  label={QuizzesUIConstants.StartDateTimeInputLabel}
                  name="startDate"
                  type="datetime-local"
                  onChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  value={validation.values.startDate || ""}
                  error={validation.errors.startDate}
                  touched={validation.touched.startDate}
                  required
                />
              </Col>
              <Col md={6} className="mb-3">
                <BaseInput
                  label={QuizzesUIConstants.EndDateTimeInputLabel}
                  name="endDate"
                  type="datetime-local"
                  onChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  value={validation.values.endDate || ""}
                  error={validation.errors.endDate}
                  touched={validation.touched.endDate}
                  required
                />
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <BaseSelect
                  label={QuizzesUIConstants.TypeLabel}
                  name="type"
                  placeholder={SelectPlaceHolder(
                    QuizzesUIConstants.TypePlaceholder
                  )}
                  options={QuizOption}
                  handleChange={handleChange}
                  handleBlur={(e: React.FocusEvent<HTMLSelectElement>) =>
                    validation.handleBlur(e)
                  }
                  value={validation.values.type}
                  error={validation.errors.type}
                  touched={validation.touched.type}
                  required
                />
              </Col>
              <Col md={6} className="mb-3">
                <BaseSelect
                  label={QuizzesUIConstants.DomainLabel}
                  name="domain"
                  placeholder={SelectPlaceHolder(
                    QuizzesUIConstants.DomainPlaceholder
                  )}
                  options={domainOptions}
                  handleChange={handleChange}
                  handleBlur={(e: React.FocusEvent<HTMLSelectElement>) =>
                    validation.handleBlur(e)
                  }
                  value={validation.values.domain}
                  error={validation.errors.domain}
                  touched={validation.touched.domain}
                  required
                />
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <BaseSelect
                  label={QuizzesUIConstants.DifficultyLevelLabel}
                  name="difficultyLevel"
                  placeholder={SelectPlaceHolder(
                    QuizzesUIConstants.DifficultyLevelPlaceholder
                  )}
                  options={DifficultyLevelOption}
                  handleChange={handleChange}
                  handleBlur={(e: React.FocusEvent<HTMLSelectElement>) =>
                    validation.handleBlur(e)
                  }
                  value={validation.values.difficultyLevel}
                  error={validation.errors.difficultyLevel}
                  touched={validation.touched.difficultyLevel}
                  required
                />
              </Col>
            </Row>

            <div>
              <p className="fw-medium">
                {QuizzesUIConstants.QuizImage}
                <span className="text-danger">*</span>
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-center mb-3">
              <div className="position-relative">
                <img
                  src={quizImage}
                  alt={QuizzesLabel.DefaultQuizImageAlt}
                  className="quiz-image-style"
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    (e.target as HTMLImageElement).src = DefaultQuizImage;
                  }}
                />
                <Label
                  htmlFor="quizImage"
                  className="quiz-edit-image-button-style cursor-pointer"
                >
                  <FaEdit />
                </Label>
                <BaseInput
                  name="quizImage"
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            {validation.touched.quizImage &&
              typeof validation.errors.quizImage === "string" && (
                <div className="text-danger">{validation.errors.quizImage}</div>
              )}

            <div className="d-flex justify-content-end gap-1">
              <div>
                <BaseButton
                  type="submit"
                  color="info"
                  label={commonLabel.SaveNext}
                  loader={btnLoader}
                />
              </div>
              <div>
                <BaseButton
                  type="button"
                  color="danger"
                  label={commonLabel.Cancel}
                  onClick={handleCancel}
                />
              </div>
            </div>
          </Form>
        </div>
      </div>
      {loader && (
        <div className="full-screen-loader">
          <Loader color="success" />
        </div>
      )}
    </div>
  );
};

export default QuizForm;
