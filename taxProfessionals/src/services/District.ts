import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/locations/districts/{provinceId}'

export const getDistrict = () => {
    return axios.get(REST_API_BASE_URL);
}