import { checkStatusCodeSuccess, errorHandler } from "Components/constants/common";
import {
  TournamentLabel,
  TournamentUIConstants,
} from "Components/constants/Tournament";
import React, { useEffect, useState } from "react";
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
import {
  tournamentSelctedQuizzesListApi,
  viewTournamentApi,
} from "Api/Tournament";
import { useLocation, useParams } from "react-router-dom";
import DefaultTournamentImage from "../../assets/images/file.png";
import { toast } from "react-toastify";
import { formatDate } from "Components/constants/validation";
import Loader from "Components/Base/BaseLoader";
import { useInfiniteScroll } from "Components/Base/InfiniteScroll";

const TournamentView = () => {
  const { tournamentId } = useParams();
  const [quizzesList, setQuizzesList] = useState<Array<any>>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [open, setOpen] = useState("-1");
  const [tournamentData, setTournamentData] = useState<any>(null);
  const [tournamentImage, setTournamentImage] = useState("");
  const location = useLocation();
  const [limit, setLimit] = useState(10);
  const [totalQuizzes, setTotalQuizzes] = useState<number | null>(null);
  const tournamentName = location.state?.tournamentName;
  const [quizLoader, setQuizLoader] = useState<boolean>(false);

  const toggle = (id: any) => {
    if (open === id) {
      setOpen("-1");
    } else {
      setOpen(id);
    }
  };

  const fetchTournamentData = () => {
    setLoader(true);
    viewTournamentApi(String(tournamentId))
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setTournamentData(res?.data);
          const fileUrl = `${process.env.REACT_APP_FILE_BASE_URL}${res?.data?.tournament_image}`;
          setTournamentImage(
            res?.data?.tournament_image ? fileUrl : DefaultTournamentImage
          );
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
    fetchTournamentData();
    fetchQuizList();
  }, []);

  const fetchQuizList = () => {
    setQuizLoader(true);
    const payload = {
      sortKey: "_id",
      limit: limit,
    };
    tournamentSelctedQuizzesListApi(String(tournamentId), payload)
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          const filteredQuizzes = res?.data?.items.filter(
            (quiz: any) => quiz?.is_selected === true
          );
          setQuizzesList(filteredQuizzes);
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
          <h5 className="ms-2 my-0">{tournamentName}{TournamentUIConstants.TournamentDetailsHeading}</h5>
        </Col>
        <Col
          md={6}
          className="mt-2 mt-md-0 d-flex justify-content-start mx-2 justify-content-md-end mx-md-0"
        >
          <span className="d-flex align-items-center me-2">
            <a className="text-dark" href="/tournament">
              {TournamentUIConstants.TournamentNavigate}
            </a>
            <i className="mdi mdi-chevron-right text-top"></i>
            {TournamentUIConstants.ViewTournament}
          </span>
        </Col>
      </Row>

      <Card className="shadow-lg p-3 bg-white rounded">
        <Row>
          <Col sm={4} className="text-center">
            <h3 className="text-success">
              {tournamentName}
            </h3>
            <img
              src={tournamentImage}
              alt={tournamentData?.title}
              className="tournament-image-view-style mb-2"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                (e.target as HTMLImageElement).src = DefaultTournamentImage;
              }}
            />
          </Col>
          <Col sm={8} className="pt-0 pt-sm-4">
            <Row>
              <Col sm={4}>
                <p>
                  {TournamentLabel.Tournament}
                  {TournamentLabel.GemSign}
                  <strong className="ms-1">{tournamentData?.title}</strong>
                </p>
                <p>
                  {TournamentLabel.TotalNoOfQuiz}
                  {TournamentLabel.GemSign}
                  <strong className="ms-1">{quizzesList.length}</strong>
                </p>
                <p>
                  {TournamentLabel.Status}
                  {TournamentLabel.GemSign}{" "}
                  <strong
                    className={`badge bg-${
                      tournamentData?.status === TournamentLabel.Draft
                        ? "warning"
                        : "success"
                    }`}
                  >
                    {tournamentData?.status}
                  </strong>
                </p>
              </Col>
              <Col sm={8}>
                <p>
                  {TournamentLabel.StartDateAndTime}
                  {TournamentLabel.GemSign}
                  <strong className="ms-1">
                    {formatDate(tournamentData?.start_time, "display")}
                  </strong>
                </p>
                <p>
                  {TournamentLabel.EndDateAndTime}
                  {TournamentLabel.GemSign}
                  <strong className="ms-1">
                    {formatDate(tournamentData?.end_time, "display")}
                  </strong>
                </p>
                <p>
                  {TournamentUIConstants.Domains}
                  {TournamentLabel.GemSign}{" "}
                  <strong className="ms-1">
                    {tournamentData?.domain_id
                      ?.map((domain: any) => domain.name)
                      .join(", ")}
                  </strong>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {quizzesList?.map((quiz, index) => (
        <div
          className="card"
          id={quiz._id}
          key={quiz._id}
          ref={index === quizzesList.length - 1 ? lastQuizRef : null}
        >
          <Accordion open={open} toggle={toggle}>
            <AccordionItem>
              <AccordionHeader targetId={`${index}`}>
                <CardHeader className="border-0 text-black pt-0 pb-0">
                  <div className="d-flex align-items-start gap-2">
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
                        <strong className="ms-1">{quiz?.domain?.name}</strong>
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

      {quizLoader ||
        (loader && (
          <div className="d-flex justify-content-center align-content-center mb-3">
            <Loader color="success" />
          </div>
        ))}
    </div>
  );
};

export default TournamentView;
