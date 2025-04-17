import React from "react";
import { Button, Spinner } from "reactstrap";

interface BaseButtonProps {
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "info"
    | "warning"
    | "link"
    | "light";
  label?: string;
  type?: "button" | "reset" | "submit";
  children?: React.ReactNode;
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
  disable?: boolean;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  loader?: boolean;
  dataTest?: string;
  divClass?: string;
}

const BaseButton: React.FC<BaseButtonProps> = ({
  color,
  label,
  type,
  onClick,
  disable,
  className,
  startIcon,
  endIcon,
  size,
  loader,
  children,
  dataTest,
  divClass
}) => {
  const dataTestProp = `button-${label ? label.replace(/\s+/g, "-").toLowerCase() : type}`
  return (
    <div className={divClass}>
      <Button
        color={color}
        type={type}
        onClick={onClick}
        disabled={disable || loader}
        className={className}
        size={size}
        data-test={dataTest || dataTestProp}
      >
        {loader ? <Spinner size="sm" /> : label || children}
        {startIcon && <span className="me-2">{startIcon}</span>}
        {endIcon && <span className="ms-2">{endIcon}</span>}
      </Button>
    </div>
  );
};

export default BaseButton;
