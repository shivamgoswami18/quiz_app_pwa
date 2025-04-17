import { Label } from "reactstrap";
import Select from "react-select";

const colourStyles: any = {
  multiValueLabel: (styles: any, { data }: any) => ({
    ...styles,
    color: "#ffffff",
  }),
};

const BaseSelect = ({
  label,
  name,
  className,
  options,
  title,
  placeholder,
  required,
  handleChange,
  handleBlur,
  value,
  touched,
  error,
  isDisabled,
}: any) => {
  const selectedValue =
    options?.find((option: any) => option.value === value) || null;

  const handleChangeWrapper = (selectedOption: any) => {
    handleChange(name, selectedOption ? selectedOption.value : "");
  };
  return (
    <>
      {label && (
        <Label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-danger">*</span>}
        </Label>
      )}
      <Select
        name={name}
        id={name}
        title={title}
        className={className ? className : "select-border"}
        options={options?.length > 0 ? options : []}
        placeholder={placeholder}
        invalid={!!(error && touched)}
        value={selectedValue}
        isClearable
        onChange={handleChangeWrapper}
        onBlur={handleBlur}
        isInvalid={!!(touched && error)}
        isDisabled={isDisabled}
        data-test={`select-${name}`}
      />
      {touched && error ? (
        <div className="text-danger error-font">{error}</div>
      ) : null}
    </>
  );
};

const MultiSelect = ({
  label,
  value,
  isMulti,
  onChange,
  options,
  touched,
  error,
  name,
  handleBlur,
  className,
  isDisabled,
  required,
}: any) => {
  return (
    <>
      {label && (
        <Label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-danger">*</span>}
        </Label>
      )}
      <Select
        value={value}
        className={className ? className : "select-border"}
        isMulti={isMulti}
        onChange={onChange}
        options={options}
        styles={colourStyles}
        invalid={!!(error && touched)}
        name={name}
        onBlur={handleBlur}
        isInvalid={!!(touched && error)}
        isDisabled={isDisabled}
      />
      {touched && error ? (
        <div className="text-danger error-font">{error}</div>
      ) : null}
    </>
  );
};

export { BaseSelect, MultiSelect };
