import React, { useEffect, useRef } from "react";
import { Badge, Label } from "reactstrap";

interface BaseCheckboxProps {
  id: string;
  label: React.ReactNode;
  name?: string;
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  badge?: React.ReactNode;
  badgeClassName?: string;
  color?: string;
  disabled?: boolean;
}

const BaseCheckbox: React.FC<BaseCheckboxProps> = ({
  id,
  label,
  name,
  checked = false,
  indeterminate = false,
  onChange = () => {},
  onClick = () => {},
  className = "",
  checkboxClassName = "",
  color,
  labelClassName = "",
  badge = null,
  badgeClassName = "",
  disabled = false,
  ...props
}) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={`form-check form-check-${color} ${className}`}>
      <input
        name={name}
        id={id}
        type="checkbox"
        ref={checkboxRef}
        className={`me-2 form-check-input shadow-none ${checkboxClassName}`}
        checked={checked}
        onChange={onChange}
        onClick={onClick}
        disabled={disabled}
        {...props}
      />
      <Label className={`mb-0 ${labelClassName}`} htmlFor={id}>
        {label}
      </Label>
      {badge !== undefined && (
        <Badge className={`ms-2 ${badgeClassName}`} color="primary">
          {badge}
        </Badge>
      )}
    </div>
  );
};

export default BaseCheckbox;
