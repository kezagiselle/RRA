import React, { useState, useEffect } from "react";
import { X, Eye, Download, RefreshCw, CheckCircle, Clock, XCircle, AlertTriangle, User, Mail, Phone, FileText, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { CompanyMember, CompanyAccount } from "../types/company";
import type { Application } from "../types/application";
import { ApplicationStatus } from "../types/application";
import type { Document as DocumentType } from "../types/document";
import { DOCUMENT_TYPE_LABELS, DocumentType as DocTypeEnum } from "../types/document";
import { getDetails } from "../services/ViewApplicantDetails";
import { getAllDocuments } from "../services/getDocuments";
import { viewDocument } from "../services/viewDocument";
import { updateDocument } from "../services/updateDocument";
import { downloadCertificate } from "../services/downloadCertificate";
import StatusBadge from "./StatusBadge";
import LoadingSpinner from "./LoadingSpinner";
import Toast from "./Toast";
import type { ToastType } from "./Toast";

interface MemberDetailsModalProps {
  member: CompanyMember;
  companyAccount: CompanyAccount;
  isOpen: boolean;
  onClose: () => void;
}

const MemberDetailsModal: React.FC<MemberDetailsModalProps> = ({
  member,
  companyAccount,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);
  const [processingDocId, setProcessingDocId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"view" | "download" | "replace" | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: ToastType }>({
    show: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    if (isOpen && member) {
      fetchMemberData();
    }
  }, [isOpen, member]);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      setDocumentsLoading(true);

      // Fetch application details
      const appResponse = await getDetails(member.tpin);
      const appData = appResponse.data.data || appResponse.data;
      setApplication(appData as Application);

      // Fetch documents
      const docsResponse = await getAllDocuments(member.tpin);
      setDocuments(docsResponse.data.data || []);
    } catch (err: any) {
      console.error("MemberDetailsModal: Error fetching member data:", err);
      showToast(
        err.response?.data?.message || "Failed to load member details",
        "error"
      );
    } finally {
      setLoading(false);
      setDocumentsLoading(false);
    }
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleViewDocument = async (docId: number) => {
    try {
      setProcessingDocId(docId);
      setActionType("view");

      const response = await viewDocument(docId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      showToast("Document opened in new tab", "success");
    } catch (err: any) {
      console.error("MemberDetailsModal: Error viewing document:", err);
      showToast(
        err.response?.data?.message || "Failed to view document",
        "error"
      );
    } finally {
      setProcessingDocId(null);
      setActionType(null);
    }
  };

  const handleDownloadDocument = async (docId: number, documentType: string) => {
    try {
      setProcessingDocId(docId);
      setActionType("download");

      const response = await viewDocument(docId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${DOCUMENT_TYPE_LABELS[documentType as DocTypeEnum] || documentType}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      showToast("Document downloaded successfully", "success");
    } catch (err: any) {
      console.error("MemberDetailsModal: Error downloading document:", err);
      showToast(
        err.response?.data?.message || "Failed to download document",
        "error"
      );
    } finally {
      setProcessingDocId(null);
      setActionType(null);
    }
  };

  const handleReplaceDocument = async (docId: number, documentType: string) => {
    if (!application) return;

    // Check if updates are allowed
    if (
      application.status !== ApplicationStatus.PENDING &&
      application.status !== ApplicationStatus.REGISTERED
    ) {
      showToast("Document updates are only allowed for PENDING or REGISTERED applications", "error");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to replace this document?"
    );
    if (!confirmed) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,application/pdf";

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) return;

      if (file.type !== "application/pdf") {
        showToast("Please select a PDF file", "error");
        return;
      }

      try {
        setProcessingDocId(docId);
        setActionType("replace");

        await updateDocument(docId, file, documentType);

        // Refresh documents list
        const docsResponse = await getAllDocuments(member.tpin);
        setDocuments(docsResponse.data.data || []);

        showToast("Document replaced successfully", "success");
      } catch (err: any) {
        console.error("MemberDetailsModal: Error replacing document:", err);
        showToast(
          err.response?.data?.message || "Failed to replace document",
          "error"
        );
      } finally {
        setProcessingDocId(null);
        setActionType(null);
      }
    };

    input.click();
  };

  const handleDownloadCertificate = async () => {
    if (!application) return;

    try {
      setDownloadingCertificate(true);

      const response = await downloadCertificate(application.tpin);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${
        application.status === ApplicationStatus.APPROVED
          ? "Approval_Certificate"
          : "Rejection_Letter"
      }_${application.tpin}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      const message = application.status === ApplicationStatus.APPROVED
        ? "Certificate downloaded successfully"
        : "Rejection letter downloaded successfully";
      showToast(message, "success");
    } catch (err: any) {
      console.error("MemberDetailsModal: Error downloading document:", err);
      
      // Handle 403 Forbidden - likely backend permission issue for company admins
      if (err.response?.status === 403) {
        showToast(
          "Access denied. The backend may need to be configured to allow company admins to download member certificates/letters. Please contact support.",
          "error"
        );
      } else {
        const errorMessage = application.status === ApplicationStatus.APPROVED
          ? "Failed to download certificate"
          : "Failed to download rejection letter";
        showToast(
          err.response?.data?.message || errorMessage,
          "error"
        );
      }
    } finally {
      setDownloadingCertificate(false);
    }
  };

  const handleReapply = () => {
    localStorage.setItem("selectedMemberTpin", member.tpin);
    navigate("/documents");
    onClose();
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch {
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return "Invalid Date";
    }
  };

  const getDocumentLabel = (doc: DocumentType): string => {
    if (doc.documentType === DocTypeEnum.EDUCERTIFICATE) {
      if (doc.certificateType === "BACHELOR") {
        return "Bachelor's Degree Certificate";
      }
      if (doc.certificateType === "PROFESSIONAL_QUALIFICATION") {
        return "Professional Qualification Certificate";
      }
      if (doc.certificateType === "MASTERS") {
        return "Master's Degree Certificate";
      }
      return "Education Certificate";
    }
    return DOCUMENT_TYPE_LABELS[doc.documentType as keyof typeof DOCUMENT_TYPE_LABELS];
  };

  // Check if member can reapply (REJECTED and hasn't reapplied before)
  const canReapply =
    application?.status === ApplicationStatus.REJECTED &&
    !application?.rejectionReason?.includes("reapplied"); // Simple check - backend should provide hasReapplied field

  // Check if document updates are allowed
  const canUpdateDocuments =
    application?.status === ApplicationStatus.PENDING ||
    application?.status === ApplicationStatus.REGISTERED;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-800/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-800">Member Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : !application ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-600">No application found for this member.</p>
              </div>
            ) : (
              <>
                {/* Member Information */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Member Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-base font-semibold text-gray-800">{member.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">TPIN</p>
                        <p className="text-base font-semibold text-gray-800">{member.tpin}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">NID</p>
                        <p className="text-base font-semibold text-gray-800">{member.nid}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="text-base font-semibold text-gray-800">{member.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="bg-blue-50 rounded-lg p-4 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <Building className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Company Name</p>
                        <p className="text-base font-semibold text-gray-800">{companyAccount.companyName}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Company TIN</p>
                        <p className="text-base font-semibold text-gray-800">{companyAccount.companyTin}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 md:col-span-2">
                      <Mail className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Company Email</p>
                        <p className="text-base font-semibold text-gray-800 break-all">{companyAccount.companyEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Status */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-center mb-4">
                    <StatusBadge status={application.status} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Application Date</p>
                      <p className="font-semibold text-gray-800">{formatDate(application.applicationDate)}</p>
                    </div>
                    {application.reviewedAt && (
                      <div>
                        <p className="text-gray-500">Reviewed At</p>
                        <p className="font-semibold text-gray-800">{formatDateTime(application.reviewedAt)}</p>
                      </div>
                    )}
                    {application.approvalDate && (
                      <div>
                        <p className="text-gray-500">Approval Date</p>
                        <p className="font-semibold text-gray-800">{formatDate(application.approvalDate)}</p>
                      </div>
                    )}
                    {application.expiryDate && (
                      <div>
                        <p className="text-gray-500">Expiry Date</p>
                        <p className="font-semibold text-gray-800">{formatDate(application.expiryDate)}</p>
                      </div>
                    )}
                  </div>

                  {/* Rejection Reason */}
                  {application.status === ApplicationStatus.REJECTED && application.rejectionReason && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-red-800 mb-2">Rejection Reason:</h4>
                          <p className="text-sm text-red-700 whitespace-pre-wrap">{application.rejectionReason}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {application.status === ApplicationStatus.APPROVED && (
                      <button
                        onClick={handleDownloadCertificate}
                        disabled={downloadingCertificate}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
                      >
                        {downloadingCertificate ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download size={20} />
                            <span>Download Certificate</span>
                          </>
                        )}
                      </button>
                    )}

                    {application.status === ApplicationStatus.REJECTED && (
                      <button
                        onClick={handleDownloadCertificate}
                        disabled={downloadingCertificate}
                        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
                      >
                        {downloadingCertificate ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download size={20} />
                            <span>Download Rejection Letter</span>
                          </>
                        )}
                      </button>
                    )}

                    {canReapply && (
                      <button
                        onClick={handleReapply}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
                      >
                        <RefreshCw size={20} />
                        <span>Reapply</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Documents Section */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800">Documents</h3>
                  </div>

                  <div className="p-4">
                    {documentsLoading ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner size="lg" />
                      </div>
                    ) : documents.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No documents uploaded yet.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                              <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">Document Type</th>
                              <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">Upload Date</th>
                              <th className="text-center px-4 py-2 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {documents.map((doc) => (
                              <tr key={doc.docId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{getDocumentLabel(doc)}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(doc.uploadedAt)}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-center space-x-2">
                                    <button
                                      onClick={() => handleViewDocument(doc.docId)}
                                      disabled={processingDocId === doc.docId && actionType === "view"}
                                      className="p-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded transition-colors"
                                      title="View document"
                                    >
                                      {processingDocId === doc.docId && actionType === "view" ? (
                                        <LoadingSpinner size="sm" />
                                      ) : (
                                        <Eye size={14} />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => handleDownloadDocument(doc.docId, doc.documentType)}
                                      disabled={processingDocId === doc.docId && actionType === "download"}
                                      className="p-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded transition-colors"
                                      title="Download document"
                                    >
                                      {processingDocId === doc.docId && actionType === "download" ? (
                                        <LoadingSpinner size="sm" />
                                      ) : (
                                        <Download size={14} />
                                      )}
                                    </button>
                                    {canUpdateDocuments && (
                                      <button
                                        onClick={() => handleReplaceDocument(doc.docId, doc.documentType)}
                                        disabled={processingDocId === doc.docId && actionType === "replace"}
                                        className="p-1.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded transition-colors"
                                        title="Replace document"
                                      >
                                        {processingDocId === doc.docId && actionType === "replace" ? (
                                          <LoadingSpinner size="sm" />
                                        ) : (
                                          <RefreshCw size={14} />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  );
};

export default MemberDetailsModal;

