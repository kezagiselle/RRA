import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import rra from "../imgs/rra.png";
import { useNavigate } from "react-router-dom";
import ApplicantForm from '../components/ApplicantForm';
import Errors from '../components/Errors';
import { getProvince } from '../services/Province';
import { getDistrict } from '../services/District';
import { getSector } from '../services/Sector';
import { getCell } from '../services/Cell';
import { getVillage } from '../services/Villages';
import { addApplicant } from '../services/SignUp';
import { addCompany } from '../services/CompanyRegister';

const SignUpPage: React.FC = () => {
  console.log('SignUpPage: Component rendering');
  
  const [businessStatus, setBusinessStatus] = useState("");
  const [tin, setTin] = useState("");
  const [nid, setNid] = useState("");
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
  const [districtdata, setDistrictdata] = useState<any[]>([]);
  const [sectordata, setSectordata] = useState<any[]>([]);
  const [celldata, setCelldata] = useState<any[]>([]);
  const [villagedata, setVillagedata] = useState<any[]>([]);
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

  // Fetch districts when province is selected
  useEffect(() => {
    if (!province) {
      setDistrictdata([]);
      setDistrict("");
      return;
    }

    // Find the province ID from the selected province value (check by ID first, then name)
    const selectedProvince = provincedata.find((p: any) => p.locationId === province || p.id === province || p.name === province);
    if (!selectedProvince) {
      console.warn('SignUpPage: Selected province not found in data');
      return;
    }

    const provinceId = selectedProvince.locationId || selectedProvince.id;
    console.log('SignUpPage: Fetching districts for province:', provinceId);

    getDistrict(provinceId)
      .then((response) => {
        let data = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && typeof response.data === 'object') {
          const arrayValue = Object.values(response.data).find((val: any) => Array.isArray(val));
          if (arrayValue) data = arrayValue as any[];
        }
        console.log('SignUpPage: Districts fetched:', data);
        setDistrictdata(data);
        // Reset dependent fields
        setDistrict("");
        setSector("");
        setCell("");
        setVillage("");
        setSectordata([]);
        setCelldata([]);
        setVillagedata([]);
      })
      .catch(error => {
        console.error('SignUpPage: Error fetching districts:', error);
        setDistrictdata([]);
      });
  }, [province, provincedata]);

  // Fetch sectors when district is selected
  useEffect(() => {
    if (!district) {
      setSectordata([]);
      setSector("");
      return;
    }

    const selectedDistrict = districtdata.find((d: any) => d.locationId === district || d.id === district || d.name === district);
    if (!selectedDistrict) {
      console.warn('SignUpPage: Selected district not found in data');
      return;
    }

    const districtId = selectedDistrict.locationId || selectedDistrict.id;
    console.log('SignUpPage: Fetching sectors for district:', districtId);

    getSector(districtId)
      .then((response) => {
        let data = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && typeof response.data === 'object') {
          const arrayValue = Object.values(response.data).find((val: any) => Array.isArray(val));
          if (arrayValue) data = arrayValue as any[];
        }
        console.log('SignUpPage: Sectors fetched:', data);
        setSectordata(data);
        // Reset dependent fields
        setSector("");
        setCell("");
        setVillage("");
        setCelldata([]);
        setVillagedata([]);
      })
      .catch(error => {
        console.error('SignUpPage: Error fetching sectors:', error);
        setSectordata([]);
      });
  }, [district, districtdata]);

  // Fetch cells when sector is selected
  useEffect(() => {
    console.log('SignUpPage: Cell useEffect triggered, sector:', sector, 'sectordata:', sectordata);
    
    if (!sector) {
      console.log('SignUpPage: No sector selected, clearing cell data');
      setCelldata([]);
      setCell("");
      return;
    }

    const selectedSector = sectordata.find((s: any) => s.locationId === sector || s.id === sector || s.name === sector);
    if (!selectedSector) {
      console.warn('SignUpPage: Selected sector not found in data. Sector value:', sector, 'Available sectors:', sectordata);
      return;
    }

    const sectorId = selectedSector.locationId || selectedSector.id;
    console.log('SignUpPage: Fetching cells for sector ID:', sectorId, 'Selected sector:', selectedSector);
    
    if (!sectorId) {
      console.error('SignUpPage: No sectorId found in selected sector:', selectedSector);
      setCelldata([]);
      return;
    }

    // Ensure sectorId is a valid number or string
    const validSectorId = typeof sectorId === 'number' ? sectorId : (typeof sectorId === 'string' && sectorId.trim() !== '' ? sectorId : null);
    
    if (!validSectorId) {
      console.error('SignUpPage: Invalid sectorId:', sectorId);
      setCelldata([]);
      return;
    }

    console.log('SignUpPage: Calling getCell with sectorId:', validSectorId, 'Type:', typeof validSectorId);
    console.log('SignUpPage: Full URL will be:', `http://localhost:8080/api/locations/cells/${validSectorId}`);
    
    getCell(validSectorId)
      .then((response) => {
        console.log('SignUpPage: Cell API response received');
        console.log('SignUpPage: Response status:', response.status);
        console.log('SignUpPage: Response data:', response.data);
        let data = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
          console.log('SignUpPage: Found data in response.data.data');
        } else if (Array.isArray(response.data)) {
          data = response.data;
          console.log('SignUpPage: response.data is directly an array');
        } else if (response.data && typeof response.data === 'object') {
          const arrayValue = Object.values(response.data).find((val: any) => Array.isArray(val));
          if (arrayValue) {
            data = arrayValue as any[];
            console.log('SignUpPage: Found array in response.data object');
          }
        }
        console.log('SignUpPage: Cells fetched successfully:', data);
        console.log('SignUpPage: Number of cells:', data.length);
        setCelldata(data);
        // Reset dependent fields
        setCell("");
        setVillage("");
        setVillagedata([]);
      })
      .catch(error => {
        console.error('=== SignUpPage: Error fetching cells ===');
        console.error('SignUpPage: Error object:', error);
        console.error('SignUpPage: Error message:', error.message);
        console.error('SignUpPage: Error response:', error.response);
        console.error('SignUpPage: Error response data:', error.response?.data);
        console.error('SignUpPage: Error response status:', error.response?.status);
        console.error('SignUpPage: Error response URL:', error.config?.url);
        console.error('SignUpPage: Full error:', JSON.stringify(error, null, 2));
        setCelldata([]);
      });
  }, [sector, sectordata]);

  // Fetch villages when cell is selected
  useEffect(() => {
    if (!cell) {
      setVillagedata([]);
      setVillage("");
      return;
    }

    const selectedCell = celldata.find((c: any) => c.locationId === cell || c.id === cell || c.name === cell);
    if (!selectedCell) {
      console.warn('SignUpPage: Selected cell not found in data');
      return;
    }

    const cellId = selectedCell.locationId || selectedCell.id;
    console.log('SignUpPage: Fetching villages for cell:', cellId);

    getVillage(cellId)
      .then((response) => {
        let data = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && typeof response.data === 'object') {
          const arrayValue = Object.values(response.data).find((val: any) => Array.isArray(val));
          if (arrayValue) data = arrayValue as any[];
        }
        console.log('SignUpPage: Villages fetched:', data);
        setVillagedata(data);
        setVillage("");
      })
      .catch(error => {
        console.error('SignUpPage: Error fetching villages:', error);
        setVillagedata([]);
      });
  }, [cell, celldata]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formErrors: any = {};
    
    if (!businessStatus) formErrors.businessStatus = "Business status is required";
    if (!tin.trim()) formErrors.tin = "TIN is required";
    if (!nid.trim()) formErrors.nid = "National-ID is required";
    if (!fullname.trim()) formErrors.fullname = "Full name is required";
    if (!email.trim()) formErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) formErrors.email = "Email is invalid";
    if (!phoneNumber.trim()) formErrors.phoneNumber = "Phone number is required";
    else if (!/^\+250\d{9}$/.test(phoneNumber)) formErrors.phoneNumber = "Phone number must be in format +250XXXXXXXXX";
    if (!password) formErrors.password = "Password is required";
    else if (password.length < 8) formErrors.password = "Password must be at least 8 characters";
    else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])/.test(password)) {
      formErrors.password = "Password must contain digit, lowercase, uppercase, and special character";
    }
    if (!province) formErrors.province = "Province is required";
    if (!district) formErrors.district = "District is required";
    if (!sector) formErrors.sector = "Sector is required";
    if (!cell) formErrors.cell = "Cell is required";
    if (!village) formErrors.village = "Village is required";

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Get location IDs from selected values
      // Check by ID first (more reliable), then by name
      const selectedProvince = provincedata.find((p: any) => p.locationId === province || p.id === province || p.name === province);
      const selectedDistrict = districtdata.find((d: any) => d.locationId === district || d.id === district || d.name === district);
      const selectedSector = sectordata.find((s: any) => s.locationId === sector || s.id === sector || s.name === sector);
      const selectedCell = celldata.find((c: any) => c.locationId === cell || c.id === cell || c.name === cell);
      const selectedVillage = villagedata.find((v: any) => v.locationId === village || v.id === village || v.name === village);

      const provinceId = selectedProvince?.locationId || selectedProvince?.id;
      const districtId = selectedDistrict?.locationId || selectedDistrict?.id;
      const sectorId = selectedSector?.locationId || selectedSector?.id;
      const cellId = selectedCell?.locationId || selectedCell?.id;
      const villageId = selectedVillage?.locationId || selectedVillage?.id;

      // Validate location IDs
      if (!provinceId) {
        setErrors({ ...formErrors, province: "Province ID not found. Please select again." });
        setLoading(false);
        return;
      }
      if (!districtId) {
        setErrors({ ...formErrors, district: "District ID not found. Please select again." });
        setLoading(false);
        return;
      }
      if (!sectorId) {
        setErrors({ ...formErrors, sector: "Sector ID not found. Please select again." });
        setLoading(false);
        return;
      }
      if (!cellId) {
        setErrors({ ...formErrors, cell: "Cell ID not found. Please select again." });
        setLoading(false);
        return;
      }
      if (!villageId) {
        setErrors({ ...formErrors, village: "Village ID not found. Please select again." });
        setLoading(false);
        return;
      }

      // Convert IDs to numbers if they're strings
      const provinceIdNum = typeof provinceId === 'string' ? parseInt(provinceId, 10) : provinceId;
      const districtIdNum = typeof districtId === 'string' ? parseInt(districtId, 10) : districtId;
      const sectorIdNum = typeof sectorId === 'string' ? parseInt(sectorId, 10) : sectorId;
      const cellIdNum = typeof cellId === 'string' ? parseInt(cellId, 10) : cellId;
      const villageIdNum = typeof villageId === 'string' ? parseInt(villageId, 10) : villageId;

      // Validate that all IDs are valid numbers
      if (isNaN(provinceIdNum) || isNaN(districtIdNum) || isNaN(sectorIdNum) || isNaN(cellIdNum) || isNaN(villageIdNum)) {
        setError("Invalid location IDs. Please select all locations again.");
        setLoading(false);
        return;
      }

      // Prepare data for API based on business status
      let apiCall;
      
      if (businessStatus === "Company") {
        // Company registration structure
        const companyData = {
          tinCompany: tin.trim(),
          employees: [
            {
              nid: nid.trim(),
              fullName: fullname.trim(),
              email: email.trim(),
              phoneNumber: phoneNumber.trim(),
              password: password,
              provinceId: provinceIdNum,
              districtId: districtIdNum,
              sectorId: sectorIdNum,
              cellId: cellIdNum,
              villageId: villageIdNum
            }
          ]
        };

        console.log('=== SignUpPage: Submitting Company registration ===');
        console.log('SignUpPage: Business Status:', businessStatus);
        console.log('SignUpPage: Company data:', JSON.stringify(companyData, null, 2));
        console.log('SignUpPage: Location IDs - Province:', provinceIdNum, 'District:', districtIdNum, 'Sector:', sectorIdNum, 'Cell:', cellIdNum, 'Village:', villageIdNum);

        apiCall = addCompany(companyData);
      } else {
        // Individual registration structure
        const signupData = {
          tin: tin.trim(),
          nid: nid.trim(),
          fullName: fullname.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          password: password,
          provinceId: provinceIdNum,
          districtId: districtIdNum,
          sectorId: sectorIdNum,
          cellId: cellIdNum,
          villageId: villageIdNum
        };

        console.log('=== SignUpPage: Submitting Individual signup ===');
        console.log('SignUpPage: Business Status:', businessStatus);
        console.log('SignUpPage: Full signup data:', JSON.stringify(signupData, null, 2));
        console.log('SignUpPage: Location IDs - Province:', provinceIdNum, 'District:', districtIdNum, 'Sector:', sectorIdNum, 'Cell:', cellIdNum, 'Village:', villageIdNum);
        console.log('SignUpPage: Selected objects - Province:', selectedProvince, 'District:', selectedDistrict, 'Sector:', selectedSector, 'Cell:', selectedCell, 'Village:', selectedVillage);

        apiCall = addApplicant(signupData);
      }

      // Call the appropriate API
      apiCall
        .then((response) => {
          console.log('=== SignUpPage: Signup successful ===');
          console.log('SignUpPage: Response:', response);
          console.log('SignUpPage: Response data:', response.data);
          setLoading(false);
          alert("Sign up successful!");
          navigate("/");
        })
        .catch((error) => {
          console.error('=== SignUpPage: Signup error ===');
          console.error('SignUpPage: Error object:', error);
          console.error('SignUpPage: Error response:', error.response);
          console.error('SignUpPage: Error response data:', error.response?.data);
          console.error('SignUpPage: Error response status:', error.response?.status);
          console.error('SignUpPage: Error response headers:', error.response?.headers);
          console.error('SignUpPage: Request config:', error.config);
          if (error.response?.data) {
            console.error('SignUpPage: Error response data (stringified):', JSON.stringify(error.response.data, null, 2));
          }
          
          setLoading(false);
          
          // Handle validation errors from backend
          if (error.response?.data) {
            const errorData = error.response.data;
            
            // If backend returns validation errors in a specific format
            if (errorData.errors && Array.isArray(errorData.errors)) {
              const backendErrors: any = {};
              errorData.errors.forEach((err: any) => {
                if (err.field) {
                  backendErrors[err.field] = err.message || err.defaultMessage;
                }
              });
              setErrors(backendErrors);
              setError(errorData.message || "Validation failed. Please check the form.");
            } else if (errorData.message) {
              setError(errorData.message);
            } else if (typeof errorData === 'string') {
              setError(errorData);
            } else {
              setError(JSON.stringify(errorData));
            }
          } else if (error.message) {
            setError(error.message);
          } else {
            setError("Sign up failed. Please try again.");
          }
        });
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
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 sm:py-4 px-4 sm:px-5 pr-10 text-sm sm:text-base text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none appearance-none cursor-pointer"
              >
                <option value="">Select Business Status</option>
                <option value="Individual">INDIVIDUAL</option>
                <option value="Company">COMPANY</option>
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
                label="National-ID"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
              />,
              'nid'
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
              <ApplicantForm
                label="District"
                icon={<RiArrowDropDownLine />}
                value={district}
                onChange={(e) => {
                  const value = e.target.value;
                  setDistrict(value);
                }}
                applicantData={districtdata}
              />,
              'district'
            )}

            {renderField(
              <ApplicantForm
                label="Sector"
                icon={<RiArrowDropDownLine />}
                value={sector}
                onChange={(e) => {
                  const value = e.target.value;
                  setSector(value);
                }}
                applicantData={sectordata}
              />,
              'sector'
            )}

            {renderField(
              <ApplicantForm
                label="Cell"
                icon={<RiArrowDropDownLine />}
                value={cell}
                onChange={(e) => {
                  const value = e.target.value;
                  setCell(value);
                }}
                applicantData={celldata}
              />,
              'cell'
            )}

            {renderField(
              <ApplicantForm
                label="Village"
                icon={<RiArrowDropDownLine />}
                value={village}
                onChange={(e) => {
                  const value = e.target.value;
                  setVillage(value);
                }}
                applicantData={villagedata}
              />,
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

