import { StatusCodes } from "http-status-codes";
import { useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Tooltip } from "reactstrap";

export const checkStatusCodeSuccess = (data: any) => {
  if(data === StatusCodes.OK || data === StatusCodes.ACCEPTED || data === StatusCodes.CREATED || data === 201 || data === 200 || data === 'Success'){
    return true;
  }
  else {
    return false;
  };
};

export const notFound = {
  dataNotFound: "Sorry! No Result Found",
  nullData: "---",
  notAvailable: "NA",
  somethingWrong: "Something went wrong.",
  thereIsNoDataFound: "No data found, Please try again!",
  trySearchingWithAnotherKeyword: "Try searching with another keyword!",
};

export const commonLabel = {
  Submit: "Submit",
  Update: "Update",
  Cancel: "Cancel",
  View: "View",
  New: "New",
  Edit: "Edit",
  Delete: "Delete",
  Remove: "Remove",
  Active: "Active",
  Inactive: "Inactive",
  Activate: "Activate",
  Inactivate: "Inactivate",
  Status: "Status",
  Yes: "Yes",
  No: "No",
  Close:  "Close",
  Search: "Search",
  Action: "Actions",
  Enter: "Enter",
  ItemsPerPage: "Items per page",
  Showing: "Showing",
  of: "of",
  Results: "Results",
  to: "to",
  Loading: "Loading...",
  Select:"Select",
  DeleteConfirmation: "Do you want to delete the record?",
  Approve: "Approve",
  Reject: "Reject",
  Private: "Private",
  Pending: "Pending",
  Rejected: "Rejected",
  NA: "NA",
  Are_You_Sure_You_Want_To_Update_The_Status: "Are you sure you want to update the status?",
  Is_Greater: "is-greater",
  Min_Duration: "min-duration",
  Publish: "Publish",
  Draft: "Draft",
  Complete: "Complete",
  Completed: "Completed",
  True: "true",
  False: "false",
  SaveNext: "Save & Next",
  Bonus: "Bonus",
  adminId: "adminId",
  AreYouSureYouWantTo: "Are you sure you want to",
  ShivInfotech: "Shiv Infotech."
};

export const getItem = (key: any) => {
  return sessionStorage.getItem(key);
};
export const setItem = (key: any, value: any) => {
  return sessionStorage.setItem(key, value);
};
export const clearSessionStorage = () => {
  sessionStorage.clear();
};
export const removeItem = (key: any) => {
  sessionStorage.removeItem(key);
};

export const errorHandler = (err: any) => {
  if (Array.isArray(err?.response?.data?.message)) {
    err?.response?.data?.message?.map((message: string) => {
      toast.error(message);
    });
  } else {
    toast.error(err?.response?.data?.message ?? err?.message);
  }
};

export const formatNameArrayForDisplay = (items: Array<any>, nameKey: string = 'name') => {
  const names = items.map((item: any) => item[nameKey]);
  const firstName = names[0];
  const allNames = names.join(", ");
  const displayText = names.length > 1 ? `${firstName}, ...` : firstName;
  
  return { displayText, fullText: allNames };
};

export const moduleName = {
  Dashboard: "Dashboard",
  Users: "Users",
  QuizCategory: "Quiz Category",
  Master: "Master",
  QuizDomain: "Quiz Domain",
  DomainQuestion: "Domain Questions",
  Quizzes: "Quizzes",
  Leaderboard: "Leaderboard",
  Feedback: "Feedback",
  KnowledgeCorner: "Knowledge Corner",
  Fact: "Fact",
  CommunityGroup: "Community Group",
  Tournament: "Tournaments",
  Challenges: "Challenges",
  Configuration:"Configuration",
};

export const tooltipContainer = (text: any, maxLength: any) => {
  return (
    <div
      className={
        text?.length > maxLength ? `text-dark tooltip-container` : `text-dark`
      }
    >
      <span className="tooltip-text tooltip-text-style">{text}</span>
      <div className="d-flex align-items-end text-truncate text-wrap">
        {text?.length > maxLength ? (
          <span>{text?.substring(0, maxLength)}...</span>
        ) : (
          text
        )}
      </div>
    </div>
  );
}

export const renderSkeletons = (pageSize: number) => {
  return Array.from({ length: pageSize }, (_, index) => (
    <div key={index} className="col-lg-3 col-md-4 col-12">
      <Skeleton height={150} width="100%" className="mb-3" />
    </div>
  ));
};

export const NoResultFound = () => {
  return (
    <div className="py-4 text-center">
      <div>
        <span className="fs-1 text-success">
          <RiSearchLine />
        </span>
      </div>
      <div className="mt-4">
        <h5>{notFound.dataNotFound}</h5>
        <p className="text-muted">{notFound.thereIsNoDataFound}</p>
      </div>
    </div>
  );
}

export const ToggleDropdown = ({
  options = [],
  onSelect,
  disabled = false,
  defaultValue = commonLabel.Select,
  className = "",
}:any) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSelect = (value:any) => {
    setSelectedValue(value);
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} disabled={disabled} className={className}>
      <DropdownToggle caret className="rounded-pill fw-normal">
        {selectedValue}
      </DropdownToggle>
      <DropdownMenu>
        {options.map((option:any, index:number) => (
          <DropdownItem
            key={index}
            className="dropdown-item"
            onClick={() => handleSelect(option)}
          >
            {option}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export const DefaultProfileImage =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
export const DefaultProfileImageAlt = "Image";