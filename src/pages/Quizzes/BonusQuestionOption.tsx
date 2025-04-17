import BaseInput from "Components/Base/BaseInput";
import BaseRadioGroup from "Components/Base/BaseRadio";
import {
  DomainQuestionOptionUIConstants,
  QuestionOptions,
} from "Components/constants/DomainQuestion";
import { InputPlaceHolder } from "Components/constants/validation";
import { Col, Form, Input, Row } from "reactstrap";

const BonusQuestionOption = ({
  formik,
  selectedOption,
  setSelectedOption,
  correctOption,
  setCorrectOption,
}: any) => {
  const handleRadioChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <div className="d-flex gap-2 mt-2 align-items-center">
        <p className="pb-4 pb-sm-2">
          {DomainQuestionOptionUIConstants.Choises}
          <span className="text-danger">*</span>
        </p>
        <BaseRadioGroup
          name="choises"
          options={QuestionOptions}
          onChange={handleRadioChange}
          selectedValue={selectedOption}
          className="d-flex gap-2"
          classNameLabel="mx-2"
          optionClassName="d-flex gap-1"
        />
      </div>
      <Row className="g-3">
        <Col sm={6} className="d-flex align-items-center gap-2">
          <Input
            type="radio"
            name="correctOption"
            value="option1"
            onChange={() => setCorrectOption("A")}
            checked={correctOption === "A"}
            className="mt-1"
          />
          <div className="w-100 question-option-style">
            <BaseInput
              name="option1"
              label={DomainQuestionOptionUIConstants.Option1}
              type="text"
              placeholder={InputPlaceHolder(
                DomainQuestionOptionUIConstants.Option1
              )}
              onChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.option1 || ""}
              error={formik.errors.option1}
              touched={formik.touched.option1}
              required
            />
          </div>
        </Col>
        <Col sm={6} className="d-flex align-items-center gap-2">
          <Input
            type="radio"
            name="correctOption"
            value="option2"
            onChange={() => setCorrectOption("B")}
            checked={correctOption === "B"}
            className="mt-1"
          />
          <div className="w-100 question-option-style">
            <BaseInput
              name="option2"
              label={DomainQuestionOptionUIConstants.Option2}
              type="text"
              placeholder={InputPlaceHolder(
                DomainQuestionOptionUIConstants.Option2
              )}
              onChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.option2 || ""}
              error={formik.errors.option2}
              touched={formik.touched.option2}
              required
            />
          </div>
        </Col>
      </Row>
      {selectedOption === "4" && (
        <Row className="g-3">
          <Col sm={6} className="d-flex align-items-center gap-2">
            <Input
              type="radio"
              name="correctOption"
              value="option3"
              onChange={() => setCorrectOption("C")}
              checked={correctOption === "C"}
              className="mt-1"
            />
            <div className="w-100 question-option-style">
              <BaseInput
                name="option3"
                label={DomainQuestionOptionUIConstants.Option3}
                type="text"
                placeholder={InputPlaceHolder(
                  DomainQuestionOptionUIConstants.Option3
                )}
                onChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                value={formik.values.option3 || ""}
                error={formik.errors.option3}
                touched={formik.touched.option3}
                required
              />
            </div>
          </Col>
          <Col sm={6} className="d-flex align-items-center gap-2">
            <Input
              type="radio"
              name="correctOption"
              value="option4"
              onChange={() => setCorrectOption("D")}
              checked={correctOption === "D"}
              className="mt-1"
            />
            <div className="w-100 question-option-style">
              <BaseInput
                name="option4"
                label={DomainQuestionOptionUIConstants.Option4}
                type="text"
                placeholder={InputPlaceHolder(
                  DomainQuestionOptionUIConstants.Option4
                )}
                onChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                value={formik.values.option4 || ""}
                error={formik.errors.option4}
                touched={formik.touched.option4}
                required
              />
            </div>
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default BonusQuestionOption;
