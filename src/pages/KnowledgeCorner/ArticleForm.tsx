import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { articleAddApi, articleEditApi, articleViewApi } from "Api/Knowledge";
import {
  checkStatusCodeSuccess,
  commonLabel,
  DefaultProfileImageAlt,
  errorHandler,
} from "Components/constants/common";
import { toast } from "react-toastify";
import {
  KnowledgeLabel,
  KnowledgeUIConstants,
} from "Components/constants/KnowledgeCorner";
import BaseInput from "Components/Base/BaseInput";
import { BaseSelect } from "Components/Base/BaseSelect";
import { Col, Form, Label, Row } from "reactstrap";
import BaseButton from "Components/Base/BaseButton";
import {
  fileLimitErrorMessage,
  fileTypeImagerrorMessage,
  FindWord,
  InputPlaceHolder,
  SelectPlaceHolder,
  validationMessages,
} from "Components/constants/validation";
import Loader from "Components/Base/BaseLoader";
import { domainListApi } from "Api/QuizDomain";
import { FaEdit } from "react-icons/fa";
import { fileUploadApi } from "Api/AuthApi";
import DefaultArticleImage from "../../assets/images/file.png";

const ArticleForm = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [btnLoader, setBtnLoader] = useState<boolean>(false);
  const [articleData, setArticleData] = useState<any>(null);
  const navigate = useNavigate();
  const { articleId } = useParams();
  const isEdit = Boolean(articleId);
  const [domainOptions, setDomainOptions] = useState<Array<any>>([]);
  const location = useLocation();
  const urlPath = location.pathname;
  const isView = FindWord(KnowledgeLabel.View, urlPath);
  const [articleImage, setArticleImage] = useState("");
  const [updatedArticleImage, setUpdatedArticleImage] = useState<string>("");

  useEffect(() => {
    if (updatedArticleImage) {
      const fileUrl = `${process.env.REACT_APP_FILE_BASE_URL}${updatedArticleImage}`;
      setArticleImage(fileUrl);
    }
  }, [articleImage]);

  const fetchArticleData = () => {
    setLoader(true);
    articleViewApi(String(articleId))
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          setArticleData(res?.data);
          const fileUrl = `${process.env.REACT_APP_FILE_BASE_URL}${res?.data?.image}`;
          setArticleImage(res?.data?.image ? fileUrl : DefaultArticleImage);
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
      fetchArticleData();
    }
    fetchDomainList();
  }, [isEdit, articleId]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: articleData?.title || "",
      description: articleData?.description || "",
      domain: articleData?.domain?.name || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(
        validationMessages.required(KnowledgeLabel.ArticleTitle)
      ),
      description: Yup.string().required(
        validationMessages.required(KnowledgeLabel.ArticleDescription)
      ),
      domain: Yup.string().required(
        validationMessages.required(KnowledgeLabel.Domain)
      ),
    }),
    onSubmit: (values) => {
      setBtnLoader(true);
      const selectedDomain = domainOptions?.filter(
        (item: any) => item?.label === values?.domain
      );

      const formData = new FormData();
      formData.append(KnowledgeLabel.Title, values?.title);
      formData.append(KnowledgeLabel.Description, values?.description);
      formData.append(KnowledgeLabel.DomainId, selectedDomain[0]?.id);
      if (updatedArticleImage) {
        formData.append(KnowledgeLabel.Image, updatedArticleImage);
      }

      const apiCall = isEdit
        ? articleEditApi(String(articleId), formData)
        : articleAddApi(formData);
      handleSubmit(apiCall);
    },
  });

  const handleSubmit = (api: any) => {
    api
      .then((res: any) => {
        if (checkStatusCodeSuccess(res?.statusCode)) {
          toast.success(res?.message);
          navigate("/knowledge-corner");
          setUpdatedArticleImage("");
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
      if (!file.type.startsWith(KnowledgeLabel.ImageTypeForAdminProfile)) {
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
          setArticleImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setLoader(true);
      const formData = new FormData();
      formData.append("files", file);

      await fileUploadApi(formData)
        .then((res: any) => {
          const message = res?.message;
          if (checkStatusCodeSuccess(res?.statusCode)) {
            toast.success(message);
            const uploadedFile = res?.data?.[0]?.file;
            if (uploadedFile) {
              const fileUrl = `${process.env.REACT_APP_FILE_BASE_URL}${uploadedFile}`;
              setUpdatedArticleImage(uploadedFile);
              setArticleImage(fileUrl);
            }
          } else {
            toast.error(message);
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
    navigate("/knowledge-corner");
  };

  return (
    <div className="page-content pt-5 mt-4">
      <div className="flex-grow-1">
        <Row className="d-flex my-3 justify-content-between align-items-center overflow-x-hidden">
          <Col md={6}>
            <h5 className="my-0">
              {(() => {
                if (isView) return KnowledgeUIConstants.ViewArticle;
                if (isEdit) return KnowledgeUIConstants.EditArticle;
                return KnowledgeUIConstants.AddArticle;
              })()}
            </h5>
          </Col>
          <Col
            md={6}
            className="mt-2 mt-md-0 d-flex justify-content-start mx-2 justify-content-md-end mx-md-0"
          >
            <span className="d-flex align-items-center">
              <a className="text-dark" href="/knowledge-corner">
                {KnowledgeUIConstants.KnowledgeNavigate}
              </a>
              <i className="mdi mdi-chevron-right text-top"></i>
              {(() => {
                if (isView) {
                  return KnowledgeUIConstants.ViewKnowledgeNavigate;
                } else if (isEdit) {
                  return KnowledgeUIConstants.EditKnowledgeNavigate;
                } else {
                  return KnowledgeUIConstants.AddKnowledgeNavigate;
                }
              })()}
            </span>
          </Col>
        </Row>
        <div className="card p-4">
          <Form onSubmit={validation.handleSubmit}>
            <div className="d-flex align-items-center justify-content-center mb-3">
              <div className="position-relative">
                <img
                  src={articleImage}
                  alt={DefaultProfileImageAlt}
                  className="article-image-style"
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    (e.target as HTMLImageElement).src = DefaultArticleImage;
                  }}
                />
                {!isView && (
                  <>
                    <Label
                      htmlFor="imageUpload"
                      className="article-edit-image-button-style"
                    >
                      <FaEdit />
                    </Label>
                    <BaseInput
                      name="imageUpload"
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={handleImageChange}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="mb-3">
              <BaseInput
                label={KnowledgeUIConstants.ArticleTitleInputLabel}
                name="title"
                type="text"
                placeholder={InputPlaceHolder(
                  KnowledgeUIConstants.ArticleTitleInputPlaceholder
                )}
                onChange={validation.handleChange}
                handleBlur={validation.handleBlur}
                value={validation.values.title || ""}
                error={validation.errors.title}
                touched={validation.touched.title}
                disabled={isView}
                required
              />
            </div>

            <div className="mb-3">
              <BaseInput
                label={KnowledgeUIConstants.ArticleDescriptionInputLabel}
                name="description"
                type="textarea"
                rows={4}
                placeholder={InputPlaceHolder(
                  KnowledgeUIConstants.ArticleDescriptionInputPlaceholder
                )}
                onChange={validation.handleChange}
                handleBlur={validation.handleBlur}
                value={validation.values.description || ""}
                error={validation.errors.description}
                touched={validation.touched.description}
                disabled={isView}
                required
              />
            </div>

            <div className="mb-3">
              <BaseSelect
                label={KnowledgeUIConstants.DomainInputLabel}
                name="domain"
                placeholder={SelectPlaceHolder(
                  KnowledgeUIConstants.DomainSelectPlaceholder
                )}
                options={domainOptions}
                handleChange={handleChange}
                handleBlur={validation.handleBlur}
                value={validation.values.domain}
                error={validation.errors.domain}
                touched={validation.touched.domain}
                isDisabled={isView}
                required
              />
            </div>

            <div className="d-flex justify-content-end gap-1">
              <div>
                <BaseButton
                  type="submit"
                  color="info"
                  label={isEdit ? commonLabel.Update : commonLabel.Submit}
                  disable={
                    isEdit ? !validation.dirty && !updatedArticleImage : false
                  }
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

export default ArticleForm;
