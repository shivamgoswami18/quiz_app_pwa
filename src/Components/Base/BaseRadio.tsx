import React from "react";
import { FormGroup, Input, Label, FormFeedback } from "reactstrap";

interface Option {
  id: string;
  value: string | number;
  label: string;
  labelSuffix?: string;
}

interface BaseRadioGroupProps {
  name: string;
  options: Option[];
  className?: string;
  optionClassName?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedValue: string | number;
  classNameSuffix?: string;
  touched?: boolean;
  error?: string;
  handleBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  classNameLabel?: string;
}

const BaseRadioGroup: React.FC<BaseRadioGroupProps> = ({
  name,
  options,
  className = "",
  optionClassName = "",
  onChange,
  selectedValue,
  classNameSuffix = "",
  touched,
  error,
  handleBlur,
  classNameLabel = "",
}) => {
  return (
    <FormGroup className={className}>
      {options?.map((option) => (
        <div
          className={`radio radio-primary ${optionClassName}`}
          key={option.id}
        >
          <Input
            id={option.id}
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={onChange}
            onBlur={handleBlur}
            invalid={Boolean(touched && error)}
          />
          <Label for={option.id} className={classNameLabel}>
            {option.label}
            {option.labelSuffix && (
              <span className={`radio-suffix ${classNameSuffix}`}>
                {" "}
                {option.labelSuffix}
              </span>
            )}
          </Label>
        </div>
      ))}
      {touched && error && (
        <FormFeedback className="d-block errorRadio">{error}</FormFeedback>
      )}
    </FormGroup>
  );
};

export default BaseRadioGroup;
