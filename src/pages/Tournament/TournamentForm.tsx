import { domainListApi } from "Api/QuizDomain";
import {
  addTournamentApi,
  editTournamentApi,
  viewTournamentApi,
} from "Api/Tournament";
import BaseButton from "Components/Base/BaseButton";
import BaseInput from "Components/Base/BaseInput";
import Loader from "Components/Base/BaseLoader";
import { MultiSelect } from "Components/Base/BaseSelect";
import {
  checkStatusCodeSuccess,
  commonLabel,
  errorHandler,
} from "Components/constants/common";
import {
  TournamentLabel,
  TournamentUIConstants,
} from "Components/constants/Tournament";
import {
  fileLimitErrorMessage,
  fileTypeImagerrorMessage,
  formatDate,
  InputPlaceHolder,
  validationMessages,
} from "Components/constants/validation";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Form, Label, Row } from "reactstrap";
import * as Yup from "yup";
import DefaultTournamentImage from "../../assets/images/file.png";
import { fileUploadApi } from "Api/AuthApi";
import { FaEdit } from "react-icons/fa";

const TournamentForm = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [btnLoader, setBtnLoader] = useState<boolean>(false);
  const [tournamentData, setTournamentData] = useState<any>(null);
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const location = useLocation();
  const tournamentStateId = location.state?.tournamentId;
  const finalTournamentId = tournamentId || tournamentStateId;
  const isEdit = Boolean(finalTournamentId);
  const [domainOptions, setDomainOptions] = useState<Array<any>>([]);
  const [tournamentImage, setTournamentImage] = useState("");
  const [updatedTournamentImage, setUpdatedTournamentImage] =
    useState<string>("");
  const [allDomainOptions, setAllDomainOptions] = useState<Array<any>>([]);

  useEffect(() => {
    if (updatedTournamentImage) {
      const fileUrl = `${process.env.REACT_APP_FILE_BASE_URL}${updatedTournamentImage}`;
      setTournamentImage(fileUrl);
    }
  }, [tournamentImage]);

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

  const fetchDomainList = () => {
    setLoader(true);
    domainListApi()
      .then((res) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          let domains = res?.data?.items?.map((item: any) => ({
            value: item?.name,
            label: item?.name,
            id: item?._id,
          }));
          setAllDomainOptions(domains);
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
      fetchTournamentData();
    }
  }, [isEdit, tournamentId]);

  useEffect(() => {
    fetchDomainList();
  }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: tournamentData ? tournamentData?.title : "",
      startDate: tournamentData
        ? formatDate(tournamentData?.start_time, "input")
        : "",
      endDate: tournamentData
        ? formatDate(tournamentData?.end_time, "input")
        : "",
      domains:
        tournamentData?.domain_id?.map((item: any) => ({
          value: item._id,
          label: item.name,
          id: item._id,
        })) ?? [],
      tournamentImage: tournamentData ? tournamentData?.tournament_image : "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(
        validationMessages.required(TournamentLabel.Title)
      ),
      startDate: Yup.string().required(
        validationMessages.required(TournamentLabel.StartDate)
      ),
      endDate: Yup.string()
        .required(validationMessages.required(TournamentLabel.EndDate))
        .test(
          commonLabel.Is_Greater,
          validationMessages.greaterTime(
            TournamentLabel.StartDateValidation,
            TournamentLabel.EndDateValidation
          ),
          function (value) {
            const { startDate } = this.parent;
            return new Date(value) > new Date(startDate);
          }
        ),
      domains: Yup.array().min(1, TournamentLabel.PleaseSelectAtLeastOneDomain),
      tournamentImage: Yup.string().required(
        validationMessages.required(TournamentLabel.TournamentImage)
      ),
    }),
    onSubmit: (values) => {
      setBtnLoader(true);
      const selectedListOfDomain = values.domains.map((item: any) => item.id);
      const payload = {
        title: values.title,
        start_time: values.startDate,
        end_time: values.endDate,
        domain_id: values.domains.map((domain: any) => domain.id),
        status: commonLabel.Draft,
        tournament_image: tournamentData?.tournament_image ?? "",
      };

      if (updatedTournamentImage) {
        payload.tournament_image = updatedTournamentImage;
      }

      const apiCall = isEdit
        ? editTournamentApi(finalTournamentId, payload)
        : addTournamentApi(payload);

      handleSubmit(apiCall, selectedListOfDomain);
    },
  });

  useEffect(() => {
    const selectedDomainIds = validation.values.domains.map(
      (domain: any) => domain.id
    );
    const filteredDomains = allDomainOptions.filter(
      (domain: any) => !selectedDomainIds.includes(domain.id)
    );
    setDomainOptions(filteredDomains);
  }, [validation.values.domains, allDomainOptions]);

  const handleSubmit = (api: any, selectedListOfDomain: any) => {
    api
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          toast.success(res?.message);
          navigate("/tournament/tournamentQuiz", {
            state: {
              selectedListOfDomain: selectedListOfDomain,
              tournamentId: res?.data?.id || finalTournamentId,
              tournamentName: res?.data?.title || validation.values.title,
            },
          });
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
      if (!file.type.startsWith(TournamentLabel.ImageTypeForTournament)) {
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
          setTournamentImage(reader.result);
          validation.setFieldValue("tournamentImage", reader.result);
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
              setUpdatedTournamentImage(uploadedFile);
              setTournamentImage(fileUrl);
              validation.setFieldValue("tournamentImage", uploadedFile);
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

  const handleCancel = () => {
    navigate("/tournament");
  };

  return (
    <div className="page-content pt-5 mt-4">
      <div className="flex-grow-1">
        <Row className="d-flex my-2 justify-content-between align-items-center py-2 overflow-x-hidden">
          <Col md={6}>
            <h5 className="ms-2 my-0">
              {isEdit
                ? TournamentUIConstants.EditTournament
                : TournamentUIConstants.AddTournament}
            </h5>
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
              {isEdit
                ? TournamentUIConstants.EditTournamentNavigate
                : TournamentUIConstants.AddTournamentNavigate}
            </span>
          </Col>
        </Row>
        <div className="card p-4">
          <Form id="tournamentForm" onSubmit={validation.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <BaseInput
                  label={TournamentUIConstants.TitleInputLabel}
                  name="title"
                  type="text"
                  placeholder={InputPlaceHolder(
                    TournamentUIConstants.TitleInputPlaceholder
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
                  label={TournamentUIConstants.StartDateTimeInputLabel}
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
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <BaseInput
                  label={TournamentUIConstants.EndDateTimeInputLabel}
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
              <Col md={6} className="mb-3">
                <MultiSelect
                  label={TournamentUIConstants.Domains}
                  name="domains"
                  isMulti={true}
                  options={domainOptions}
                  value={validation.values.domains}
                  onChange={(selectedOptions: any) => {
                    validation.setFieldValue("domains", selectedOptions ?? []);
                  }}
                  handleBlur={validation.handleBlur}
                  touched={validation.touched.domains}
                  error={validation.errors.domains}
                  required
                />
              </Col>
            </Row>

            <div>
              <p className="fw-medium">
                {TournamentUIConstants.TournamentImage}
                <span className="text-danger">*</span>
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-center mb-3">
              <div className="position-relative">
                <img
                  src={tournamentImage}
                  alt={TournamentUIConstants.DefaultTournamentImageAlt}
                  className="tournament-image-style"
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    (e.target as HTMLImageElement).src = DefaultTournamentImage;
                  }}
                />
                <Label
                  htmlFor="tournamentImage"
                  className="tournament-edit-image-button-style cursor-pointer"
                >
                  <FaEdit />
                </Label>
                <BaseInput
                  name="tournamentImage"
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            {validation.touched.tournamentImage &&
              typeof validation.errors.tournamentImage === "string" && (
                <div className="text-danger">
                  {validation.errors.tournamentImage}
                </div>
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

export default TournamentForm;
