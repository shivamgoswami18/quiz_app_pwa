import {
  editListOfTournamentQuizApi,
  editTournamentStatusApi,
  listOfTournamentDomainQuizApi,
} from "Api/Tournament";
import BaseButton from "Components/Base/BaseButton";
import BaseCheckbox from "Components/Base/BaseCheckbox";
import Loader from "Components/Base/BaseLoader";
import { useInfiniteScroll } from "Components/Base/InfiniteScroll";
import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
} from "Components/constants/common";
import { TournamentLabel } from "Components/constants/Tournament";
import { formatDate } from "Components/constants/validation";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

const TournamentQuiz = () => {
  const location = useLocation();
  const tournamentId = location.state?.tournamentId;
  const tournamentName = location.state?.tournamentName;
  const selectedListOfDomain = location.state?.selectedListOfDomain;
  const navigate = useNavigate();
  const [checkedQuestions, setCheckedQuestions] = useState<boolean[]>([]);
  const [open, setOpen] = useState("-1");
  const [limit, setLimit] = useState(10);
  const [totalQuizzes, setTotalQuizzes] = useState<number | null>(null);
  const [quizzesList, setQuizzesList] = useState<Array<any>>([]);
  const [selectedQuizIds, setSelectedQuizIds] = useState<string[]>([]);
  const [draftStatusLoader, setDraftStatusLoader] = useState<boolean>(false);
  const [publishStatusLoader, setPublishStatusLoader] =
    useState<boolean>(false);
  const [quizLoader, setQuizLoader] = useState<boolean>(false);

  const toggle = (id: any) => {
    if (open === id) {
      setOpen("-1");
    } else {
      setOpen(id);
    }
  };

  const fetchQuizList = () => {
    setQuizLoader(true);
    const payload = {
      sortKey: "_id",
      limit: limit,
      domainId: selectedListOfDomain,
      tournamentId: tournamentId,
    };
    listOfTournamentDomainQuizApi(payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          const items = res?.data?.items || [];
          setQuizzesList(items);

          const initialCheckedState = items.map((quiz: any) =>
            Boolean(quiz.is_selected)
          );
          setCheckedQuestions(initialCheckedState);

          const initialSelectedIds = items
            .filter((quiz: any) => quiz.is_selected)
            .map((quiz: any) => quiz._id);
          setSelectedQuizIds(initialSelectedIds);
          setTotalQuizzes(res?.data?.totalCount);
        } else {
          setQuizzesList([]);
        }
      })
      .catch((error) => {
        setQuizzesList([]);
        return error;
      })
      .finally(() => {
        setQuizLoader(false);
      });
  };

  useEffect(() => {
    fetchQuizList();
  }, [limit]);

  const handleCheckboxChange = (index: number, quizId: string) => {
    setCheckedQuestions((prevState) => {
      const newCheckedState = [...prevState];
      newCheckedState[index] = !prevState[index];
      setSelectedQuizIds((prev) => {
        if (!newCheckedState[index]) {
          return prev.filter((id) => id !== quizId);
        } else {
          return [...prev, quizId];
        }
      });
      return newCheckedState;
    });
  };

  const handlePublishTournamentSubmit = () => {
    editTournamentStatusApi(tournamentId)
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
      });
  };

  const handleSubmit = (statusType: string) => {
    if (selectedQuizIds.length > 0) {
      const payload = {
        tournamentId: tournamentId,
        quizIds: selectedQuizIds,
        status: statusType,
      };
      if (statusType === TournamentLabel.Publish) {
        setPublishStatusLoader(true);
      } else {
        setDraftStatusLoader(true);
      }
      editListOfTournamentQuizApi(payload)
        .then((res) => {
          if (checkStatusCodeSuccess(res?.statusCode)) {
            toast.success(res?.message);
            if (statusType === TournamentLabel.Publish) {
              handlePublishTournamentSubmit();
            }
            navigate("/tournament");
          } else {
            toast.error(res?.message);
          }
        })
        .catch((err) => {
          errorHandler(err);
        })
        .finally(() => {
          if (statusType === TournamentLabel.Publish) {
            setPublishStatusLoader(false);
          } else {
            setDraftStatusLoader(false);
          }
        });
    } else {
      toast.error(TournamentLabel.PleaseSelectAtLeastOneQuiz);
    }
  };

  const loadMore = () => {
    setLimit((prev) => prev + 10);
  };

  const lastQuizRef = useInfiniteScroll({
    loading: quizLoader,
    hasMore: totalQuizzes !== null && quizzesList.length < totalQuizzes,
    onLoadMore: loadMore,
  });

  return (
    <div className="page-content pt-5 mt-4">
      <Row className="d-flex my-2 justify-content-between align-items-center py-2 overflow-x-hidden">
        <Col md={6}>
          <h5 className="ms-2 my-0">{tournamentName}{TournamentLabel.TournamentQuizzesHeading}</h5>
        </Col>
        <Col
          md={6}
          className="mt-2 mt-md-0 d-flex justify-content-start mx-2 justify-content-md-end mx-md-0"
        >
          <span className="d-flex align-items-center me-2">
            <BaseButton
              onClick={() => {
                navigate(`/tournament/edit/${tournamentId}`, {
                  state: { tournamentId: tournamentId },
                });
              }}
              className="text-dark cursor-pointer navigate-button-style"
              divClass="button-parent-style"
            >
              {TournamentLabel.EditTournament}
            </BaseButton>
            <i className="mdi mdi-chevron-right text-top"></i>
            {TournamentLabel.TournamentQuizzes}
          </span>
        </Col>
      </Row>

      {quizzesList.length === 0 ? (
        <div className="py-4 text-center bg-white">
          <div>
            <span className="fs-1 text-success">
              <i className="mdi mdi-head-question-outline" />
            </span>
          </div>
          <div className="mt-4">
            <h5>{TournamentLabel.SorryThereIsNoQuizz}</h5>
          </div>
        </div>
      ) : (
        <>
          <div>
            {quizzesList?.map((quiz, index) => (
              <div
                className="card"
                key={quiz._id}
                ref={index === quizzesList.length - 1 ? lastQuizRef : null}
              >
                <Accordion open={open} toggle={toggle}>
                  <AccordionItem>
                    <AccordionHeader targetId={`${index}`}>
                      <CardHeader className="border-0 text-black pt-0 pb-0">
                        <div className="d-flex align-items-start gap-2">
                          <span>
                            <BaseCheckbox
                              id={`checkbox-${index}`}
                              checked={checkedQuestions[index] || false}
                              onChange={() =>
                                handleCheckboxChange(index, quiz?._id)
                              }
                              label=""
                              onClick={(e) => e.stopPropagation()}
                            />
                          </span>
                          <p className="badge bg-success mb-0">{index + 1}</p>
                          <div>{quiz?.title}</div>
                        </div>
                      </CardHeader>
                    </AccordionHeader>
                    <AccordionBody accordionId={`${index}`}>
                      <CardBody className="p-0">
                        <div className="d-flex flex-column flex-sm-row gap-0 gap-sm-5">
                          <div>
                            <p className="text-black">
                              {TournamentLabel.Domain}
                              {TournamentLabel.GemSign}
                              <strong className="ms-1">
                                {quiz?.domain?.name}
                              </strong>
                            </p>
                            <p className="text-black">
                              {TournamentLabel.TotalNoOfQuestions}
                              {TournamentLabel.GemSign}
                              <strong className="ms-1">
                                {quiz?.total_questions}
                              </strong>
                            </p>
                          </div>
                          <div>
                            <p className="text-black">
                              {TournamentLabel.StartDateAndTime}
                              {TournamentLabel.GemSign}
                              <strong className="ms-1">
                                {formatDate(quiz?.start_time, "display")}
                              </strong>
                            </p>
                            <p className="text-black">
                              {TournamentLabel.EndDateAndTime}
                              {TournamentLabel.GemSign}
                              <strong className="ms-1">
                                {formatDate(quiz?.end_time, "display")}
                              </strong>
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </AccordionBody>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}

            <div className="d-flex justify-content-end mb-2 gap-2">
              <BaseButton
                onClick={() => handleSubmit("Draft")}
                label={TournamentLabel.SaveAsDraft}
                loader={draftStatusLoader}
                color="warning"
              />
              <BaseButton
                onClick={() => handleSubmit("Publish")}
                label={commonLabel.Publish}
                loader={publishStatusLoader}
                color="success"
              />
            </div>
          </div>
          {quizLoader && (
            <div className="d-flex justify-content-center align-content-center mb-3">
              <Loader color="success" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TournamentQuiz;
