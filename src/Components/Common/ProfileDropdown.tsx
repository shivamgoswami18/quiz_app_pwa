import React, { useState, useContext, useEffect } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { DataContext } from "Context/DataContext";
import { AuthenticationLabel } from "Components/constants/Authentication";
import {
  checkStatusCodeSuccess,
  commonLabel,
  DefaultProfileImage,
  DefaultProfileImageAlt,
  removeItem,
} from "Components/constants/common";
import { viewProfileApi } from "Api/AuthApi";
import { toast } from "react-toastify";
import DeleteModal from "Components/Base/DeleteModal";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const { userProfile, userNameValue, setUserProfile, setUserNameValue } =
    useContext(DataContext);
  const [loader, setLoader] = useState(false);
  const [isProfileDropdown, setIsProfileDropdown] = useState<boolean>(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate = useNavigate();
  const logoutHandler = () => {
    removeItem(AuthenticationLabel.Token);
    removeItem(AuthenticationLabel.AdminId);
    navigate("/login");
    toast.success(AuthenticationLabel.YouAreLogoutSuccessfully);
    setLogoutModal(false);
  };

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     setLoader(true);
  //     await viewProfileApi()
  //       .then((res: any) => {
  //         const message = res?.message;
  //         if (checkStatusCodeSuccess(res?.statusCode)) {
  //           setUserNameValue(res?.data?.name);
  //           const fileUrl = `${process.env.REACT_APP_FILE_BASE_URL}${res?.data?.profile_image}`;
  //           setUserProfile(fileUrl);
  //           toast.success(message);
  //         } else {
  //           toast.error(message);
  //         }
  //       })
  //       .catch((err) => {
  //         const errorMessage = err?.response?.data?.message || err?.message;
  //         toast.error(errorMessage);
  //       })
  //       .finally(() => {
  //         setLoader(false);
  //       });
  //   };

  //   fetchProfile();
  // }, []);

  return (
    <>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn shadow-none">
          <span className="d-flex align-items-center">
            <img
              src={userProfile}
              alt={DefaultProfileImageAlt}
              className="rounded-circle header-profile-user"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                (e.target as HTMLImageElement).src = DefaultProfileImage;
              }}
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {`${
                  userNameValue
                    ? userNameValue
                    : AuthenticationLabel.FounderInProfileDropDown
                }`}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                {AuthenticationLabel.AdminInProfileDropDown}
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">
            {AuthenticationLabel.WelcomeMessageInProfileDropDown}{" "}
            {`${
              userNameValue
                ? userNameValue
                : AuthenticationLabel.FounderInProfileDropDown
            }`}
            !
          </h6>
          {/* Temporary commented code */}
          {/* <DropdownItem href={process.env.PUBLIC_URL + "/profile"}>
            <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">
              {AuthenticationLabel.ProfileMenuInProfileDropDown}
            </span>
          </DropdownItem> */}
          <DropdownItem href={process.env.PUBLIC_URL + "/change-password"}>
            <i className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">
              {AuthenticationLabel.ChangePasswordMenuInProfileDropDown}
            </span>
          </DropdownItem>
          <DropdownItem onClick={() => setLogoutModal(true)}>
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle" data-key="t-logout">
              {AuthenticationLabel.LogoutMenuInProfileDropDown}
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <DeleteModal
        open={logoutModal}
        toggle={() => setLogoutModal(false)}
        title={AuthenticationLabel.LogoutMenuInProfileDropDown}
        submit={() => logoutHandler()}
        closeLabel={commonLabel.No}
        submitLabel={commonLabel.Yes}
        closeLabelColor="danger"
        submitLabelColor="info"
      >
        <p>{AuthenticationLabel.AreYouSureYouWantToLogout}</p>
      </DeleteModal>
    </>
  );
};

export default ProfileDropdown;
