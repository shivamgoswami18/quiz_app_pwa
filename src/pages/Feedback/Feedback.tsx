import { feedbackListApi } from "Api/Feedback";
import BaseButton from "Components/Base/BaseButton";
import Loader from "Components/Base/BaseLoader";
import { useInfiniteScroll } from "Components/Base/InfiniteScroll";
import {
  checkStatusCodeSuccess,
  commonLabel,
  tooltipContainer,
} from "Components/constants/common";
import { FeedbackLabel } from "Components/constants/Feedback";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";

interface DebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
  placeholder?: string;
  [key: string]: any;
}

const Feedback = () => {
  const navigate = useNavigate();
  const [feedbackLoader, setFeedbackLoader] = useState<boolean>(false);
  const [quizFeedbackList, setQuizFeedbackList] = useState<Array<any>>([]);
  const [limit, setLimit] = useState(10);
  const [totalFeedbacks, setTotalFeedbacks] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [onValueSearch, setOnValueSearch] = useState<string>("");

  const fetchQuizFeedbackList = () => {
    setFeedbackLoader(true);
    const payload = {
      sortKey: "_id",
      limit: limit,
      search: searchValue,
    };
    feedbackListApi(commonLabel.True, payload)
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setQuizFeedbackList(res?.data?.items);
          setTotalFeedbacks(res?.data?.totalCount);
        } else {
          setQuizFeedbackList([]);
        }
      })
      .catch((error: any) => {
        setQuizFeedbackList([]);
        return error;
      })
      .finally(() => {
        setFeedbackLoader(false);
      });
  };

  useEffect(() => {
    fetchQuizFeedbackList();
  }, [limit, searchValue]);

  const loadMore = () => {
    setLimit((prev) => prev + 10);
  };

  const lastFeedbackRef = useInfiniteScroll({
    loading: feedbackLoader,
    hasMore:
      totalFeedbacks !== null && quizFeedbackList.length < totalFeedbacks,
    onLoadMore: loadMore,
  });

  const handleClick = (id: string, title: string) => {
    navigate(`/feedback/${id}`, {
      state: { quiName: title },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
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

  const DebouncedInput: React.FC<DebouncedInputProps> = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value);
      }, debounce);

      return () => clearTimeout(timeout);
    }, [debounce, onChange, value]);

    return (
      <input
        {...props}
        value={value}
        id="search-bar-0"
        className="form-control shadow-none search"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    );
  };

  document.title = FeedbackLabel.FeedbackPageTitle;
  return (
    <div className="page-content pt-5 mt-4 overflow-x-hidden">
      <Row className="d-flex my-2 justify-content-between align-items-center">
        <Col sm={6}>
          <h5>{FeedbackLabel.Feedback}</h5>
        </Col>

        <Col sm={6} className="d-flex overflow-x-hidden justify-content-sm-end">
          <div className="search-box mb-2 d-inline-block position-relative">
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

      {quizFeedbackList.length === 0 ? (
        <div className="py-4 text-center bg-white">
          <div>
            <span className="fs-1 text-success">
              <i className="mdi mdi-head-question-outline" />
            </span>
          </div>
          <div className="mt-4">
            <h5>{FeedbackLabel.dataNotFound}</h5>
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            {quizFeedbackList?.map((item: any, index: any) => (
              <div
                key={item._id}
                ref={
                  index === quizFeedbackList.length - 1 ? lastFeedbackRef : null
                }
                className="feedback-card-style"
              >
                <div className="card shadow-sm">
                  <div className="card-body d-flex flex-column gap-3 align-items-center align-items-sm-start">
                    <div className="d-flex gap-2">
                      <strong>{FeedbackLabel.QuizName}:</strong>
                      <div>{tooltipContainer(item?.title, 18)}</div>
                    </div>
                    <div className="d-flex gap-2">
                      <strong>{FeedbackLabel.QuizDomain}:</strong>
                      <div>{tooltipContainer(item?.domain_name, 15)}</div>
                    </div>
                    <div className="d-flex gap-2">
                      <strong>{FeedbackLabel.Rating}:</strong>
                      <div>
                        {Array.from(
                          { length: Math.ceil(item?.ratings) },
                          (_, index) => {
                            if (index < Math.floor(item?.ratings)) {
                              return (
                                <i
                                  key={`star-${item._id}-${index}`}
                                  className="mdi mdi-star text-warning"
                                ></i>
                              );
                            } else {
                              return (
                                <i
                                  key={`star-${item._id}-${index}`}
                                  className="mdi mdi-star-half text-warning"
                                ></i>
                              );
                            }
                          }
                        )}
                      </div>
                    </div>
                    <div>
                      <BaseButton
                        type="button"
                        color="success"
                        label={FeedbackLabel.ViewDetails}
                        onClick={() => handleClick(item?._id, item?.title)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {feedbackLoader && (
            <div className="d-flex justify-content-center align-content-center mb-3">
              <Loader color="success" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Feedback;
