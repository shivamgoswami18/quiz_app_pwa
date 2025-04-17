import React, { useContext, useEffect, useState } from "react";
import { Container, Card, CardBody, Form, Row, Col, Spinner } from "reactstrap";
import { FaEdit } from "react-icons/fa";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  checkStatusCodeSuccess,
  DefaultProfileImage,
  DefaultProfileImageAlt,
} from "Components/constants/common";
import "../../Styles/Profile.css";
import BaseInput from "Components/Base/BaseInput";
import { editProfileApi, fileUploadApi, viewProfileApi } from "Api/AuthApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BaseButton from "Components/Base/BaseButton";
import {
  emailRegex,
  fileLimitErrorMessage,
  fileTypeImagerrorMessage,
  InputPlaceHolder,
  numberRegex,
  validationMessages,
} from "Components/constants/validation";
import { DataContext } from "Context/DataContext";
import { AuthenticationLabel } from "Components/constants/Authentication";
import Loader from "Components/Base/BaseLoader";
import "../../Styles/Profile.css";

const Profile = () => {
  const { setUserProfile, setUserNameValue } = useContext(DataContext);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [avatar, setAvatar] = useState("");
  const [updatedAvatar, setUpdatedAvatar] = useState<string>("");

  useEffect(() => {
    if (updatedAvatar) {
      const fileUrl = `${process.env.REACT_APP_FILE_BASE_URL}${updatedAvatar}`;
      setAvatar(fileUrl); // Update the profile with the new file URL
    }
  }, [avatar]); // This effect runs when avatar changes

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith(AuthenticationLabel.ImageTypeForAdminProfile)) {
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
          setAvatar(reader.result); // Preview the selected image
        }
      };
      reader.readAsDataURL(file);

      setLoader(true);
      // Prepare FormData for file upload
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
              setUpdatedAvatar(uploadedFile);
              setAvatar(fileUrl);
            }
          } else {
            toast.error(message);
          }
        })
        .catch((err) => {
          const errorMessage = err?.response?.data?.message || err?.message;
          toast.error(errorMessage);
        })
        .finally(() => {
          setLoader(false);
        });
    }
  };

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     setLoader(true);
  //     await viewProfileApi()
  //       .then((res: any) => {
  //         const message = res?.message;
  //         if (checkStatusCodeSuccess(res?.statusCode)) {
  //           setUserData(res?.data);
  //           setUserNameValue(res?.data?.name);
  //           const fileUrl = `${process.env.REACT_APP_FILE_BASE_URL}${res?.data?.profile_image}`;
  //           setUserProfile(fileUrl);
  //           setAvatar(
  //             res?.data?.profile_image
  //               ? `${process.env.REACT_APP_FILE_BASE_URL}${res?.data?.profile_image}`
  //               : DefaultProfileImage
  //           );
  //           toast.success(message);
  //         } else {
  //           toast.error(message);
  //         }
  //       })
  //       .catch((err) => {
  //         const errorMessage = err?.response?.data?.message || err?.message;
  //         toast.error(errorMessage);
  //       })
  //       .finally(() => {
  //         setLoader(false);
  //       });
  //   };

  //   fetchProfile();
  // }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      phone: userData?.contact_no || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(
        validationMessages.required(
          AuthenticationLabel.ValidationPlaceholderAdminNameValue
        )
      ),
      email: Yup.string()
        .required(
          validationMessages.required(
            AuthenticationLabel.ValidationPlaceholderAdminEmailValue
          )
        )
        .matches(
          emailRegex,
          validationMessages.format(
            AuthenticationLabel.ValidationPlaceholderAdminEmailValue
          )
        ),
      phone: Yup.string()
        .required(
          validationMessages.required(
            AuthenticationLabel.ValidationPlaceholderAdminPhoneNumberValue
          )
        )
        .matches(
          numberRegex,
          validationMessages.contactLength(
            AuthenticationLabel.ValidationPlaceholderAdminPhoneNumberValue,
            10
          )
        ),
    }),
    onSubmit: async (values) => {
      setBtnLoader(true);
      const formData = new FormData();
      formData.append(AuthenticationLabel.NameForFormData, values.name);
      formData.append(AuthenticationLabel.PhoneForFormData, values.phone);
      if (updatedAvatar) {
        formData.append(AuthenticationLabel.AvatarForFormData, updatedAvatar);
      }

      await editProfileApi(formData)
        .then((res: any) => {
          const message = res?.message;
          if (checkStatusCodeSuccess(res?.statusCode)) {
            toast.success(message);
            if (updatedAvatar) {
              const fileUrl = `${process.env.REACT_APP_FILE_BASE_URL}${updatedAvatar}`;
              setUserProfile(fileUrl);
            }
            setUserNameValue(values?.name);
            navigate("/dashboard");
            setUpdatedAvatar("");
          } else {
            toast.error(message);
          }
        })
        .catch((err) => {
          const errorMessage = err?.response?.data?.message || err?.message;
          toast.error(errorMessage);
        })
        .finally(() => {
          setBtnLoader(false);
        });
    },
  });

  document.title = AuthenticationLabel.ProfilePageTitle;

  return (
    <div
      className={`auth-page-content content-center-profile-style ${
        Object.keys(validation.errors).length > 0
          ? "content-center-profile-margin-style"
          : ""
      }`}
    >
      <Container className="container-box justify-content-center align-items-center d-flex flex-column">
        <Row className="justify-content-center">
          <Col>
            <Card className="profile-card-style">
              <CardBody className="p-4">
                <div className="text-center mt-2">
                  <h5 className="text-info fs-4">
                    {AuthenticationLabel.AdminProfileHeading}
                  </h5>
                </div>
                <div className="p-2">
                  <Form onSubmit={validation.handleSubmit} className="form-box">
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="position-relative w-25">
                        <img
                          src={avatar}
                          alt={DefaultProfileImageAlt}
                          className="rounded-circle img-thumbnail admin-image-style"
                          onError={(
                            e: React.SyntheticEvent<HTMLImageElement, Event>
                          ) => {
                            (e.target as HTMLImageElement).src =
                              DefaultProfileImage;
                          }}
                        />
                        <label
                          htmlFor="imageUpload"
                          className="position-absolute bottom-0 end-0 cursor-pointer bg-white p-1 rounded-circle d-flex justify-content-center align-items-center"
                        >
                          <FaEdit />
                        </label>
                        <input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          className="d-none"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>

                    {/* Name Field */}
                    <div className="mb-3">
                      <BaseInput
                        name="name"
                        label={AuthenticationLabel.AdminNameLabel}
                        type="text"
                        placeholder={InputPlaceHolder(
                          AuthenticationLabel.AdminNamePlaceholderValue
                        )}
                        onChange={validation.handleChange}
                        handleBlur={validation.handleBlur}
                        value={validation.values.name || ""}
                        error={validation.errors.name}
                        touched={validation.touched.name}
                        required
                      />
                    </div>

                    {/* Email Field */}
                    <div className="mb-3">
                      <BaseInput
                        name="email"
                        label={AuthenticationLabel.AdminEmailLabel}
                        type="email"
                        placeholder={InputPlaceHolder(
                          AuthenticationLabel.AdminEmailPlaceholderValue
                        )}
                        value={validation.values.email || ""}
                        disabled
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="mb-3">
                      <BaseInput
                        name="phone"
                        label={AuthenticationLabel.AdminPhoneNumberLabel}
                        type="number"
                        placeholder={InputPlaceHolder(
                          AuthenticationLabel.AdminPhoneNumberPlaceholderValue
                        )}
                        onChange={validation.handleChange}
                        handleBlur={validation.handleBlur}
                        value={validation.values.phone || ""}
                        error={validation.errors.phone}
                        touched={validation.touched.phone}
                        maxLength={10}
                        required
                      />
                    </div>

                    <div className="text-center mt-4">
                      <BaseButton
                        color="info"
                        className="btn btn-info w-100"
                        type="submit"
                        loader={btnLoader}
                        disable={
                          !validation.dirty && !updatedAvatar // Enable only if fields or image are updated
                        }
                        label={AuthenticationLabel.UpdateButton}
                      />
                    </div>
                  </Form>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {loader && (
          <div className="full-screen-loader">
            <Loader color="success" />
          </div>
        )}
      </Container>
    </div>
  );
};

export default Profile;
