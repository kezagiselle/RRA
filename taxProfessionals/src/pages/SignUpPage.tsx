import React, { useState, useEffect } from "react";
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
// import { validateTin } from "../services/ValidateTin";
import { sendPasswordEmail } from "../services/SendPasswordEmail";
import { getProvince } from "../services/Province";
import { getDistrict } from "../services/District";
import { getSector } from "../services/Sector";
import { getCell } from "../services/Cell";
import { getVillage } from "../services/Villages";

const SignUpPage: React.FC = () => {
  console.log("SignUpPage: Component rendering");

  // Step management
  const [accountType, setAccountType] = useState("");

  // Form state
  const [tin, setTin] = useState("");
  const [nid, setNid] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  // Location state
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [cell, setCell] = useState("");
  const [village, setVillage] = useState("");

  // Location data lists
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [cells, setCells] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);


  // Additional fields
  const [category, setCategory] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [fax, setFax] = useState("");
  const [businessName, setBusinessName] = useState("");

  // UI state
  // const [validating, setValidating] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<any>({});

  // Validation state
  // const [validationTin, setValidationTin] = useState("");
  // const [validationData, setValidationData] = useState<any>(null);
  // const [isTinValidated, setIsTinValidated] = useState(false);

  const navigate = useNavigate();

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await getProvince();
        if (response.data.success) {
          setProvinces(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch provinces:", err);
      }
    };
    fetchProvinces();
  }, []);

  // Clear form when account type changes
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
    setCategory("");
    setDetailedAddress("");
    setFax("");
    setBusinessName("");
    // setValidationTin("");
    // setValidationData(null);
    // setIsTinValidated(false);
    setError("");
    setErrors({});
    
    // Reset location lists except provinces
    setDistricts([]);
    setSectors([]);
    setCells([]);
    setVillages([]);
    setVillages([]);
  };

  // Location change handlers
  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pName = e.target.value;
    setProvince(pName);
    
    // Reset lower levels
    setDistrict("");
    setSector("");
    setCell("");
    setVillage("");
    setDistricts([]);
    setSectors([]);
    setCells([]);
    setVillages([]);
    if (pName) {
      const selectedProv = provinces.find(p => p.name === pName);
      if (selectedProv) {
        const pId = selectedProv.locationId;
        try {
          const response = await getDistrict(pId);
          if (response.data.success) {
            setDistricts(response.data.data);
          }
        } catch (err) {
          console.error("Failed to fetch districts:", err);
        }
      }
    }
  };

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dName = e.target.value;
    setDistrict(dName);
    
    // Reset lower levels
    setSector("");
    setCell("");
    setVillage("");
    setSectors([]);
    setCells([]);
    setVillages([]);
    if (dName) {
      const selectedDist = districts.find(d => d.name === dName);
      if (selectedDist) {
        const dId = selectedDist.locationId;
        try {
          const response = await getSector(dId);
          if (response.data.success) {
            setSectors(response.data.data);
          }
        } catch (err) {
          console.error("Failed to fetch sectors:", err);
        }
      }
    }
  };

  const handleSectorChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sName = e.target.value;
    setSector(sName);
    
    // Reset lower levels
    setCell("");
    setVillage("");
    setCells([]);
    setVillages([]);
    if (sName) {
      const selectedSect = sectors.find(s => s.name === sName);
      if (selectedSect) {
        const sId = selectedSect.locationId;
        try {
          const response = await getCell(sId);
          if (response.data.success) {
            setCells(response.data.data);
          }
        } catch (err) {
          console.error("Failed to fetch cells:", err);
        }
      }
    }
  };

  const handleCellChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cName = e.target.value;
    setCell(cName);
    
    // Reset lower level
    setVillage("");
    setVillages([]);

    if (cName) {
      const selectedCell = cells.find(c => c.name === cName);
      if (selectedCell) {
        const cId = selectedCell.locationId;
        try {
          const response = await getVillage(cId);
          if (response.data.success) {
            setVillages(response.data.data);
          }
        } catch (err) {
          console.error("Failed to fetch villages:", err);
        }
      }
    }
  };

  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVillage(e.target.value);
  };

  // Removed handleValidateTin as validation is now manual

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mandatory field check
    const isIndividual = accountType === "INDIVIDUAL";
    const isCompany = accountType === "COMPANY";

    if (!tin || !email || !phoneNumber || !password || !province || !district || !sector || !cell || !village || 
        (isIndividual && (!fullname || !nid)) || 
        (isCompany && !businessName)) {
      setError("All fields are mandatory. Please fill in all details.");
      return;
    }

    setRegistering(true);
    setError("");

    try {
      let response;

      // Prepare user data
      const userData = {
        category,
        cell,
        detailedAddress,
        district,
        email,
        fullName: fullname, // Backend expects camelCase
        phoneNumber,
        province,
        sector,
        village,
        fax,
        nid,
        businessName,
        tin,
        password,
        accountType,
      };

      console.log("SignUpPage: Registering user:", userData);

      if (accountType === "INDIVIDUAL") {
        response = await addApplicant(userData);
      } else {
        // Company registration - only TIN and password are required, rest are optional
        const companyData: any = {
          companyTin: tin,
          companyName: businessName || "",
          password,
          accountType,
          // Optional fields - only include if provided
          companyEmail: email || "",
          companyPhoneNumber: phoneNumber || "",
          province: province || "",
          district: district || "",
          sector: sector || "",
          cell: cell || "",
          village: village || "",
          companyAddress: detailedAddress || "",
          companyFax: fax || "",
          category: category || "",
          applicantNames: fullname || "",
        };

        console.log(
          "SignUpPage: Registering company with data (TIN + password required, others optional):",
          companyData
        );
        response = await addCompany(companyData);
      }

      console.log("SignUpPage: Registration successful:", response.data);

      // Send password email after successful registration
      try {
        await sendPasswordEmail({
          email: email,
          password: password,
          fullName: accountType === "INDIVIDUAL" ? fullname : businessName,
          accountType: accountType,
        });
        console.log("SignUpPage: Password email sent successfully");
      } catch (emailErr: any) {
        console.error("SignUpPage: Failed to send password email:", emailErr);
        // Don't block the registration flow if email fails
      }

      // Success
      alert(
        "Registration successful! A confirmation email with your password has been sent to " +
          email
      );
      navigate("/");
    } catch (err: any) {
      console.error("SignUpPage: Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
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
    <div className="mdc-page">
      <div className="mdc-card w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 lg:space-y-6">
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

        {/* Account Type Selection - Show this first */}
        {!accountType && (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-gray-700 font-medium block text-center text-lg">
                Select Account Type
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Individual Option */}
                <div
                  onClick={() => setAccountType("INDIVIDUAL")}
                  className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-gray-300 bg-white hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <FaUser className="text-5xl mb-4 text-gray-400" />
                  <span className="font-semibold text-lg text-gray-700">
                    Individual
                  </span>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Register as an individual tax professional
                  </p>
                </div>

                {/* Company Option */}
                <div
                  onClick={() => setAccountType("COMPANY")}
                  className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-gray-300 bg-white hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <FaBuilding className="text-5xl mb-4 text-gray-400" />
                  <span className="font-semibold text-lg text-gray-700">
                    Company
                  </span>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Register as a company or organization
                  </p>
                </div>
              </div>

              <Errors message={errors.accountType} />
            </div>

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
          </div>
        )}

        {/* Registration Form - Show this after selecting account type */}
        {accountType && (
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Show selected account type with option to change */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {accountType === "INDIVIDUAL" ? (
                    <FaUser className="text-2xl text-blue-600" />
                  ) : (
                    <FaBuilding className="text-2xl text-blue-600" />
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Account Type</p>
                    <p className="font-semibold text-blue-800">
                      {accountType === "INDIVIDUAL" ? "Individual" : "Company"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAccountType("")}
                  className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Change
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-800 text-center font-medium italic">
                Please fill in all details manually. All fields are mandatory.
              </p>
            </div>

            {/* Registration Information */}
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-800 text-center font-medium">
                {accountType
                  ? `${
                      accountType === "INDIVIDUAL" ? "Individual" : "Company"
                    } Registration`
                  : "Registration Information"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TIN Field */}
              {renderField(
                <ApplicantForm
                  label={accountType === "COMPANY" ? "Company TIN" : "TIN"}
                  value={tin}
                  onChange={(e) => setTin(e.target.value)}
                  placeholder={
                    accountType === "COMPANY" ? "Company TIN" : "TIN"
                  }
                  disabled={false}
                />,
                "tin"
              )}

              {/* Names/Company Name Field */}
              {accountType === "INDIVIDUAL"
                ? renderField(
                    <ApplicantForm
                      label="Names"
                      icon={<FaUser />}
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Full Names"
                      disabled={false}
                    />,
                    "fullname"
                  )
                : renderField(
                    <ApplicantForm
                      label="Company Name"
                      icon={<MdBusiness />}
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Company Name"
                      disabled={false}
                    />,
                    "businessName"
                  )}

              {/* Email Field */}
              {renderField(
                <ApplicantForm
                  label={
                    accountType === "COMPANY"
                      ? "Company Email"
                      : "Email Address"
                  }
                  type="email"
                  icon={<FaEnvelope />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    accountType === "COMPANY"
                      ? "Email Address"
                      : "Email Address"
                  }
                  disabled={false}
                />,
                "email"
              )}

              {/* National ID / Passport - Only for Individual */}
              {accountType === "INDIVIDUAL" &&
                renderField(
                  <ApplicantForm
                    label="National ID / Passport"
                    value={nid}
                    onChange={(e) => setNid(e.target.value)}
                    placeholder="National ID or Passport Number"
                    disabled={false}
                  />,
                  "nid"
                )}

              {/* Phone Number Field */}
              {renderField(
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-2">
                    {accountType === "COMPANY"
                      ? "Company Phone Number"
                      : "Phone Number"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => {
                        let value = e.target.value;
                        // Ensure phone number starts with +
                        if (!value.startsWith("+")) {
                          value = "+" + value;
                        }
                        setPhoneNumber(value);
                      }}
                      placeholder={
                        accountType === "COMPANY"
                          ? "+250788123456"
                          : "+250788123456"
                      }
                      disabled={false}
                      className="mdc-input py-4 pl-5 pr-5 text-base"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-2xl pointer-events-none">
                      <FaPhone />
                    </span>
                  </div>
                </div>,
                "phoneNumber"
              )}

              {/* Location Fields */}
              {renderField(
                <ApplicantForm
                  label="Province"
                  value={province}
                  onChange={(e) => handleProvinceChange(e as React.ChangeEvent<HTMLSelectElement>)}
                  placeholder="Province"
                  disabled={false}
                  applicantData={provinces}
                />,
                "province"
              )}

              {renderField(
                <ApplicantForm
                  label="District"
                  value={district}
                  onChange={(e) => handleDistrictChange(e as React.ChangeEvent<HTMLSelectElement>)}
                  placeholder="District"
                  disabled={!province}
                  applicantData={districts}
                />,
                "district"
              )}

              {renderField(
                <ApplicantForm
                  label="Sector"
                  value={sector}
                  onChange={(e) => handleSectorChange(e as React.ChangeEvent<HTMLSelectElement>)}
                  placeholder="Sector"
                  disabled={!district}
                  applicantData={sectors}
                />,
                "sector"
              )}

              {renderField(
                <ApplicantForm
                  label="Cell"
                  value={cell}
                  onChange={(e) => handleCellChange(e as React.ChangeEvent<HTMLSelectElement>)}
                  placeholder="Cell"
                  disabled={!sector}
                  applicantData={cells}
                />,
                "cell"
              )}

              {renderField(
                <ApplicantForm
                  label="Village"
                  value={village}
                  onChange={(e) => handleVillageChange(e as React.ChangeEvent<HTMLSelectElement>)}
                  placeholder="Village"
                  disabled={!cell}
                  applicantData={villages}
                />,
                "village"
              )}

              {/* Password Field */}
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

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setAccountType("")}
                  className="mdc-button mdc-button-secondary w-1/3 py-3"
              >
                Back
              </button>
                <button
                  type="submit"
                  disabled={registering}
                  className="mdc-button mdc-button-primary w-2/3 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
