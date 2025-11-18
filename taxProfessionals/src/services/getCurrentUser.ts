// src/services/getCurrentUser.ts

import axios from "axios";
import type { ApiResponse, Application } from "../types/application";

const REST_API_BASE_URL = "http://localhost:8080/api/taxprofessionals/me";

export const getCurrentUser = (): Promise<{
  data: ApiResponse<Application>;
}> => {
  // Get authentication token from localStorage
  const token = localStorage.getItem("authToken");

  console.log("GetCurrentUser Service: Token exists:", !!token);

  if (!token) {
    console.error(
      "GetCurrentUser Service: No authentication token found in localStorage"
    );
    return Promise.reject(
      new Error("Authentication token is missing. Please login again.")
    );
  }

  // Build headers
  const headers: any = {
    Accept: "application/json",
  };

  // Add Authorization header with Bearer prefix
  headers["Authorization"] = token.startsWith("Bearer ")
    ? token
    : `Bearer ${token}`;

  console.log("GetCurrentUser Service: Request URL:", REST_API_BASE_URL);

  return axios.get(REST_API_BASE_URL, {
    headers: headers,
  });
};
