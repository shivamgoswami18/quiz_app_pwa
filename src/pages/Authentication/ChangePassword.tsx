import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Container, Card, CardBody, Row, Col, Form } from "reactstrap";
import BaseInput from "Components/Base/BaseInput";
import { checkStatusCodeSuccess, errorHandler } from "Components/constants/common";
import {
  InputPlaceHolder,
  passwordRegex,
  validationMessages,
} from "Components/constants/validation";
import BaseButton from "Components/Base/BaseButton";
import "../../Styles/ChangePassword.css";
import { changePasswordApi } from "Api/AuthApi";
import { toast } from "react-toastify";
import { AuthenticationLabel } from "Components/constants/Authentication";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [btnLoader, setBtnLoader] = useState<boolean>(false);

  const validation: any = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required(
        validationMessages.required(
          AuthenticationLabel.ValidationPlaceholderCurrentPasswordValue
        )
      ),
      newPassword: Yup.string()
        .required(
          validationMessages.required(
            AuthenticationLabel.ValidationPlaceholderNewPasswordValue
          )
        )
        .min(
          8,
          validationMessages.passwordLength(
            AuthenticationLabel.PasswordNameForLength,
            AuthenticationLabel.PasswordLengthForLength
          )
        )
        .matches(
          passwordRegex,
          validationMessages.passwordComplexity(
            AuthenticationLabel.PasswordNameForComplexity
          )
        ),
      confirmPassword: Yup.string()
        .required(
          validationMessages.required(
            AuthenticationLabel.ValidationPlaceholderConfirmNewPasswordValue
          )
        )
        .oneOf(
          [Yup.ref(AuthenticationLabel.NewPasswordMatchingName)],
          validationMessages.passwordsMatch(
            AuthenticationLabel.NewPasswordShouldMatchProp,
            AuthenticationLabel.ConfirmNewPasswordShouldMatchProp
          )
        ),
    }),
    onSubmit: (values) => {
      setBtnLoader(true);
      const payload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };
      changePasswordApi(payload)
        .then((res: any) => {
          const message = res?.message;
          if (checkStatusCodeSuccess(res?.statusCode)) {
            toast.success(message);
            navigate("/login");
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
    },
  });

  document.title = AuthenticationLabel.ChangePasswordPageTitle;

  return (
    <div className="page-content">
      <div className="d-flex justify-content-end">
        <BaseButton
          className="rounded-2"
          onClick={() => navigate("/dashboard")}
        >
          <i className="mdi mdi-arrow-left"></i>
        </BaseButton>
      </div>
      <Container className="container-box justify-content-center align-items-center d-flex flex-column">
        <Row className="justify-content-center">
          <Col>
            <Card className="change-password-card-style">
              <CardBody className="p-4">
                <div className="text-center mt-2">
                  <h5 className="text-info fs-4">
                    {AuthenticationLabel.ChangePasswordHeading}
                  </h5>
                </div>
                <div className="p-2">
                  <Form onSubmit={validation.handleSubmit}>
                    <div className="mb-3 position-relative">
                      <BaseInput
                        name="currentPassword"
                        label={AuthenticationLabel.CurrentPasswordLabel}
                        type="password"
                        placeholder={InputPlaceHolder(
                          AuthenticationLabel.CurrentPasswordPlaceholderValue
                        )}
                        onChange={validation.handleChange}
                        handleBlur={validation.handleBlur}
                        value={validation.values.currentPassword || ""}
                        error={validation.errors.currentPassword}
                        touched={validation.touched.currentPassword}
                        required
                      />
                    </div>
                    <div className="mb-3 position-relative">
                      <BaseInput
                        name="newPassword"
                        label={AuthenticationLabel.NewPasswordLabel}
                        type="password"
                        placeholder={InputPlaceHolder(
                          AuthenticationLabel.NewPasswordPlaceholderValue
                        )}
                        onChange={validation.handleChange}
                        handleBlur={validation.handleBlur}
                        value={validation.values.newPassword || ""}
                        error={validation.errors.newPassword}
                        touched={validation.touched.newPassword}
                        required
                      />
                    </div>
                    <div className="mb-3 position-relative">
                      <BaseInput
                        name="confirmPassword"
                        label={AuthenticationLabel.ConfirmNewPasswordLabel}
                        type="password"
                        placeholder={InputPlaceHolder(
                          AuthenticationLabel.ConfirmNewPasswordPlaceholderValue
                        )}
                        onChange={validation.handleChange}
                        handleBlur={validation.handleBlur}
                        value={validation.values.confirmPassword || ""}
                        error={validation.errors.confirmPassword}
                        touched={validation.touched.confirmPassword}
                        required
                      />
                    </div>
                    <div className="mt-4">
                      <BaseButton
                        color="success"
                        className="btn btn-info w-100"
                        type="submit"
                        loader={btnLoader}
                        label={AuthenticationLabel.ChangePasswordButton}
                      />
                    </div>
                  </Form>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChangePassword;
