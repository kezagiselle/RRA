import axios from "axios";

const REST_API_BASE_URL = "http://192.168.0.117:8080/api/v1/tp/suppliers_wsp";

export interface SupplierData {
  tin?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  // Add any other fields that the API returns
}

export const validateTin = (tin: string): Promise<{ data: SupplierData }> => {
  console.log("ValidateTin Service: Validating TIN:", tin);

  // Replace {tin} placeholder with actual TIN value
  const url = `${REST_API_BASE_URL}/${tin}`;

  console.log("ValidateTin Service: Request URL:", url);

  return axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};
