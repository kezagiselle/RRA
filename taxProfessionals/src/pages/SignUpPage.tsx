import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import rra from "../imgs/rra.png";
import { useNavigate } from "react-router-dom";
import ApplicantForm from '../components/ApplicantForm';
import Errors from '../components/Errors';
import { getProvince } from '../services/Province';

const SignUpPage: React.FC = () => {
  console.log('SignUpPage: Component rendering');
  
  const [businessStatus, setBusinessStatus] = useState("");
  const [tin, setTin] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [cell, setCell] = useState("");
  const [village, setVillage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [provincedata, setProvincedata] = useState<any[]>([]);
  const navigate = useNavigate();
  
  console.log('SignUpPage: Current state - businessStatus:', businessStatus, 'provincedata:', provincedata);

  useEffect(() => {
    console.log('=== SignUpPage: useEffect STARTED ===');
    console.log('SignUpPage: Current provincedata state:', provincedata);
    console.log('SignUpPage: About to call getProvince()...');
    
    // Test if the function exists
    if (!getProvince) {
      console.error('SignUpPage: getProvince function is not defined!');
      return;
    }
    
    const apiCall = getProvince();
    console.log('SignUpPage: API call initiated, promise:', apiCall);
    
    apiCall
      .then((response) => {
        console.log('=== SignUpPage: API call SUCCESS ===');
        console.log('SignUpPage: Full Response Object:', response);
        console.log('SignUpPage: Response Status:', response.status);
        console.log('SignUpPage: Response Data:', response.data);
        console.log('SignUpPage: Response Data Type:', typeof response.data);
        console.log('SignUpPage: Response Data Keys:', response.data ? Object.keys(response.data) : 'N/A');
        
        // Handle nested data structure: response.data.data or response.data
        let data = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
          console.log('SignUpPage: Found data in response.data.data');
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          console.log('SignUpPage: response.data is directly an array');
          data = response.data;
        } else if (response.data && typeof response.data === 'object') {
          console.log('SignUpPage: response.data is an object, searching for array...');
          // If it's an object, try to find an array property
          const arrayValue = Object.values(response.data).find((val: any) => Array.isArray(val));
          if (arrayValue) {
            console.log('SignUpPage: Found array in object:', arrayValue);
            data = arrayValue as any[];
          } else {
            console.warn('SignUpPage: No array found in response.data object');
          }
        } else {
          console.warn('SignUpPage: Unexpected response.data structure:', response.data);
        }
        
        console.log('SignUpPage: Final Province Data:', data);
        console.log('SignUpPage: Data length:', data.length);
        console.log('SignUpPage: Data items:', data);
        setProvincedata(data);
        console.log('SignUpPage: State updated with', data.length, 'provinces');
        console.log('=== SignUpPage: useEffect COMPLETED ===');
      })
      .catch(error => {
        console.error('=== SignUpPage: API call FAILED ===');
        console.error('SignUpPage: Error object:', error);
        console.error('SignUpPage: Error message:', error.message);
        console.error('SignUpPage: Error response:', error.response);
        console.error('SignUpPage: Error response data:', error.response?.data);
        console.error('SignUpPage: Error response status:', error.response?.status);
        console.error('SignUpPage: Full error details:', JSON.stringify(error, null, 2));
        setProvincedata([]);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formErrors: any = {};
    
    if (!businessStatus) formErrors.businessStatus = "Business status is required";
    if (!tin.trim()) formErrors.tin = "TIN is required";
    if (!fullname.trim()) formErrors.fullname = "Full name is required";
    if (!email.trim()) formErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) formErrors.email = "Email is invalid";
    if (!phoneNumber.trim()) formErrors.phoneNumber = "Phone number is required";
    else if (!/^\+?\d{8,15}$/.test(phoneNumber)) formErrors.phoneNumber = "Phone number is invalid";
    if (!password) formErrors.password = "Password is required";
    else if (password.length < 6) formErrors.password = "Password must be at least 6 characters";
    if (!province) formErrors.province = "Province is required";
    if (!district) formErrors.district = "District is required";
    if (!sector) formErrors.sector = "Sector is required";
    if (!cell) formErrors.cell = "Cell is required";
    if (!village) formErrors.village = "Village is required";

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Handle successful signup
      setTimeout(() => {
        setLoading(false);
        alert("Sign up successful!");
        navigate("/");
      }, 1000);
    } else {
      setLoading(false);
    }
  };

  const renderField = (input: React.ReactNode, errorKey: string) => (
    <div className="flex flex-col">
      {input}
      <Errors message={errors[errorKey]} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl space-y-4 sm:space-y-5 lg:space-y-6"
      >
        <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
          <img
            src={rra}
            alt="RRA Logo"
            className="h-20 sm:h-24 lg:h-28 xl:h-32 object-contain"
          />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-4 sm:mb-6">
          Sign Up
        </h2>

        {/* Business Status - Always visible */}
        {renderField(
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">Business Status</label>
            <div className="relative">
              <select
                value={businessStatus}
                onChange={(e) => setBusinessStatus(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-4 px-5 pr-10 text-base text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none appearance-none cursor-pointer"
              >
                <option value="">Select Business Status</option>
                <option value="Individual">Individual</option>
                <option value="Company">Company</option>
              </select>
              <RiArrowDropDownLine className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-2xl pointer-events-none" />
            </div>
          </div>,
          'businessStatus'
        )}

        {/* Other fields - Only show after business status is selected */}
        {businessStatus && (
          <>
            {renderField(
              <ApplicantForm
                label={businessStatus === "Company" ? "Tin-Company" : "TIN"}
                value={tin}
                onChange={(e) => setTin(e.target.value)}
              />,
              'tin'
            )}

            {renderField(
              <ApplicantForm
                label="Full Name"
                icon={<FaUser />}
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />,
              'fullname'
            )}

            {renderField(
              <ApplicantForm
                label="Email"
                type="email"
                icon={<FaEnvelope />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />,
              'email'
            )}

            {renderField(
              <ApplicantForm
                label="Phone Number"
                icon={<FaPhone />}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />,
              'phoneNumber'
            )}

            {renderField(
              <ApplicantForm
                label="Password"
                type="password"
                icon={<FaLock />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />,
              'password'
            )}

            {renderField(
              (() => {
                console.log('SignUpPage: Rendering Province field with applicantData:', provincedata);
                return (
                  <ApplicantForm
                    label="Province"
                    icon={<RiArrowDropDownLine />}
                    value={province}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log('SignUpPage: Province changed to:', value);
                      setProvince(value);
                    }}
                    applicantData={provincedata}
                  />
                );
              })(),
              'province'
            )}

            {renderField(
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">District</label>
                <div className="relative">
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-4 px-5 pr-10 text-base text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select District</option>
                    {/* Add district options here when API is available */}
                  </select>
                  <RiArrowDropDownLine className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-2xl pointer-events-none" />
                </div>
              </div>,
              'district'
            )}

            {renderField(
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Sector</label>
                <div className="relative">
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-4 px-5 pr-10 text-base text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Sector</option>
                    {/* Add sector options here when API is available */}
                  </select>
                  <RiArrowDropDownLine className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-2xl pointer-events-none" />
                </div>
              </div>,
              'sector'
            )}

            {renderField(
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Cell</label>
                <div className="relative">
                  <select
                    value={cell}
                    onChange={(e) => setCell(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-4 px-5 pr-10 text-base text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Cell</option>
                    {/* Add cell options here when API is available */}
                  </select>
                  <RiArrowDropDownLine className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-2xl pointer-events-none" />
                </div>
              </div>,
              'cell'
            )}

            {renderField(
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Village</label>
                <div className="relative">
                  <select
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-4 px-5 pr-10 text-base text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Village</option>
                    {/* Add village options here when API is available */}
                  </select>
                  <RiArrowDropDownLine className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-2xl pointer-events-none" />
                </div>
              </div>,
              'village'
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 sm:py-3 lg:py-4 rounded-full transition duration-200 text-sm sm:text-base lg:text-lg"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            {error && (
              <p className="text-red-500 text-xs sm:text-sm lg:text-base text-center mt-2">{error}</p>
            )}

            <div className="text-center pt-3 sm:pt-4">
              <p className="text-gray-600 text-sm sm:text-base">
                Already have an account?{" "}
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/");
                  }}
                  className="text-blue-400 hover:text-blue-600 font-semibold underline transition duration-200 text-sm sm:text-base"
                >
                  Login here
                </a>
              </p>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default SignUpPage;

