import React from "react";
import { Navigate } from "react-router-dom";

import { AuthenticationLabel } from "Components/constants/Authentication";

const AuthProtected = (props : any) =>{
  const token = sessionStorage.getItem(AuthenticationLabel.Token);

  if (!token) {
    return (
      <React.Fragment>
        <Navigate to={{ pathname: "/login"}} />
      </React.Fragment>
    );
  }

  return <>{props.children}</>;
};


export default AuthProtected;
