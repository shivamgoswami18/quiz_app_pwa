import { quizQuestionListApi, viewQuizDetailsApi } from "Api/Quiz";
import {
  checkStatusCodeSuccess,
  commonLabel,
  notFound,
} from "Components/constants/common";
import { DomainQuestionPreviewUIConstants } from "Components/constants/DomainQuestion";
import { QuizzesUIConstants } from "Components/constants/Quizzes";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
} from "reactstrap";
import DefaultQuizImage from "../../assets/images/file.png";
import Loader from "Components/Base/BaseLoader";
import { formatDate } from "Components/constants/validation";
import { useInfiniteScroll } from "Components/Base/InfiniteScroll";

const QuizView = () => {
  const { quizId } = useParams();
  const [quizQuestionList, setQuizQuestionList] = useState<Array<any>>([]);
  const [quizDetails, setQuizDetails] = useState<any>(null);
  const [open, setOpen] = useState("-1");
  const location = useLocation();
  const title = location.state?.title;
  const [loader, setLoader] = useState<boolean>(false);
  const [quizImage, setQuizImage] = useState("");
  const [quizQuestionLoader, setQuizQuestionLoader] = useState<boolean>(false);
  const [limit, setLimit] = useState(10);
  const [totalQuizQuestions, setTotalQuizQuestions] = useState<number | null>(
    null
  );

  const toggle = (id: any) => {
    if (open === id) {
      setOpen("-1");
    } else {
      setOpen(id);
    }
  };

  const fetchQuizQuestions = () => {
    setQuizQuestionLoader(true);
    const payload = {
      sortKey: "_id",
      limit: limit,
      sortValue: "asc",
    };
    quizQuestionListApi(String(quizId), payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setQuizQuestionList(res?.data?.items);
          setTotalQuizQuestions(res?.data?.totalCount);
        } else {
          setQuizQuestionList([]);
        }
      })
      .catch(() => {
        setQuizQuestionList([]);
      })
      .finally(() => {
        setQuizQuestionLoader(false);
      });
  };

  useEffect(() => {
    fetchQuizQuestions();
  }, [limit]);

  const loadMore = () => {
    setLimit((prev) => prev + 10);
  };

  const lastQuizQuestionbackRef = useInfiniteScroll({
    loading: quizQuestionLoader,
    hasMore:
      totalQuizQuestions !== null &&
      quizQuestionList.length < totalQuizQuestions,
    onLoadMore: loadMore,
  });

  const fetchQuizDetails = () => {
    setLoader(true);
    viewQuizDetailsApi(String(quizId))
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setQuizDetails(res?.data);
          const fileUrl = `${process.env.REACT_APP_FILE_BASE_URL}${res?.data?.quiz_image}`;
          setQuizImage(res?.data?.quiz_image ? fileUrl : DefaultQuizImage);
        }
      })
      .catch(() => {
        setQuizDetails([]);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchQuizDetails();
  }, [quizId]);

  return (
    <>
      <div className="page-content pt-5 mt-4">
        <Row className="d-flex my-3 justify-content-between align-items-center overflow-x-hidden">
          <Col md={6}>
            <h5 className="my-0">
              {title}
              {QuizzesUIConstants.QuizDetailsHeading}
            </h5>
          </Col>
          <Col
            md={6}
            className="mt-2 mt-md-0 d-flex justify-content-start mx-2 justify-content-md-end mx-md-0"
          >
            <span className="d-flex align-items-center">
              <a className="text-dark" href="/quizzes">
                {QuizzesUIConstants.Quiz}
              </a>
              <i className="mdi mdi-chevron-right text-top"></i>
              {QuizzesUIConstants.View}
            </span>
          </Col>
        </Row>

        <Card className="shadow-lg p-3 bg-white rounded">
          <Row>
            <Col sm={4} className="text-center">
              <h3 className="text-success">{quizDetails?.title}</h3>
              {quizImage && (
                <img
                  src={quizImage}
                  alt={quizDetails?.title}
                  className="quiz-image-view-style mb-2"
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    (e.target as HTMLImageElement).src = DefaultQuizImage;
                  }}
                />
              )}
            </Col>
            <Col sm={8} className="pt-0 pt-sm-4">
              <Row>
                <Col sm={6}>
                  <p>
                    {QuizzesUIConstants.DomainLabel}
                    {QuizzesUIConstants.GemSign}{" "}
                    <strong>
                      {quizDetails?.domain.name ?? notFound.notAvailable}
                    </strong>
                  </p>
                  <p>
                    {QuizzesUIConstants.MaxParticipants}
                    {QuizzesUIConstants.GemSign}{" "}
                    <strong>
                      {quizDetails?.maximum_participant ??
                        notFound.notAvailable}
                    </strong>
                  </p>
                  <p>
                    {QuizzesUIConstants.DifficultyLevelLabel}
                    {QuizzesUIConstants.GemSign}{" "}
                    <strong>
                      {quizDetails?.difficulty_level ?? notFound.notAvailable}
                    </strong>
                  </p>
                  <p>
                    {QuizzesUIConstants.StartDateTimeInputLabel}
                    {QuizzesUIConstants.GemSign}{" "}
                    <strong>
                      {formatDate(quizDetails?.start_time, "display")}
                    </strong>
                  </p>
                  <p>
                    {QuizzesUIConstants.EndDateTimeInputLabel}
                    {QuizzesUIConstants.GemSign}{" "}
                    <strong>
                      {formatDate(quizDetails?.end_time, "display")}
                    </strong>
                  </p>
                </Col>
                <Col sm={6}>
                  <p>
                    {QuizzesUIConstants.TypeLabel}
                    {QuizzesUIConstants.GemSign}{" "}
                    <strong>
                      {quizDetails?.type ?? notFound.notAvailable}
                    </strong>
                  </p>
                  <p>
                    {QuizzesUIConstants.Questions}
                    {QuizzesUIConstants.GemSign}{" "}
                    <strong>
                      {quizDetails?.status === QuizzesUIConstants.Draft
                        ? quizDetails?.total_draft_questions
                        : quizDetails?.total_questions}
                    </strong>
                  </p>
                  <p>
                    {QuizzesUIConstants.BonusQuestions}
                    {QuizzesUIConstants.GemSign}{" "}
                    <strong>{quizDetails?.bonus_questions || 0}</strong>
                  </p>
                  <p>
                    {QuizzesUIConstants.DurationLabel}
                    {QuizzesUIConstants.GemSign}{" "}
                    <strong>
                      {quizDetails?.duration ?? notFound.notAvailable}
                    </strong>
                  </p>
                  <p>
                    {QuizzesUIConstants.Status}
                    {QuizzesUIConstants.GemSign}{" "}
                    {(() => {
                      if (
                        quizDetails?.type === commonLabel.Private &&
                        quizDetails?.privateQuizStatus === commonLabel.Reject
                      ) {
                        return (
                          <strong className="badge bg-danger">
                            {commonLabel.Reject}
                          </strong>
                        );
                      } else if (
                        quizDetails?.type === commonLabel.Private &&
                        quizDetails?.privateQuizStatus === commonLabel.Pending
                      ) {
                        return (
                          <strong className="badge pendingStatusColor">
                            {commonLabel.Pending}
                          </strong>
                        );
                      } else if (quizDetails?.status === commonLabel.Publish) {
                        return (
                          <strong className="badge bg-success">
                            {commonLabel.Publish}
                          </strong>
                        );
                      } else if (quizDetails?.status === commonLabel.Draft) {
                        return (
                          <strong className="badge bg-warning">
                            {commonLabel.Draft}
                          </strong>
                        );
                      } else if (quizDetails?.status) {
                        return (
                          <strong className="badge bg-success">
                            {commonLabel.Complete}
                          </strong>
                        );
                      } else {
                        return <strong>{notFound.notAvailable}</strong>;
                      }
                    })()}
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        <div>
          {quizQuestionList?.map((question: any, index: any) => (
            <div
              className="card"
              key={question._id}
              ref={
                index === quizQuestionList.length - 1
                  ? lastQuizQuestionbackRef
                  : null
              }
            >
              <Accordion open={open} toggle={toggle}>
                <AccordionItem>
                  <AccordionHeader targetId={`${index}`}>
                    <CardHeader className="border-0 text-black pt-0 pb-0 position-relative">
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
                          <p className="mb-0">{`${
                            DomainQuestionPreviewUIConstants.QForQuestionNumber
                          }${index + 1}${
                            DomainQuestionPreviewUIConstants.DotForQuestionNumber
                          }`}</p>
                          <div
                            className="preview-question-style"
                            dangerouslySetInnerHTML={{
                              __html: `${question?.question}`,
                            }}
                          />
                        </div>
                      </div>
                    </CardHeader>
                  </AccordionHeader>
                  <AccordionBody accordionId={`${index}`}>
                    <CardBody className="p-0">
                      {question?.options?.map((option: any, index: any) => (
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
                      ))}
                    </CardBody>
                  </AccordionBody>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
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

export default QuizView;
