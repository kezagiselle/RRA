import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaCheckCircle,
} from "react-icons/fa";
import { MdBusiness } from "react-icons/md";
import rra from "../imgs/rra.png";
import { useNavigate } from "react-router-dom";
import ApplicantForm from "../components/ApplicantForm";
import Errors from "../components/Errors";
import { addApplicant } from "../services/SignUp";
import { addCompany } from "../services/CompanyRegister";
import { validateTin } from "../services/TinValidation";

const SignUpPage: React.FC = () => {
  console.log("SignUpPage: Component rendering");

  
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState("");

  
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

  
  const [provinceId, setProvinceId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [sectorId, setSectorId] = useState<number | null>(null);
  const [cellId, setCellId] = useState<number | null>(null);
  const [villageId, setVillageId] = useState<number | null>(null);

  
  const [category, setCategory] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [fax, setFax] = useState("");
  const [businessName, setBusinessName] = useState("");

  
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<any>({});

  
  const [validationTin, setValidationTin] = useState("");
  const [validationData, setValidationData] = useState<any>(null);
  const [isTinValidated, setIsTinValidated] = useState(false);

  const navigate = useNavigate();

  
  useEffect(() => {
    if (accountType) {
      clearForm();
    }
  }, [accountType]);

  const clearForm = () => {
    setTin("");
    setNid("");
    setFullname("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setProvince("");
    setDistrict("");
    setSector("");
    setCell("");
    setVillage("");
    setProvinceId(null);
    setDistrictId(null);
    setSectorId(null);
    setCellId(null);
    setVillageId(null);
    setCategory("");
    setDetailedAddress("");
    setFax("");
    setBusinessName("");
    setValidationTin("");
    setValidationData(null);
    setIsTinValidated(false);
    setError("");
    setErrors({});
  };

  const handleAccountTypeNext = () => {
    setError("");
    setErrors({});

    if (!accountType) {
      setErrors({ accountType: "Please select an account type" });
      return;
    }
    setCurrentStep(2);
  };

  const handleValidateTin = async () => {
    if (!validationTin) {
      setError("Please enter a TIN to validate");
      return;
    }

    setValidating(true);
    setError("");
    setValidationData(null);
    setIsTinValidated(false);

    try {
      const response = await validateTin(validationTin);
      console.log("SignUpPage: TIN validation response:", response.data);
      const data = response.data;

      setValidationData(data);
      
      
      setCategory(data.category || "");
      setCell(data.cell || "");
      setCellId(data.cellId ? parseInt(data.cellId) : null);
      setDetailedAddress(data.detailedAddress || "");
      setDistrict(data.district || "");
      setDistrictId(data.districtId ? parseInt(data.districtId) : null);
      setEmail(data.emailAddress || "");
      setFullname(data.applicantNames || "");
      setPhoneNumber(data.phoneNumber || "");
      setProvince(data.province || "");
      setProvinceId(data.provinceId ? parseInt(data.provinceId) : null);
      setSector(data.sector || "");
      setSectorId(data.sectorId ? parseInt(data.sectorId) : null);
      setVillage(data.village || "");
      setVillageId(data.villageId ? parseInt(data.villageId) : null);
      setFax(data.fax || "");
      setNid(data.nid || "");
      setBusinessName(data.businessName || "");
      setTin(data.tin || "");

      setIsTinValidated(true);
      setValidating(false);
      setError("");
      
      
      setValidationTin(data.tin || validationTin);
      
    } catch (err: any) {
      console.error("SignUpPage: TIN validation error:", err);
      setValidating(false);
      setError(err.response?.data?.message || "Failed to validate TIN. Please check the number and try again.");
      setValidationData(null);
      setIsTinValidated(false);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!category) newErrors.category = "Category is required";
    if (!cell) newErrors.cell = "Cell is required";
    if (!district) newErrors.district = "District is required";
    if (!email) newErrors.email = "Email is required";
    if (!fullname) newErrors.fullname = "Full name is required";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!province) newErrors.province = "Province is required";
    if (!sector) newErrors.sector = "Sector is required";
    if (!village) newErrors.village = "Village is required";
    if (!nid) newErrors.nid = "National ID is required";
    if (!businessName) newErrors.businessName = "Business name is required";
    if (!tin) newErrors.tin = "TIN is required";
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    
    if (accountType === "COMPANY") {
      if (!provinceId) newErrors.provinceId = "Province ID is required";
      if (!districtId) newErrors.districtId = "District ID is required";
      if (!sectorId) newErrors.sectorId = "Sector ID is required";
      if (!cellId) newErrors.cellId = "Cell ID is required";
      if (!villageId) newErrors.villageId = "Village ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (!isTinValidated) {
      setError("Please validate your TIN first before registering");
      return;
    }

    
    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }

    setRegistering(true);
    setError("");

    try {
      let response;
      
      
      const userData = {
        category,
        cell,
        detailedAddress,
        district,
        email,
        fullname,
        phoneNumber,
        province,
        sector,
        village,
        fax,
        nid,
        businessName,
        tin,
        password,
        accountType
      };

      console.log("SignUpPage: Registering user:", userData);


      if (accountType === "INDIVIDUAL") {
        response = await addApplicant(userData);
      } else {
        if (!provinceId || !districtId || !sectorId || !cellId || !villageId) {
          setError("Location IDs are missing. Please validate TIN again.");
          setRegistering(false);
          return;
        }

        const companyData = {
          companyTin: tin,
          companyName: businessName,
          companyEmail: email,
          provinceId: provinceId, 
          districtId: districtId, 
          sectorId: sectorId, 
          cellId: cellId, 
          villageId: villageId, 
          companyAddress: detailedAddress,
          companyPhoneNumber: phoneNumber,
          companyFax: fax,
          category,
          password,
          nid,
          applicantNames: fullname,
          accountType
        };
        
        console.log("SignUpPage: Registering company with data:", companyData);
        response = await addCompany(companyData);
      }

      console.log("SignUpPage: Registration successful:", response.data);
      
      
      alert("Registration successful!");
      navigate("/login");
      
    } catch (err: any) {
      console.error("SignUpPage: Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setRegistering(false);
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
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Logo */}
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

        
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            <label className="text-gray-700 font-medium block text-center">
              Select Account Type
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
              <div
                onClick={() => setAccountType("INDIVIDUAL")}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                  ${
                    accountType === "INDIVIDUAL"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }
                `}
              >
                <FaUser
                  className={`text-3xl mb-2 ${
                    accountType === "INDIVIDUAL"
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={`font-semibold text-sm ${
                    accountType === "INDIVIDUAL"
                      ? "text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  Individual
                </span>
              </div>

              
              <div
                onClick={() => setAccountType("COMPANY")}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                  ${
                    accountType === "COMPANY"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }
                `}
              >
                <FaBuilding
                  className={`text-3xl mb-2 ${
                    accountType === "COMPANY"
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={`font-semibold text-sm ${
                    accountType === "COMPANY"
                      ? "text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  Company
                </span>
              </div>
            </div>

            <Errors message={errors.accountType} />
          </div>

          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              TIN Validation
              {isTinValidated && (
                <FaCheckCircle className="text-green-500 text-lg" />
              )}
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <div className="flex-grow w-full">
                <ApplicantForm
                  label="Enter TIN to Validate"
                  value={validationTin}
                  onChange={(e) => {
                    setValidationTin(e.target.value);
                
                    if (isTinValidated && e.target.value !== tin) {
                      setIsTinValidated(false);
                    }
                  }}
                  placeholder="Enter TIN"
                />
              </div>
              <button
                type="button"
                onClick={handleValidateTin}
                disabled={validating || isTinValidated || !accountType}
                className={`w-full sm:w-auto font-semibold py-4 px-6 rounded-lg transition duration-200 mb-0 ${
                  isTinValidated
                    ? "bg-green-100 text-green-700 cursor-default"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {validating ? "Validating..." : isTinValidated ? "Validated" : "Validate"}
              </button>
            </div>
            {error && !validationData && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
            {isTinValidated && (
              <p className="text-green-600 text-sm mt-2">
                ✓ TIN validated successfully! All fields have been auto-filled.
              </p>
            )}
          </div>

          
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-blue-800 text-center font-medium">
              {accountType ? `${accountType === "INDIVIDUAL" ? "Individual" : "Company"} Registration` : "Registration Information"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField(
              <ApplicantForm
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
                disabled={true} 
              />,
              "category"
            )}

            {renderField(
              <ApplicantForm
                label="Cell"
                value={cell}
                onChange={(e) => setCell(e.target.value)}
                placeholder="Cell"
                disabled={true} 
              />,
              "cell"
            )}

            {renderField(
              <ApplicantForm
                label="Detailed Address"
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
                placeholder="Detailed Address"
                disabled={true} 
              />,
              "detailedAddress"
            )}

            {renderField(
              <ApplicantForm
                label="District"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="District"
                disabled={true} 
              />,
              "district"
            )}

            {renderField(
              <ApplicantForm
                label="Email Address"
                type="email"
                icon={<FaEnvelope />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                disabled={true} 
              />,
              "email"
            )}

            {renderField(
              <ApplicantForm
                label="Applicant Names"
                icon={<FaUser />}
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Applicant Names"
                disabled={true} 
              />,
              "fullname"
            )}

            {renderField(
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 text-base pointer-events-none">
                    +250
                  </div>
                  <input
                    type="text"
                    value={
                      phoneNumber.startsWith("+250") ? phoneNumber.slice(4) : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 9) {
                        setPhoneNumber("+250" + value);
                      }
                    }}
                    placeholder="XXXXXXXXX"
                    disabled={true} 
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg py-4 pl-16 pr-5 text-base text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none cursor-not-allowed"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-2xl pointer-events-none">
                    <FaPhone />
                  </span>
                </div>
              </div>,
              "phoneNumber"
            )}

            {renderField(
              <ApplicantForm
                label="Province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="Province"
                disabled={true} 
              />,
              "province"
            )}

            {renderField(
              <ApplicantForm
                label="Sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Sector"
                disabled={true} 
              />,
              "sector"
            )}

            {renderField(
              <ApplicantForm
                label="Village"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Village"
                disabled={true} 
              />,
              "village"
            )}

            {renderField(
              <ApplicantForm
                label="Fax"
                value={fax}
                onChange={(e) => setFax(e.target.value)}
                placeholder="Fax"
                disabled={true} 
              />,
              "fax"
            )}

            {renderField(
              <ApplicantForm
                label="National ID"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                placeholder="National ID"
                disabled={true} 
              />,
              "nid"
            )}

            {renderField(
              <ApplicantForm
                label="Business Name"
                icon={<MdBusiness />}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Business Name"
                disabled={true} 
              />,
              "businessName"
            )}

            {renderField(
              <ApplicantForm
                label="TaxPayer TIN"
                value={tin}
                onChange={(e) => setTin(e.target.value)}
                placeholder="TaxPayer TIN"
                disabled={true} 
              />,
              "tin"
            )}

            {renderField(
              <ApplicantForm
                label="Password"
                type="password"
                icon={<FaLock />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                disabled={false} 
              />,
              "password"
            )}
          </div>

          
          {accountType === "COMPANY" && isTinValidated && (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-xs">
              <p className="text-yellow-800 font-medium">Location IDs (for Company registration):</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                <div>Province ID: {provinceId || "Missing"}</div>
                <div>District ID: {districtId || "Missing"}</div>
                <div>Sector ID: {sectorId || "Missing"}</div>
                <div>Cell ID: {cellId || "Missing"}</div>
                <div>Village ID: {villageId || "Missing"}</div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-1/3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 rounded-full transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={registering || !isTinValidated || !accountType}
              className="w-2/3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition duration-200"
            >
              {registering ? "Registering..." : "Register"}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs sm:text-sm lg:text-base text-center mt-2">
              {error}
            </p>
          )}

          <div className="text-center pt-3 sm:pt-4">
            <p className="text-gray-600 text-sm sm:text-base">
              Already have an account?{" "}
              <a
                href="/login"
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
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;