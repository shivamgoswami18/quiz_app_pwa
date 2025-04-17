import React, { ReactElement } from "react";
import { Spinner } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";

interface BaseLoaderProps {
  type?: "border" | "grow";
  size?: string;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  className?: string;
  children?: ReactElement;
}

const Loader: React.FC<BaseLoaderProps> = ({
  type,
  size,
  color,
  className,
}) => {
  return (
    <React.Fragment>
      <div className="loader-container">
        <div className="loader-background" />
        <div className="loader-content">
          <Spinner className={className} type={type} color={color} size={size}>
            Loading...
          </Spinner>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Loader;
