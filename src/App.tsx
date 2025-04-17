import React from "react";
import "./assets/scss/themes.scss";
import Route from "./Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <React.Fragment>
      <ToastContainer />
      <Route />
    </React.Fragment>
  );
}

export default App;