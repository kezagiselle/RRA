import React, { useState, useEffect } from "react";
import { MdCloudUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import rra from "../imgs/rra.png";
import Errors from "../components/Errors";
import LoadingSpinner from "../components/LoadingSpinner";
import { uploadAllDocuments } from "../services/Upload";
import { getCurrentUser } from "../services/getCurrentUser";
import type { Application } from "../types/application";
import { ApplicationStatus } from "../types/application";

const DocumentPage: React.FC = () => {
  const navigate = useNavigate();

  const [signedLetter, setSignedLetter] = useState<File | null>(null);
  const [criminalRecord, setCriminalRecord] = useState<File | null>(null);
  const [eduCertificate, setEduCertificate] = useState<File | null>(null);
  const [recommendationLetter, setRecommendationLetter] = useState<File | null>(
    null
  );
  const [nonRefundFees, setNonRefundFees] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [taxClearanceCert, setTaxClearanceCert] = useState<File | null>(null);
  const [businessRegCert, setBusinessRegCert] = useState<File | null>(null);

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [tinNumber, setTinNumber] = useState<string | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [isReapply, setIsReapply] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(
    null
  );

  // Fetch application data to check status
  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const storedTin = localStorage.getItem("tinNumber");
        const storedToken = localStorage.getItem("authToken");

        if (!storedTin || !storedToken) {
          console.warn(
            "DocumentPage: No TIN or token found. Redirecting to login."
          );
          navigate("/");
          return;
        }

        setTinNumber(storedTin);
        setCheckingStatus(true);

        const response = await getCurrentUser();
        console.log("DocumentPage: Application data:", response.data);

        const appData = response.data.data;
        setApplication(appData);

        // Check application status
        if (appData.status === ApplicationStatus.APPROVED) {
          // APPROVED users cannot reapply - block access
          setStatusError(
            "Your application has been approved. You cannot reapply."
          );
          setRedirectCountdown(5);
        } else if (appData.status === ApplicationStatus.REJECTED) {
          // REJECTED users can reapply
          setIsReapply(true);
        } else if (appData.status === ApplicationStatus.PENDING) {
          // PENDING users can upload documents (initial application)
          setIsReapply(false);
        }
      } catch (err: any) {
        console.error("DocumentPage: Error fetching application:", err);

        if (err.response?.status === 401) {
          // Unauthorized - redirect to login
          localStorage.removeItem("authToken");
          localStorage.removeItem("tinNumber");
          navigate("/");
        } else {
          setStatusError(
            err.response?.data?.message ||
              err.message ||
              "Failed to verify application status. Please try again."
          );
        }
      } finally {
        setCheckingStatus(false);
      }
    };

    fetchApplicationData();
  }, [navigate]);

  // Countdown timer for redirect (for approved users)
  useEffect(() => {
    if (redirectCountdown !== null && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (redirectCountdown === 0) {
      navigate("/dashboard");
    }
  }, [redirectCountdown, navigate]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate PDF file type
      if (file.type !== "application/pdf") {
        setErrors({ ...errors, [fieldName]: "Only PDF files are allowed" });
        return;
      }
      setErrors({ ...errors, [fieldName]: undefined });
      setter(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formErrors: any = {};

    if (!signedLetter) formErrors.signedLetter = "Signed Letter is required";
    if (!criminalRecord)
      formErrors.criminalRecord = "Criminal Record is required";
    if (!eduCertificate)
      formErrors.eduCertificate = "Education Certificate is required";
    if (!recommendationLetter)
      formErrors.recommendationLetter = "Recommendation Letter is required";
    if (!nonRefundFees)
      formErrors.nonRefundFees = "Non-Refund Fees is required";
    if (!cv) formErrors.cv = "CV is required";
    if (!taxClearanceCert)
      formErrors.taxClearanceCert = "Tax Clearance Certificate is required";
    if (!businessRegCert)
      formErrors.businessRegCert =
        "Business Registration Certificate is required";

    // Check for TIN number and authentication token
    if (!tinNumber) {
      setErrors({
        ...formErrors,
        general: "TIN number not found. Please login again.",
      });
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrors({
        ...formErrors,
        general: "Authentication token not found. Please login again.",
      });
      setLoading(false);
      return;
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Define document types mapping
      const documents = [
        { file: signedLetter!, documentType: "SIGNEDLETTER" },
        { file: criminalRecord!, documentType: "CRIMINALRECORD" },
        { file: eduCertificate!, documentType: "EDUCERTIFICATE" },
        { file: recommendationLetter!, documentType: "RECOMMENDATIONLETTER" },
        { file: nonRefundFees!, documentType: "NONREFUNDFEES" },
        { file: cv!, documentType: "CV" },
        { file: taxClearanceCert!, documentType: "TAXCLEARANCECERTIFICATE" },
        { file: businessRegCert!, documentType: "BUSINESSREGISTRATIONCERT" },
      ];

      console.log("DocumentPage: Uploading all documents");
      console.log("DocumentPage: TIN:", tinNumber);
      console.log("DocumentPage: Is Reapply:", isReapply);
      console.log("DocumentPage: Total documents to upload:", documents.length);

      // Upload all documents (each with tpin, documentType, and file)
      uploadAllDocuments(tinNumber, documents)
        .then((response: any) => {
          console.log("DocumentPage: Upload successful:", response);
          console.log("DocumentPage: Response data:", response.data);
          setLoading(false);

          if (isReapply) {
            alert(
              "Your reapplication documents have been uploaded successfully! Your application will be reviewed again."
            );
          } else {
            alert("All documents uploaded successfully!");
          }

          // Navigate to dashboard
          navigate("/dashboard");
        })
        .catch((error: any) => {
          console.error("DocumentPage: Upload error:", error);
          console.error("DocumentPage: Error response:", error.response);
          console.error(
            "DocumentPage: Error response data:",
            error.response?.data
          );
          setLoading(false);

          if (error.response?.data?.message) {
            setErrors({ ...formErrors, general: error.response.data.message });
          } else if (error.response?.data) {
            setErrors({
              ...formErrors,
              general:
                typeof error.response.data === "string"
                  ? error.response.data
                  : JSON.stringify(error.response.data),
            });
          } else if (error.message) {
            setErrors({ ...formErrors, general: error.message });
          } else {
            setErrors({
              ...formErrors,
              general: "Upload failed. Please try again.",
            });
          }
        });
    } else {
      setLoading(false);
    }
  };

  const renderFileField = (
    label: string,
    value: File | null,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    errorKey: string,
    icon: React.ReactNode
  ) => (
    <div className="flex flex-col">
      <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
        {icon}
        {label}
      </label>
      <input
        type="file"
        accept=".pdf,application/pdf"
        onChange={onChange}
        disabled={loading || checkingStatus}
        className="w-full border border-gray-300 rounded-lg py-2 sm:py-3 px-3 sm:px-4 text-gray-700 text-xs sm:text-sm lg:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {value && (
        <p className="text-xs sm:text-sm text-green-600 mt-1 break-words">
          Selected: {value.name}
        </p>
      )}
      <Errors message={errors[errorKey]} />
    </div>
  );

  // Show loading while checking status
  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Checking application status...</p>
        </div>
      </div>
    );
  }

  // Show error if APPROVED user tries to access this page
  if (statusError && application?.status === ApplicationStatus.APPROVED) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Application Approved
          </h2>
          <p className="text-gray-600 mb-6">{statusError}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Redirecting to dashboard in {redirectCountdown} second
              {redirectCountdown !== 1 ? "s" : ""}...
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
          >
            Go to Dashboard Now
          </button>
        </div>
      </div>
    );
  }

  // Show error if status check failed
  if (statusError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{statusError}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-6 lg:py-10 px-3 sm:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img
              src={rra}
              alt="RRA Logo"
              className="h-20 sm:h-22 lg:h-28 object-contain"
            />
          </div>

          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              {isReapply ? "Reapply - Document Upload" : "Document Upload"}
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Please upload all required documents in PDF format.
            </p>
            {tinNumber && (
              <p className="text-sm text-gray-600 mt-2">TIN: {tinNumber}</p>
            )}
          </div>

          {/* Reapply Alert for Rejected Users */}
          {isReapply && application?.rejectionReason && (
            <div className="mb-6">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-orange-800 mb-2">
                      Your Previous Application Was Rejected
                    </h3>
                    <p className="text-sm text-orange-700 mb-2">
                      Please upload new documents to reapply. Your application
                      will be reviewed again.
                    </p>
                    <div className="mt-3 pt-3 border-t border-orange-200">
                      <p className="text-xs font-semibold text-orange-800 mb-1">
                        Previous Rejection Reason:
                      </p>
                      <p className="text-xs text-orange-700 whitespace-pre-wrap">
                        {application.rejectionReason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-xs sm:text-sm">
              {errors.general}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6 sm:space-y-8 lg:space-y-10"
          >
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8">
              {renderFileField(
                "Signed Letter",
                signedLetter,
                (e) => handleFileChange(e, setSignedLetter, "signedLetter"),
                "signedLetter",
                <MdCloudUpload className="text-blue-500 text-xl sm:text-2xl" />
              )}

              {renderFileField(
                "Criminal Record",
                criminalRecord,
                (e) => handleFileChange(e, setCriminalRecord, "criminalRecord"),
                "criminalRecord",
                <MdCloudUpload className="text-blue-500 text-xl sm:text-2xl" />
              )}

              {renderFileField(
                "Education Certificate",
                eduCertificate,
                (e) => handleFileChange(e, setEduCertificate, "eduCertificate"),
                "eduCertificate",
                <MdCloudUpload className="text-blue-500 text-xl sm:text-2xl" />
              )}

              {renderFileField(
                "Recommendation Letter",
                recommendationLetter,
                (e) =>
                  handleFileChange(
                    e,
                    setRecommendationLetter,
                    "recommendationLetter"
                  ),
                "recommendationLetter",
                <MdCloudUpload className="text-blue-500 text-xl sm:text-2xl" />
              )}

              {renderFileField(
                "Non-Refund Fees",
                nonRefundFees,
                (e) => handleFileChange(e, setNonRefundFees, "nonRefundFees"),
                "nonRefundFees",
                <MdCloudUpload className="text-blue-500 text-xl sm:text-2xl" />
              )}

              {renderFileField(
                "CV",
                cv,
                (e) => handleFileChange(e, setCv, "cv"),
                "cv",
                <MdCloudUpload className="text-blue-500 text-xl sm:text-2xl" />
              )}

              {renderFileField(
                "Tax Clearance Certificate",
                taxClearanceCert,
                (e) =>
                  handleFileChange(e, setTaxClearanceCert, "taxClearanceCert"),
                "taxClearanceCert",
                <MdCloudUpload className="text-blue-500 text-xl sm:text-2xl" />
              )}

              {renderFileField(
                "Business Registration Certificate",
                businessRegCert,
                (e) =>
                  handleFileChange(e, setBusinessRegCert, "businessRegCert"),
                "businessRegCert",
                <MdCloudUpload className="text-blue-500 text-xl sm:text-2xl" />
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-8 sm:mt-10">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
                className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-semibold rounded-full transition duration-200 shadow-md text-sm sm:text-base"
              >
                Back to Dashboard
              </button>
              <button
                type="submit"
                disabled={loading || checkingStatus}
                className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-full transition duration-200 shadow-md text-sm sm:text-base"
              >
                {loading
                  ? "Uploading..."
                  : isReapply
                  ? "Submit Reapplication"
                  : "Submit Documents"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
