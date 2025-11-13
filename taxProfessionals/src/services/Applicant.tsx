import axios from 'axios';

const REST_API_BASE_URL = ''

export const addApplicant = () => {
    return axios.post(REST_API_BASE_URL);
}