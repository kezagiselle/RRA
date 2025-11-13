import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/taxprofessionals/register'

export const addApplicant = (data: any) => {
    return axios.post(REST_API_BASE_URL, data);
}