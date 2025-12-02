import axios from "axios";

const TIN_VALIDATION_BASE_URL = "http://192.168.0.117:8080/api/v1/tp/suppliers_wsp";

export const validateTin = (tin: string) => {
  console.log("TinValidation Service: Validating TIN:", tin);
  return axios.get(`${TIN_VALIDATION_BASE_URL}/${tin}`);
};
