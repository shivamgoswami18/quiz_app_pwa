import { useState } from "react";
import { Card, CardBody, Col, Container, Row, Form } from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import logo from "../../assets/images/logo-secondary.png";
import { checkStatusCodeSuccess, errorHandler, setItem } from "Components/constants/common";
import {
  emailRegex,
  InputPlaceHolder,
  validationMessages,
} from "Components/constants/validation";
import { loginApi } from "Api/AuthApi";
import { toast } from "react-toastify";
import BaseInput from "Components/Base/BaseInput";
import BaseButton from "Components/Base/BaseButton";
import { AuthenticationLabel } from "Components/constants/Authentication";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [btnLoader, setBtnLoader] = useState<boolean>(false);
  const navigate = useNavigate();

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required(validationMessages.required(AuthenticationLabel.Email))
        .matches(
          emailRegex,
          validationMessages.format(AuthenticationLabel.Email)
        ),
      password: Yup.string().required(
        validationMessages.required(AuthenticationLabel.Password)
      ),
    }),
    onSubmit: (values) => {
      setBtnLoader(true);
      const payload = {
        email: values.email,
        password: values.password,
        role: "Admin",
      };
      loginApi(payload)
        .then((res: any) => {
          const message = res?.message;
          const tokenData = res?.data?.token;
          if (checkStatusCodeSuccess(res?.statusCode)) {
            toast.success(message);
            const decodedToken: { id: string } = jwtDecode(tokenData);
            setItem(AuthenticationLabel.AdminId, decodedToken?.id);
            let tokenName = AuthenticationLabel.Token;
            let tokenValue = tokenData;
            setItem(tokenName, tokenValue);
            navigate("/dashboard");
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

  document.title = AuthenticationLabel.AuthePageTitle;

  return (
    <ParticlesAuth>
      <div className="auth-page-content mt-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4 rounded-4">
                <CardBody className="p-4">
                  <div className="text-center mt-1">
                    <a className="d-inline-block auth-logo" href="/">
                      <img src={logo} alt="logo" height="60" />
                    </a>
                    <h5 className="text-gray mt-1">
                      {AuthenticationLabel.WelcomeMessage}
                    </h5>
                  </div>
                  <div className="p-2 mt-2">
                    <Form onSubmit={validation.handleSubmit}>
                      <div className="mb-3">
                        <BaseInput
                          name="email"
                          label={AuthenticationLabel.AuthEmailInputLabel}
                          type="email"
                          placeholder={InputPlaceHolder(
                            AuthenticationLabel.AuthEmailInputPlaceholder
                          )}
                          onChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          error={validation.errors.email}
                          touched={validation.touched.email}
                          required
                        />
                      </div>
                      <div className="mb-3 position-relative">
                        <BaseInput
                          name="password"
                          value={validation.values.password || ""}
                          label={AuthenticationLabel.AuthPasswordInputLabel}
                          type="password"
                          placeholder={InputPlaceHolder(
                            AuthenticationLabel.AuthPasswordInputPlaceholder
                          )}
                          onChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          error={validation.errors.password}
                          touched={validation.touched.password}
                          required
                        />
                      </div>
                      <div className="mt-4">
                        <BaseButton
                          color="success"
                          className="btn btn-info w-100"
                          type="submit"
                          loader={btnLoader}
                          label={AuthenticationLabel.SignIn}
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
    </ParticlesAuth>
  );
};

export default Login;
