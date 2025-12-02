import React, { useState } from "react";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaBuilding,
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

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState("");

  // Form state
  const [tin, setTin] = useState("");
  const [nid, setNid] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  
  // Location state (now text inputs)
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [cell, setCell] = useState("");
  const [village, setVillage] = useState("");

  // Additional fields
  const [category, setCategory] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [fax, setFax] = useState("");
  const [businessName, setBusinessName] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<any>({});

  // Validation state
  const [validationTin, setValidationTin] = useState("");
  const [validationData, setValidationData] = useState<any>(null);

  const navigate = useNavigate();

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

    setLoading(true);
    setError("");

    try {
      const response = await validateTin(validationTin);
      console.log("SignUpPage: TIN validation response:", response.data);
      const data = response.data;

      setValidationData(data);
      
      // Map API response to form fields
      setCategory(data.category || "");
      setCell(data.cell || "");
      setDetailedAddress(data.detailedAddress || "");
      setDistrict(data.district || "");
      setEmail(data.emailAddress || "");
      setFullname(data.applicantNames || "");
      setPhoneNumber(data.phoneNumber || "");
      setProvince(data.province || "");
      setSector(data.sector || "");
      setVillage(data.village || "");
      setFax(data.fax || "");
      setNid(data.nid || "");
      setBusinessName(data.businessName || "");
      setTin(data.tin || "");

      setLoading(false);
    } catch (err: any) {
      console.error("SignUpPage: TIN validation error:", err);
      setLoading(false);
      setError("Failed to validate TIN. Please check the number and try again.");
      setValidationData(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder for submission logic
    // Since we removed location IDs, the previous submission logic using IDs won't work directly.
    // Assuming we just want to validate and maybe log the data for now as the user focused on the UI and population.
    console.log("Form Submitted", {
        category, cell, detailedAddress, district, email, fullname, phoneNumber, province, sector, village, fax, nid, businessName, tin, password
    });
    
    // Simulate API call for registration if needed, or just alert
    alert("Registration Submitted (Simulation)");
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

        {/* Step 1: Account Type Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-4 text-center">
                Select Account Type
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Individual Option */}
                <button
                  type="button"
                  onClick={() => setAccountType("INDIVIDUAL")}
                  className={`
                    flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all duration-200
                    ${
                      accountType === "INDIVIDUAL"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }
                  `}
                >
                  <FaUser
                    className={`text-4xl mb-3 ${
                      accountType === "INDIVIDUAL"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      accountType === "INDIVIDUAL"
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    Individual
                  </span>
                </button>

                {/* Company Option */}
                <button
                  type="button"
                  onClick={() => setAccountType("COMPANY")}
                  className={`
                    flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all duration-200
                    ${
                      accountType === "COMPANY"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }
                  `}
                >
                  <FaBuilding
                    className={`text-4xl mb-3 ${
                      accountType === "COMPANY"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      accountType === "COMPANY"
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    Company
                  </span>
                </button>
              </div>

              <Errors message={errors.accountType} />
            </div>

            <button
              type="button"
              onClick={handleAccountTypeNext}
              disabled={loading || !accountType}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-3 lg:py-4 rounded-full transition duration-200 text-sm sm:text-base lg:text-lg"
            >
              {loading ? "Processing..." : "Continue"}
            </button>

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
          </div>
        )}

        {/* Step 2: Validation and Registration Forms */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Validation Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                TIN Validation
              </h3>
              <div className="flex flex-col sm:flex-row gap-2 items-end">
                <div className="flex-grow w-full">
                  <ApplicantForm
                    label="Enter TIN to Validate"
                    value={validationTin}
                    onChange={(e) => setValidationTin(e.target.value)}
                    placeholder="Enter TIN"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleValidateTin}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 mb-0"
                >
                  Validate
                </button>
              </div>
              {error && !validationData && (
                 <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-blue-800 text-center font-medium">
                    {accountType === "INDIVIDUAL" ? "Individual" : "Company"} Registration
                  </p>
                </div>

                {renderField(
                  <ApplicantForm
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    disabled={!validationData}
                  />,
                  "category"
                )}

                {renderField(
                  <ApplicantForm
                    label="Cell"
                    value={cell}
                    onChange={(e) => setCell(e.target.value)}
                    placeholder="Cell"
                    disabled={!validationData}
                  />,
                  "cell"
                )}

                {renderField(
                  <ApplicantForm
                    label="Detailed - Address"
                    value={detailedAddress}
                    onChange={(e) => setDetailedAddress(e.target.value)}
                    placeholder="Detailed Address"
                    disabled={!validationData}
                  />,
                  "detailedAddress"
                )}

                {renderField(
                  <ApplicantForm
                    label="District"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="District"
                    disabled={!validationData}
                  />,
                  "district"
                )}

                {renderField(
                  <ApplicantForm
                    label="Email - Address"
                    type="email"
                    icon={<FaEnvelope />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    disabled={!validationData}
                  />,
                  "email"
                )}

                {renderField(
                  <ApplicantForm
                    label="Applicant - Names"
                    icon={<FaUser />}
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Applicant Names"
                    disabled={!validationData}
                  />,
                  "fullname"
                )}

                {renderField(
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-medium mb-2">
                      Phone - Number
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
                        disabled={!validationData}
                        className={`w-full bg-gray-50 border border-gray-300 rounded-lg py-4 pl-16 pr-5 text-base text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none ${!validationData ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    disabled={!validationData}
                  />,
                  "province"
                )}

                {renderField(
                  <ApplicantForm
                    label="Sector"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Sector"
                    disabled={!validationData}
                  />,
                  "sector"
                )}

                {renderField(
                  <ApplicantForm
                    label="Village"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Village"
                    disabled={!validationData}
                  />,
                  "village"
                )}

                {renderField(
                  <ApplicantForm
                    label="Fax"
                    value={fax}
                    onChange={(e) => setFax(e.target.value)}
                    placeholder="Fax"
                    disabled={!validationData}
                  />,
                  "fax"
                )}

                {renderField(
                  <ApplicantForm
                    label="National-Id"
                    value={nid}
                    onChange={(e) => setNid(e.target.value)}
                    placeholder="National Id"
                    disabled={!validationData}
                  />,
                  "nid"
                )}

                {renderField(
                  <ApplicantForm
                    label="Business-Name"
                    icon={<MdBusiness />}
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Business Name"
                    disabled={!validationData}
                  />,
                  "businessName"
                )}

                {renderField(
                  <ApplicantForm
                    label="TaxPayer - Tin"
                    value={tin}
                    onChange={(e) => setTin(e.target.value)}
                    placeholder="TaxPayer Tin"
                    disabled={!validationData}
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
                    disabled={!validationData}
                  />,
                  "password"
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="w-1/3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 rounded-full transition duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !validationData}
                    className="w-2/3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-full transition duration-200"
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>

                {error && (
                  <p className="text-red-500 text-xs sm:text-sm lg:text-base text-center mt-2">
                    {error}
                  </p>
                )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
