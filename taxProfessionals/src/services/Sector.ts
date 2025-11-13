import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/locations/sectors/{districtId}'

export const getSector = () => {
    return axios.get(REST_API_BASE_URL);
}