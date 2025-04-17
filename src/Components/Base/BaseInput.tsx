import React, { useState } from "react";
import {
  FormFeedback,
  Input,
  InputGroup,
  InputGroupText,
  Label,
} from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { InputType } from "reactstrap/types/lib/Input";

interface BaseInputProps {
  autoComplete?: string;
  className?: string;
  defaultValue?: any;
  disabled?: boolean;
  error?: any;
  fullWidth?: boolean;
  label?: string;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  type?: string;
  accept?: string;
  value?: any;
  prepend?: any;
  append?: any;
  tooltip?: any;
  tooltipIcon?: string;
  tooltipIconColor?: string;
  tooltipText?: string;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  touched?: any;
  maxLength?: number;
  rows?: number
}

const BaseInput: React.FC<BaseInputProps> = ({
  autoComplete,
  className,
  defaultValue,
  disabled,
  error,
  fullWidth,
  name,
  onChange,
  placeholder,
  label,
  readOnly,
  required,
  type,
  value,
  tooltip,
  tooltipIcon,
  tooltipIconColor,
  tooltipText,
  accept,
  append,
  handleBlur,
  prepend,
  touched,
  maxLength,
  rows,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Tab",
      ".",
    ];
    if (type === "number" && ["e", "E", "+", "-"].includes(event.key)) {
      event.preventDefault();
    }
    if (type === "number" && event.code === "Space") {
      event.preventDefault();
    }
    if (type === "email" && event.code === "Space") {
      event.preventDefault();
    }
    if (
      type === "number" &&
      !allowedKeys.includes(event.key) &&
      !event.key.match(/^[0-9]$/)
    ) {
      event.preventDefault();
    }

    if (
      type === "number" &&
      maxLength &&
      value?.toString().length >= maxLength
    ) {
      const isEditing = allowedKeys.includes(event.key); // Allow backspace, delete, etc.
      if (!isEditing) {
        event.preventDefault();
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`text-start ${fullWidth ? "w-100" : ""}`}>
      {label && (
        <>
          <Label for={name}>
            {label}
            {required && <span className="text-danger">*</span>}
          </Label>
          {tooltip && (
            <i
              className={`mdi mdi-${tooltipIcon} ms-1 text-${tooltipIconColor} cursor-pointer tooltip-container`}
            >
              <span className="tooltip-text bottom-5 mt-4">{tooltipText}</span>
            </i>
          )}
        </>
      )}
      <InputGroup>
        {prepend && <InputGroupText>{prepend}</InputGroupText>}
        <Input
          id={name}
          name={name}
          className={`${className} shadow-none`}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          disabled={disabled}
          invalid={!!(error && touched)}
          placeholder={placeholder}
          accept={accept}
          onKeyDown={handleKeyInput}
          readOnly={readOnly}
          onBlur={handleBlur}
          maxLength={type !== "number" ? maxLength : undefined}
          type={
            type === "password"
              ? showPassword
                ? "text"
                : "password"
              : (type as InputType)
          }
          value={value}
          onChange={onChange}
          rows={rows}
          data-test={`input-${name}`}
        />
        {append && (
          <InputGroupText>
            <span className="input-group-text">{append}</span>
          </InputGroupText>
        )}
        {type === "password" && (
          <InputGroupText
            onClick={handleClickShowPassword}
            style={{ cursor: "pointer" }}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </InputGroupText>
        )}
        {error && touched && <FormFeedback>{error}</FormFeedback>}
      </InputGroup>
    </div>
  );
};

export default BaseInput;
