import moment from "moment";

export const formatDate = (dateString: string, type: "display" | "input") => {
  if (type === "display") {
    return moment.utc(dateString).format("MM/DD/YYYY hh:mm A")
  }
  if (type === "input") {
    return moment.utc(dateString).format("YYYY-MM-DDTHH:mm")
  }
  return dateString;
};

export const validationMessages = {
  required: (fieldName: string) =>
    `${
      fieldName?.charAt(0).toUpperCase() + fieldName?.slice(1).toLowerCase()
    } is required.`,
  format: (fieldName: any) => ` ${fieldName} should be in correct format.`,
  atLeastOneSelected: (fieldName: any) =>
    `At least one ${fieldName} must be selected.`,
  passwordLength: (fieldName: any, minLength: any) =>
    `${fieldName} should be at least ${minLength} characters.`,
  contactLength: (fieldName: string, minLength: any) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } should be ${minLength} digit.`,
  passwordComplexity: (fieldName: any) =>
    `${fieldName} should include eight characters, uppercase letter, lowercase letter, one number and one special character.`,
  passwordsMatch: (fieldName: any, confirmFieldName: any) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } and ${confirmFieldName.toLowerCase()} should be same.`,
  phoneNumber: (fieldName: string) =>
    `Invalid ${fieldName.toLowerCase()} format.`,
  notSameAsField: (fieldName: any, comparedField: any) =>
    `${fieldName} should be different from ${comparedField}.`,
  maxChar: (fieldName: any, maxLength: any) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } should be ${maxLength} Characters.`,
  maxLength: (fieldName: any, maxLength: any) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } should be maximum ${maxLength} digits.`,
  minLength: (fieldName: any, minLength: any) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } should be minimum ${minLength} digits.`,
  positiveNumber: (fieldName: any) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } should be positive`,
  url: (field: any) => `${field} should be a valid URL`,
  greaterThan: (fieldName: any, comparedField: any) =>
    `${comparedField} should be greater than or equal to ${fieldName}.`,
  greaterTime: (fieldName: any, comparedField: any) =>
    `${comparedField} should be greater than ${fieldName}.`,
  lessThan: (fieldName: any, comparedField: any) =>
    `${comparedField} should be less than or equal to ${fieldName}.`,
  otpFormat: (fieldName: any) => `${fieldName} should be in number digit.`,
  minDuration: (min: number, fieldName: string) => `${fieldName} must be at least ${min} minutes.`,
};

export const fileLimitErrorMessage =
  "File size is too large! (more than 1 mb).";
export const fileTypePDFErrorMessage = "Only PDF is allowed.";
export const fileTypePDFJPGPNGErrorMessage = "Only PDF, JPEG and PMG are allowed.";
export const fileTypeImagerrorMessage = "Only image is allowed.";

export const InputPlaceHolder = (fieldName: string) => {
  return `Enter ${fieldName?.toLowerCase()}`;
};

export const SelectPlaceHolder = (fieldName: string) => {
  return `Select ${fieldName?.toLowerCase()}`;
};

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}(?![^.\s])/;
export const numberRegex = /^\d{10}$/;
export const digitRegex = /^\d*$/;
export const aadharRegex = /^\d{12}$/;
export const zipcodeRegex = /^\d{6}$/;
export const bankNumberRegex = /^\{8,17}$/;
export const ifscRegex = /^.{11}$/;
export const panRegex = /^.{10}$/;
export const otpRegex = /^\d{6}$/;
export const otpTypeRegex = /^\d{0,6}$/;
export const whiteSpaceRegex = /^\s/;
export const durationFormatRegex = /^(?:[1-9]\d{0,2}):(0\d|[1-5]\d)$/;
export const durationValueRegex = /[^0-9:]/g;

export const FindWord = (word: string, str: string) => {
  return str.split('/').some(function(w){return w === word})
}