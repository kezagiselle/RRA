import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/company/members";

export const deleteCompanyMember = (memberId: number) => {
  console.log("DeleteCompanyMember Service: Deleting member:", memberId);

  const token = localStorage.getItem("authToken");

  return axios.delete(`${REST_API_BASE_URL}/${memberId}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

