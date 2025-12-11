import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/company/members";

interface UpdateMemberData {
  memberId: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  nid?: string;
}

export const updateCompanyMember = (data: UpdateMemberData) => {
  console.log("UpdateCompanyMember Service: Updating member:", data);

  const token = localStorage.getItem("authToken");

  return axios.put(`${REST_API_BASE_URL}/${data.memberId}`, data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

