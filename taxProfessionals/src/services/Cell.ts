import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/locations/cells/{sectorId}'

export const getCell = () => {
    return axios.get(REST_API_BASE_URL);
}