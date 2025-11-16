import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/taxprofessionals/register-company'

export const addCompany = (data: any) => {

    const token = localStorage.getItem('authToken');
    
    console.log('CompanyRegister Service: Request URL:', REST_API_BASE_URL);
    console.log('CompanyRegister Service: Request data:', JSON.stringify(data, null, 2));
    console.log('CompanyRegister Service: Token exists:', !!token);
    
    if (!token) {
        console.error('CompanyRegister Service: No authentication token found in localStorage');
        return Promise.reject(new Error('Authentication token is missing. Please login first.'));
    }

    const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    
    console.log('CompanyRegister Service: Headers:', { ...headers, Authorization: headers.Authorization?.substring(0, 20) + '...' });
    
    return axios.post(REST_API_BASE_URL, data, {
        headers: headers
    });
}