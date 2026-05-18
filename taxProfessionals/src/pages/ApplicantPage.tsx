import React, { useEffect, useState } from "react";
import ApplicantForm from "../components/ApplicantForm";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdCloudUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Errors from "../components/Errors";
import rra from "../imgs/rra.png";
import { getProvince } from "../services/Province";
import { getDistrict } from "../services/District";
import { getSector } from "../services/Sector";
import { getCell } from "../services/Cell";
import { getVillage } from "../services/Villages";
import { getCurrentUser } from "../services/getCurrentUser";
import { getCompanyMembers } from "../services/getCompanyMembers";
import type { CompanyMember } from "../types/company";

function ApplicantPage() {
  const navigate = useNavigate();

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [cell, setCell] = useState("");
  const [village, setVillage] = useState("");

  // Location data lists (provincedata already exists as state below)
  const [districts, setDistricts] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [cells, setCells] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);

  const [bachelor, setBachelor] = useState<File | null>(null);
  const [professionalDocs, setProfessionalDocs] = useState<FileList | null>(
    null
  );
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(2);
  const [provincedata, setProvincedata] = useState<any[]>([]);
  const [isCompanyAdmin, setIsCompanyAdmin] = useState(false);
  const [companyMembers, setCompanyMembers] = useState<CompanyMember[]>([]);
  const [selectedMemberTpin, setSelectedMemberTpin] = useState<string | null>(
    null
  );
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await getCurrentUser();
        const userData = response.data.data;

        // Check if this is a company account by checking for tinCompany field
        if (userData.tinCompany) {
          setIsCompanyAdmin(true);

          // Use members from response if available (similar to CompanyDashboard)
          if (userData.members && Array.isArray(userData.members)) {
            setCompanyMembers(userData.members);
          }

          // Check if member TPIN is selected (from company dashboard)
          const storedMemberTpin = localStorage.getItem("selectedMemberTpin");
          if (storedMemberTpin) {
            setSelectedMemberTpin(storedMemberTpin);

            // Try to fetch additional members from API if companyId is available
            // This is optional - we already have members from getCurrentUser response
            const companyIdentifier = userData.companyId || userData.tinCompany;
            if (companyIdentifier) {
              try {
                const companyId =
                  typeof companyIdentifier === "number"
                    ? companyIdentifier
                    : parseInt(companyIdentifier) || 0;
                if (companyId > 0) {
                  const membersResponse = await getCompanyMembers(companyId);
                  if (
                    membersResponse.data.data &&
                    membersResponse.data.data.length > 0
                  ) {
                    setCompanyMembers(membersResponse.data.data);
                  }
                }
              } catch (err: any) {
                // Endpoint might not exist yet (401/404) - this is expected
                if (
                  err.response?.status === 401 ||
                  err.response?.status === 404
                ) {
                  console.log(
                    "ApplicantPage: Members endpoint not available, using members from response"
                  );
                } else {
                  console.error("ApplicantPage: Error fetching members:", err);
                }
                // Members from response are already set above, so we're good
              }
            }
          } else {
            // No member selected - redirect to company dashboard
            navigate("/company-dashboard");
            return;
          }
        }
      } catch (err: any) {
        console.error("ApplicantPage: Auth error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("tinNumber");
          navigate("/");
        }
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();

    getProvince()
      .then((response) => {
        // Handle nested data structure: response.data.data or response.data
        console.log("Province API Full Response:", response);
        console.log("Province API Response Data:", response.data);

        // Try different possible structures
        let data: any[] = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && typeof response.data === "object") {
          // If it's an object, try to find an array property
          const foundArray = Object.values(response.data).find((val: any) =>
            Array.isArray(val)
          );
          data = Array.isArray(foundArray) ? foundArray : [];
        }

        console.log("Final Province Data:", data);
        setProvincedata(data);
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
        setProvincedata([]);
      });
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors: any = {};

    if (!province) formErrors.province = "Province is required";
    if (!district) formErrors.district = "District is required";
    if (!sector) formErrors.sector = "Sector is required";
    if (!cell) formErrors.cell = "Cell is required";
    if (!village) formErrors.village = "Village is required";
    if (!bachelor) formErrors.bachelor = "Please upload your Bachelor Degree";
    if (!professionalDocs || professionalDocs.length === 0)
      formErrors.professionalDocs = "Please upload professional documents";
    if (!date) formErrors.date = "Date is required";
    if (!status) formErrors.status = "Status is required";

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Clear selected member from localStorage if company admin
      if (isCompanyAdmin) {
        localStorage.removeItem("selectedMemberTpin");
      }
      navigate("/success");
    }
  };

  const validateStep2 = () => {
    const stepErrors: any = {};
    if (!province) stepErrors.province = "Province is required";
    if (!district) stepErrors.district = "District is required";
    if (!sector) stepErrors.sector = "Sector is required";
    if (!cell) stepErrors.cell = "Cell is required";
    if (!village) stepErrors.village = "Village is required";

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Location change handlers
  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pName = e.target.value;
    setProvince(pName);
    
    setSector("");
    setCell("");
    setVillage("");
    setDistricts([]);
    setSectors([]);
    setCells([]);
    setVillages([]);

    if (pName) {
      const selectedProv = provincedata.find(p => p.name === pName);
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

  const renderField = (input: React.ReactNode, errorKey: string) => (
    <div className="flex flex-col">
      {input}
      <Errors message={errors[errorKey]} />
    </div>
  );

  if (checkingAuth) {
    return (
      <div className="mdc-page">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mdc-page items-start">
      <div className="max-w-4xl mx-auto">
        <div className="mdc-card p-4 sm:p-6 lg:p-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img
              src={rra}
              alt="RRA Logo"
              className="h-20 sm:h-22 lg:h-28 object-contain"
            />
          </div>

          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              Applicant Registration
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Please fill out all required fields carefully.
            </p>
            {isCompanyAdmin && selectedMemberTpin && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-800">
                  Creating application for member:
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  {(() => {
                    const selectedMember = companyMembers.find(
                      (m) => m.tpin === selectedMemberTpin
                    );
                    return selectedMember?.fullName || selectedMemberTpin;
                  })()}
                </p>
              </div>
            )}

            <div className="flex justify-center mt-4 sm:mt-6 mb-2">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full ${
                    currentStep >= 2
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <span className="text-xs sm:text-sm">1</span>
                </div>
                <div
                  className={`w-8 sm:w-12 lg:w-16 h-1 mx-1 sm:mx-2 ${
                    currentStep >= 3 ? "bg-green-600" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full ${
                    currentStep >= 3
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <span className="text-xs sm:text-sm">2</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center text-xs sm:text-sm text-gray-600">
              <span className="w-16 sm:w-20 lg:w-24 text-center">Location</span>
              <span className="w-16 sm:w-20 lg:w-24 text-center mx-2 sm:mx-4 lg:mx-8">
                Education
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 sm:space-y-8 lg:space-y-10"
          >
            {currentStep === 2 && (
              <section>
                <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-4 sm:mb-5 border-b border-gray-200 pb-2">
                  Location Information
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8">
                  {renderField(
                    <ApplicantForm
                      label="Province"
                      icon={<RiArrowDropDownLine />}
                      value={province}
                      onChange={(e) => handleProvinceChange(e as React.ChangeEvent<HTMLSelectElement>)}
                      applicantData={provincedata}
                    />,
                    "province"
                  )}
                  {renderField(
                    <ApplicantForm
                      label="District"
                      icon={<RiArrowDropDownLine />}
                      value={district}
                      onChange={(e) => handleDistrictChange(e as React.ChangeEvent<HTMLSelectElement>)}
                      disabled={!province}
                      applicantData={districts}
                    />,
                    "district"
                  )}
                  {renderField(
                    <ApplicantForm
                      label="Sector"
                      icon={<RiArrowDropDownLine />}
                      value={sector}
                      onChange={(e) => handleSectorChange(e as React.ChangeEvent<HTMLSelectElement>)}
                      disabled={!district}
                      applicantData={sectors}
                    />,
                    "sector"
                  )}
                  {renderField(
                    <ApplicantForm
                      label="Cell"
                      icon={<RiArrowDropDownLine />}
                      value={cell}
                      onChange={(e) => handleCellChange(e as React.ChangeEvent<HTMLSelectElement>)}
                      disabled={!sector}
                      applicantData={cells}
                    />,
                    "cell"
                  )}
                  {renderField(
                    <ApplicantForm
                      label="Village"
                      icon={<RiArrowDropDownLine />}
                      value={village}
                      onChange={(e) => handleVillageChange(e as React.ChangeEvent<HTMLSelectElement>)}
                      disabled={!cell}
                      applicantData={villages}
                    />,
                    "village"
                  )}
                </div>

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-full transition duration-200 shadow-md text-sm sm:text-base order-2 sm:order-1"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition duration-200 shadow-md text-sm sm:text-base order-1 sm:order-2 mb-3 sm:mb-0"
                  >
                    Next
                  </button>
                </div>
              </section>
            )}

            {currentStep === 3 && (
              <section>
                <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-4 sm:mb-5 border-b border-gray-200 pb-2">
                  Education & Other Information
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8">
                  {renderField(
                    <div className="flex flex-col">
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        <MdCloudUpload className="text-blue-500 text-xl sm:text-2xl" />
                        Bachelor Degree (Upload)
                      </label>
                      <input
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const files = e.target.files;
                          if (files && files.length > 0) setBachelor(files[0]);
                        }}
                        className="w-full border border-gray-300 rounded-lg py-2 sm:py-3 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                      />
                    </div>,
                    "bachelor"
                  )}
                  {renderField(
                    <div className="flex flex-col">
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        <MdCloudUpload className="text-blue-500 text-xl sm:text-2xl" />
                        Professional documents (Upload Multiple)
                      </label>
                      <input
                        type="file"
                        multiple
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const files = e.target.files;
                          setProfessionalDocs(files);
                        }}
                        className="w-full border border-gray-300 rounded-lg py-2 sm:py-3 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                      />
                    </div>,
                    "professionalDocs"
                  )}
                  {renderField(
                    <ApplicantForm
                      label="Date"
                      type="date"
                      value={date}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDate(value);
                      }}
                    />,
                    "date"
                  )}
                  {renderField(
                    <div className="lg:col-start-2">
                      <ApplicantForm
                        label="Status"
                        icon={<RiArrowDropDownLine />}
                        value={status}
                        onChange={(e) => {
                          const value = e.target.value;
                          setStatus(value);
                        }}
                      />
                    </div>,
                    "status"
                  )}
                </div>

                <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-full transition duration-200 shadow-md text-sm sm:text-base order-2 sm:order-1"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition duration-200 shadow-md text-sm sm:text-base order-1 sm:order-2 mb-3 sm:mb-0"
                  >
                    Apply Now
                  </button>
                </div>
              </section>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ApplicantPage;
