import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaCheckCircle,
} from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdBusiness } from "react-icons/md";
import rra from "../imgs/rra.png";
import { useNavigate } from "react-router-dom";
import ApplicantForm from "../components/ApplicantForm";
import Errors from "../components/Errors";
import { getProvince } from "../services/Province";
import { getDistrict } from "../services/District";
import { getSector } from "../services/Sector";
import { getCell } from "../services/Cell";
import { getVillage } from "../services/Villages";
import { addApplicant } from "../services/SignUp";
import { addCompany } from "../services/CompanyRegister";
import { determineSignupType } from "../services/SignupType";
import { validateTin } from "../services/ValidateTin";

const SignUpPage: React.FC = () => {
  console.log("SignUpPage: Component rendering");

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState("");

  // Individual form state
  const [tin, setTin] = useState("");
  const [nid, setNid] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  // Company form state
  const [companyName, setCompanyName] = useState("");
  const [companyTin, setCompanyTin] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");

  // Location state (shared for both individual and company)
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [cell, setCell] = useState("");
  const [village, setVillage] = useState("");

  // Location data
  const [provincedata, setProvincedata] = useState<any[]>([]);
  const [districtdata, setDistrictdata] = useState<any[]>([]);
  const [sectordata, setSectordata] = useState<any[]>([]);
  const [celldata, setCelldata] = useState<any[]>([]);
  const [villagedata, setVillagedata] = useState<any[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [validatingTin, setValidatingTin] = useState(false);
  const [validatingCompanyTin, setValidatingCompanyTin] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<any>({});

  const navigate = useNavigate();

  // Fetch provinces on mount
  useEffect(() => {
    console.log("SignUpPage: Fetching provinces");

    getProvince()
      .then((response) => {
        console.log("SignUpPage: Provinces response:", response.data);

        let data = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && typeof response.data === "object") {
          const arrayValue = Object.values(response.data).find((val: any) =>
            Array.isArray(val)
          );
          if (arrayValue) data = arrayValue as any[];
        }

        console.log("SignUpPage: Setting provinces:", data.length);
        setProvincedata(data);
      })
      .catch((error) => {
        console.error("SignUpPage: Error fetching provinces:", error);
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

    const selectedProvince = provincedata.find(
      (p: any) =>
        p.locationId === province || p.id === province || p.name === province
    );

    if (!selectedProvince) return;

    const provinceId = selectedProvince.locationId || selectedProvince.id;
    console.log("SignUpPage: Fetching districts for province:", provinceId);

    getDistrict(provinceId)
      .then((response) => {
        let data = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && typeof response.data === "object") {
          const arrayValue = Object.values(response.data).find((val: any) =>
            Array.isArray(val)
          );
          if (arrayValue) data = arrayValue as any[];
        }

        setDistrictdata(data);
        setDistrict("");
        setSector("");
        setCell("");
        setVillage("");
        setSectordata([]);
        setCelldata([]);
        setVillagedata([]);
      })
      .catch((error) => {
        console.error("SignUpPage: Error fetching districts:", error);
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

    const selectedDistrict = districtdata.find(
      (d: any) =>
        d.locationId === district || d.id === district || d.name === district
    );

    if (!selectedDistrict) return;

    const districtId = selectedDistrict.locationId || selectedDistrict.id;
    console.log("SignUpPage: Fetching sectors for district:", districtId);

    getSector(districtId)
      .then((response) => {
        let data = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && typeof response.data === "object") {
          const arrayValue = Object.values(response.data).find((val: any) =>
            Array.isArray(val)
          );
          if (arrayValue) data = arrayValue as any[];
        }

        setSectordata(data);
        setSector("");
        setCell("");
        setVillage("");
        setCelldata([]);
        setVillagedata([]);
      })
      .catch((error) => {
        console.error("SignUpPage: Error fetching sectors:", error);
        setSectordata([]);
      });
  }, [district, districtdata]);

  // Fetch cells when sector is selected
  useEffect(() => {
    if (!sector) {
      setCelldata([]);
      setCell("");
      return;
    }

    const selectedSector = sectordata.find(
      (s: any) =>
        s.locationId === sector || s.id === sector || s.name === sector
    );

    if (!selectedSector) return;

    const sectorId = selectedSector.locationId || selectedSector.id;
    console.log("SignUpPage: Fetching cells for sector:", sectorId);

    getCell(sectorId)
      .then((response) => {
        let data = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && typeof response.data === "object") {
          const arrayValue = Object.values(response.data).find((val: any) =>
            Array.isArray(val)
          );
          if (arrayValue) data = arrayValue as any[];
        }

        setCelldata(data);
        setCell("");
        setVillage("");
        setVillagedata([]);
      })
      .catch((error) => {
        console.error("SignUpPage: Error fetching cells:", error);
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

    const selectedCell = celldata.find(
      (c: any) => c.locationId === cell || c.id === cell || c.name === cell
    );

    if (!selectedCell) return;

    const cellId = selectedCell.locationId || selectedCell.id;
    console.log("SignUpPage: Fetching villages for cell:", cellId);

    getVillage(cellId)
      .then((response) => {
        let data = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && typeof response.data === "object") {
          const arrayValue = Object.values(response.data).find((val: any) =>
            Array.isArray(val)
          );
          if (arrayValue) data = arrayValue as any[];
        }

        setVillagedata(data);
        setVillage("");
      })
      .catch((error) => {
        console.error("SignUpPage: Error fetching villages:", error);
        setVillagedata([]);
      });
  }, [cell, celldata]);

  const handleValidateIndividualTin = () => {
    if (!tin.trim()) {
      setErrors({ ...errors, tin: "Please enter TIN before validating" });
      return;
    }

    if (!/^[0-9]{9}$/.test(tin.trim())) {
      setErrors({ ...errors, tin: "TIN must be 9 digits" });
      return;
    }

    setValidatingTin(true);
    setError("");
    const currentErrors = { ...errors };
    delete currentErrors.tin;
    setErrors(currentErrors);

    console.log("SignUpPage: Validating individual TIN:", tin);

    validateTin(tin.trim())
      .then((response) => {
        console.log("SignUpPage: TIN validation successful:", response.data);
        setValidatingTin(false);

        const data = response.data;
        
        // Auto-fill form fields with validated data
        if (data.name) setFullname(data.name);
        if (data.email) setEmail(data.email);
        if (data.phoneNumber) setPhoneNumber(data.phoneNumber);
        
        alert("TIN validated successfully! Form fields have been auto-filled.");
      })
      .catch((error) => {
        console.error("SignUpPage: TIN validation error:", error);
        setValidatingTin(false);
        
        if (error.response?.data?.message) {
          setErrors({ ...errors, tin: error.response.data.message });
        } else if (error.message) {
          setErrors({ ...errors, tin: "Failed to validate TIN: " + error.message });
        } else {
          setErrors({ ...errors, tin: "TIN validation failed. Please check the TIN number." });
        }
      });
  };

  const handleValidateCompanyTin = () => {
    if (!companyTin.trim()) {
      setErrors({ ...errors, companyTin: "Please enter Company TIN before validating" });
      return;
    }

    if (!/^[0-9]{9}$/.test(companyTin.trim())) {
      setErrors({ ...errors, companyTin: "Company TIN must be 9 digits" });
      return;
    }

    setValidatingCompanyTin(true);
    setError("");
    const currentErrors = { ...errors };
    delete currentErrors.companyTin;
    setErrors(currentErrors);

    console.log("SignUpPage: Validating company TIN:", companyTin);

    validateTin(companyTin.trim())
      .then((response) => {
        console.log("SignUpPage: Company TIN validation successful:", response.data);
        setValidatingCompanyTin(false);

        const data = response.data;
        
        // Auto-fill form fields with validated data
        if (data.name) setCompanyName(data.name);
        if (data.email) setCompanyEmail(data.email);
        
        alert("Company TIN validated successfully! Form fields have been auto-filled.");
      })
      .catch((error) => {
        console.error("SignUpPage: Company TIN validation error:", error);
        setValidatingCompanyTin(false);
        
        if (error.response?.data?.message) {
          setErrors({ ...errors, companyTin: error.response.data.message });
        } else if (error.message) {
          setErrors({ ...errors, companyTin: "Failed to validate TIN: " + error.message });
        } else {
          setErrors({ ...errors, companyTin: "TIN validation failed. Please check the TIN number." });
        }
      });
  };

  const handleAccountTypeNext = () => {
    setError("");
    setErrors({});

    if (!accountType) {
      setErrors({ accountType: "Please select an account type" });
      return;
    }

    setLoading(true);

    // Call signup-type endpoint to validate
    determineSignupType(accountType)
      .then((response) => {
        console.log("SignUpPage: Account type confirmed:", response.data);
        setLoading(false);
        setCurrentStep(2);
      })
      .catch((error) => {
        console.error("SignUpPage: Error confirming account type:", error);
        setLoading(false);
        setError(
          error.response?.data?.message || "Failed to confirm account type"
        );
      });
  };

  const getLocationIds = () => {
    const selectedProvince = provincedata.find(
      (p: any) =>
        p.locationId === province || p.id === province || p.name === province
    );
    const selectedDistrict = districtdata.find(
      (d: any) =>
        d.locationId === district || d.id === district || d.name === district
    );
    const selectedSector = sectordata.find(
      (s: any) =>
        s.locationId === sector || s.id === sector || s.name === sector
    );
    const selectedCell = celldata.find(
      (c: any) => c.locationId === cell || c.id === cell || c.name === cell
    );
    const selectedVillage = villagedata.find(
      (v: any) =>
        v.locationId === village || v.id === village || v.name === village
    );

    const provinceId = selectedProvince?.locationId || selectedProvince?.id;
    const districtId = selectedDistrict?.locationId || selectedDistrict?.id;
    const sectorId = selectedSector?.locationId || selectedSector?.id;
    const cellId = selectedCell?.locationId || selectedCell?.id;
    const villageId = selectedVillage?.locationId || selectedVillage?.id;

    return {
      provinceId:
        typeof provinceId === "string" ? parseInt(provinceId, 10) : provinceId,
      districtId:
        typeof districtId === "string" ? parseInt(districtId, 10) : districtId,
      sectorId:
        typeof sectorId === "string" ? parseInt(sectorId, 10) : sectorId,
      cellId: typeof cellId === "string" ? parseInt(cellId, 10) : cellId,
      villageId:
        typeof villageId === "string" ? parseInt(villageId, 10) : villageId,
    };
  };

  const validateIndividualForm = () => {
    const formErrors: any = {};

    if (!tin.trim()) formErrors.tin = "TIN is required";
    else if (!/^[0-9]{9}$/.test(tin.trim()))
      formErrors.tin = "TIN must be 9 digits";

    if (!nid.trim()) formErrors.nid = "National-ID is required";
    else if (!/^[0-9]{16}$/.test(nid.trim()))
      formErrors.nid = "NID must be 16 digits";

    if (!fullname.trim()) formErrors.fullname = "Full name is required";
    else if (fullname.trim().length < 3)
      formErrors.fullname = "Full name must be at least 3 characters";

    if (!email.trim()) formErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      formErrors.email = "Email is invalid";

    if (!phoneNumber.trim())
      formErrors.phoneNumber = "Phone number is required";
    else if (!/^\+250\d{9}$/.test(phoneNumber))
      formErrors.phoneNumber = "Phone number must be in format +250XXXXXXXXX";

    if (!password) formErrors.password = "Password is required";
    else if (password.length < 8)
      formErrors.password = "Password must be at least 8 characters";
    else if (
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])/.test(password)
    ) {
      formErrors.password =
        "Password must contain digit, lowercase, uppercase, and special character";
    }

    if (!province) formErrors.province = "Province is required";
    if (!district) formErrors.district = "District is required";
    if (!sector) formErrors.sector = "Sector is required";
    if (!cell) formErrors.cell = "Cell is required";
    if (!village) formErrors.village = "Village is required";

    return formErrors;
  };

  const validateCompanyForm = () => {
    const formErrors: any = {};

    if (!companyName.trim())
      formErrors.companyName = "Company name is required";
    else if (companyName.trim().length < 2)
      formErrors.companyName = "Company name must be at least 2 characters";

    if (!companyTin.trim()) formErrors.companyTin = "Company TIN is required";
    else if (!/^[0-9]{9}$/.test(companyTin.trim()))
      formErrors.companyTin = "Company TIN must be 9 digits";

    if (!companyEmail.trim())
      formErrors.companyEmail = "Company email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail.trim()))
      formErrors.companyEmail = "Company email is invalid";

    if (!companyPassword) formErrors.companyPassword = "Password is required";
    else if (companyPassword.length < 8)
      formErrors.companyPassword = "Password must be at least 8 characters";
    else if (
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])/.test(
        companyPassword
      )
    ) {
      formErrors.companyPassword =
        "Password must contain digit, lowercase, uppercase, and special character";
    }

    if (!province) formErrors.province = "Province is required";
    if (!district) formErrors.district = "District is required";
    if (!sector) formErrors.sector = "Sector is required";
    if (!cell) formErrors.cell = "Cell is required";
    if (!village) formErrors.village = "Village is required";

    return formErrors;
  };

  const handleIndividualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formErrors = validateIndividualForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const locationIds = getLocationIds();

      // Validate location IDs
      if (!locationIds.provinceId || isNaN(locationIds.provinceId)) {
        setErrors({ province: "Province ID not found. Please select again." });
        setLoading(false);
        return;
      }
      if (!locationIds.districtId || isNaN(locationIds.districtId)) {
        setErrors({ district: "District ID not found. Please select again." });
        setLoading(false);
        return;
      }
      if (!locationIds.sectorId || isNaN(locationIds.sectorId)) {
        setErrors({ sector: "Sector ID not found. Please select again." });
        setLoading(false);
        return;
      }
      if (!locationIds.cellId || isNaN(locationIds.cellId)) {
        setErrors({ cell: "Cell ID not found. Please select again." });
        setLoading(false);
        return;
      }
      if (!locationIds.villageId || isNaN(locationIds.villageId)) {
        setErrors({ village: "Village ID not found. Please select again." });
        setLoading(false);
        return;
      }

      const signupData = {
        tin: tin.trim(),
        nid: nid.trim(),
        fullName: fullname.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password: password,
        provinceId: locationIds.provinceId,
        districtId: locationIds.districtId,
        sectorId: locationIds.sectorId,
        cellId: locationIds.cellId,
        villageId: locationIds.villageId,
      };

      console.log(
        "SignUpPage: Submitting individual registration:",
        signupData
      );

      addApplicant(signupData)
        .then((response) => {
          console.log(
            "SignUpPage: Individual registration successful:",
            response
          );
          setLoading(false);
          alert("Registration successful! Please login to continue.");
          navigate("/");
        })
        .catch((error) => {
          console.error("SignUpPage: Individual registration error:", error);
          setLoading(false);

          if (error.response?.data) {
            const errorData = error.response.data;

            if (errorData.errors && Array.isArray(errorData.errors)) {
              const backendErrors: any = {};
              errorData.errors.forEach((err: any) => {
                if (err.field) {
                  backendErrors[err.field] = err.message || err.defaultMessage;
                }
              });
              setErrors(backendErrors);
              setError(
                errorData.message || "Validation failed. Please check the form."
              );
            } else if (errorData.message) {
              setError(errorData.message);
            } else if (typeof errorData === "string") {
              setError(errorData);
            } else {
              setError(JSON.stringify(errorData));
            }
          } else if (error.message) {
            setError(error.message);
          } else {
            setError("Registration failed. Please try again.");
          }
        });
    } else {
      setLoading(false);
    }
  };

  const handleCompanySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formErrors = validateCompanyForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const locationIds = getLocationIds();

      // Validate location IDs
      if (!locationIds.provinceId || isNaN(locationIds.provinceId)) {
        setErrors({ province: "Province ID not found. Please select again." });
        setLoading(false);
        return;
      }
      if (!locationIds.districtId || isNaN(locationIds.districtId)) {
        setErrors({ district: "District ID not found. Please select again." });
        setLoading(false);
        return;
      }
      if (!locationIds.sectorId || isNaN(locationIds.sectorId)) {
        setErrors({ sector: "Sector ID not found. Please select again." });
        setLoading(false);
        return;
      }
      if (!locationIds.cellId || isNaN(locationIds.cellId)) {
        setErrors({ cell: "Cell ID not found. Please select again." });
        setLoading(false);
        return;
      }
      if (!locationIds.villageId || isNaN(locationIds.villageId)) {
        setErrors({ village: "Village ID not found. Please select again." });
        setLoading(false);
        return;
      }

      // Prepare company data (members will be added from dashboard)
      const companyData = {
        companyTin: companyTin.trim(),
        companyName: companyName.trim(),
        companyEmail: companyEmail.trim(),
        password: companyPassword,
        provinceId: locationIds.provinceId,
        districtId: locationIds.districtId,
        sectorId: locationIds.sectorId,
        cellId: locationIds.cellId,
        villageId: locationIds.villageId,
      };

      console.log("SignUpPage: Submitting company registration:", companyData);

      addCompany(companyData)
        .then((response) => {
          console.log("SignUpPage: Company registration successful:", response);
          setLoading(false);
          alert(
            "Company registration successful! Please login to add members from your dashboard."
          );
          navigate("/");
        })
        .catch((error) => {
          console.error("SignUpPage: Company registration error:", error);
          setLoading(false);

          if (error.response?.data) {
            const errorData = error.response.data;

            if (errorData.errors && Array.isArray(errorData.errors)) {
              const backendErrors: any = {};
              errorData.errors.forEach((err: any) => {
                if (err.field) {
                  backendErrors[err.field] = err.message || err.defaultMessage;
                }
              });
              setErrors(backendErrors);
              setError(
                errorData.message || "Validation failed. Please check the form."
              );
            } else if (errorData.message) {
              setError(errorData.message);
            } else if (typeof errorData === "string") {
              setError(errorData);
            } else {
              setError(JSON.stringify(errorData));
            }
          } else if (error.message) {
            setError(error.message);
          } else {
            setError("Company registration failed. Please try again.");
          }
        });
    } else {
      setLoading(false);
      // Scroll to first error
      const firstErrorKey = Object.keys(formErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const renderField = (input: React.ReactNode, errorKey: string) => (
    <div className="flex flex-col">
      {input}
      <Errors message={errors[errorKey]} />
    </div>
  );

  const renderLocationFields = () => (
    <>
      {renderField(
        <ApplicantForm
          label="Province"
          icon={<RiArrowDropDownLine />}
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          applicantData={provincedata}
        />,
        "province"
      )}

      {renderField(
        <ApplicantForm
          label="District"
          icon={<RiArrowDropDownLine />}
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          applicantData={districtdata}
        />,
        "district"
      )}

      {renderField(
        <ApplicantForm
          label="Sector"
          icon={<RiArrowDropDownLine />}
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          applicantData={sectordata}
        />,
        "sector"
      )}

      {renderField(
        <ApplicantForm
          label="Cell"
          icon={<RiArrowDropDownLine />}
          value={cell}
          onChange={(e) => setCell(e.target.value)}
          applicantData={celldata}
        />,
        "cell"
      )}

      {renderField(
        <ApplicantForm
          label="Village"
          icon={<RiArrowDropDownLine />}
          value={village}
          onChange={(e) => setVillage(e.target.value)}
          applicantData={villagedata}
        />,
        "village"
      )}
    </>
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
                  <span className="text-xs text-gray-500 mt-1 text-center">
                    Register as an individual tax professional
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
                  <span className="text-xs text-gray-500 mt-1 text-center">
                    Register multiple members under a company
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

        {/* Step 2a: Individual Form */}
        {currentStep === 2 && accountType === "INDIVIDUAL" && (
          <form onSubmit={handleIndividualSubmit} className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-800 text-center font-medium">
                Individual Registration
              </p>
            </div>

            {renderField(
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">TIN</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tin}
                    onChange={(e) => setTin(e.target.value)}
                    placeholder="Enter 9-digit TIN"
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-lg py-4 px-5 text-base text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleValidateIndividualTin}
                    disabled={validatingTin || !tin.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 rounded-lg transition duration-200 whitespace-nowrap flex items-center gap-2"
                  >
                    <FaCheckCircle />
                    {validatingTin ? "Validating..." : "Validate"}
                  </button>
                </div>
              </div>,
              "tin"
            )}

            {renderField(
              <ApplicantForm
                label="National ID"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                placeholder="Enter 16-digit NID"
              />,
              "nid"
            )}

            {renderField(
              <ApplicantForm
                label="Full Name"
                icon={<FaUser />}
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Enter your full name"
              />,
              "fullname"
            )}

            {renderField(
              <ApplicantForm
                label="Email"
                type="email"
                icon={<FaEnvelope />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />,
              "email"
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
                      const value = e.target.value.replace(/\D/g, ""); // Only allow digits
                      if (value.length <= 9) {
                        setPhoneNumber("+250" + value);
                      }
                    }}
                    placeholder="XXXXXXXXX"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-4 pl-16 pr-5 text-base text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
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
                label="Password"
                type="password"
                icon={<FaLock />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
              />,
              "password"
            )}

            <div className="border-t pt-4 mt-4">
              <h3 className="text-md font-semibold text-gray-700 mb-3">
                Location Information
              </h3>
              {renderLocationFields()}
            </div>

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
                disabled={loading}
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
        )}

        {/* Step 2b: Company Form */}
        {currentStep === 2 && accountType === "COMPANY" && (
          <form onSubmit={handleCompanySubmit} className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-800 text-center font-medium">
                Company Registration
              </p>
            </div>

            {/* Company Information */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="text-md font-semibold text-gray-700 flex items-center gap-2">
                <MdBusiness className="text-blue-600" />
                Company Information
              </h3>

              {renderField(
                <ApplicantForm
                  label="Company Name"
                  icon={<FaBuilding />}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                />,
                "companyName"
              )}

              {renderField(
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-2">Company TIN</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={companyTin}
                      onChange={(e) => setCompanyTin(e.target.value)}
                      placeholder="Enter 9-digit company TIN"
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-lg py-4 px-5 text-base text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleValidateCompanyTin}
                      disabled={validatingCompanyTin || !companyTin.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 rounded-lg transition duration-200 whitespace-nowrap flex items-center gap-2"
                    >
                      <FaCheckCircle />
                      {validatingCompanyTin ? "Validating..." : "Validate"}
                    </button>
                  </div>
                </div>,
                "companyTin"
              )}

              {renderField(
                <ApplicantForm
                  label="Company Email"
                  type="email"
                  icon={<FaEnvelope />}
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="Enter company email"
                />,
                "companyEmail"
              )}

              {renderField(
                <ApplicantForm
                  label="Password"
                  type="password"
                  icon={<FaLock />}
                  value={companyPassword}
                  onChange={(e) => setCompanyPassword(e.target.value)}
                  placeholder="Create password"
                />,
                "companyPassword"
              )}

              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Company Location
                </h4>
                {renderLocationFields()}
              </div>
            </div>

            {/* Info about adding members later */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You can add company members from your
                dashboard after registration.
              </p>
            </div>

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
                disabled={loading}
                className="w-2/3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-full transition duration-200"
              >
                {loading ? "Registering..." : "Register Company"}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-xs sm:text-sm lg:text-base text-center mt-2">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
