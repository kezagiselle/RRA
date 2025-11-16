import React, { useState } from 'react';
import { FileText, Bell, LogOut, Menu, X, ChevronRight, ChevronDown, Trash2, Edit, CheckCircle, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import rra from "../imgs/rra.png";
import { getDetails } from '../services/ViewApplicantDetails';
import { getAllDocuments } from '../services/getDocuments';
import { deleteDocument } from '../services/deleteDocument';
import { updateDocument } from '../services/updateDocument';
import { getVerifiedDocuments } from '../services/VerifiedDocuments';

export default function ApplicantDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showVerifiedDocuments, setShowVerifiedDocuments] = useState(false);
  const [applicantData, setApplicantData] = useState<any>(null);
  const [documentsData, setDocumentsData] = useState<any>(null);
  const [verifiedDocumentsData, setVerifiedDocumentsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [verifiedDocumentsLoading, setVerifiedDocumentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [verifiedDocumentsError, setVerifiedDocumentsError] = useState<string | null>(null);
  const [updatingDocId, setUpdatingDocId] = useState<string | number | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | number | null>(null);
  const navigate = useNavigate();
  
  const tinNumber = localStorage.getItem('tinNumber');
  
  const handleUnderReviewClick = async () => {
    if (!tinNumber) {
      setError("TIN number not found. Please login again.");
      return;
    }

    // Toggle section
    if (activeSection === 'underReview') {
      setActiveSection(null);
      setShowDetails(false);
      return;
    }

    setActiveSection('underReview');
    setLoading(true);
    setError(null);
    setShowDetails(false);
    setShowDocuments(false);
    setShowVerifiedDocuments(false);
    
    try {
      const response = await getDetails(tinNumber);
      console.log('Dashboard: Applicant details response:', response);
      console.log('Dashboard: Applicant details data:', response.data);
      
      // Handle nested data structure
      const data = response.data?.data || response.data;
      setApplicantData(data);
      setShowDetails(true);
    } catch (err: any) {
      console.error('Dashboard: Error fetching applicant details:', err);
      setError(err.response?.data?.message || err.message || "Failed to fetch applicant details");
      setShowDetails(false);
    } finally {
      setLoading(false);
    }
  };

  const handleMyDocumentsClick = async () => {
    if (!tinNumber) {
      setDocumentsError("TIN number not found. Please login again.");
      return;
    }

    // Toggle section
    if (activeSection === 'myDocuments') {
      setActiveSection(null);
      setShowDocuments(false);
      return;
    }

    setActiveSection('myDocuments');
    setDocumentsLoading(true);
    setDocumentsError(null);
    setShowDetails(false);
    setShowDocuments(false);
    setShowVerifiedDocuments(false);
    
    try {
      const response = await getAllDocuments(tinNumber);
      console.log('Dashboard: Documents response:', response);
      console.log('Dashboard: Documents data:', response.data);
      console.log('Dashboard: Full response structure:', JSON.stringify(response.data, null, 2));
      
      // Handle nested data structure
      const data = response.data?.data || response.data;
      console.log('Dashboard: Processed documents data:', data);
      console.log('Dashboard: Is array?', Array.isArray(data));
      if (Array.isArray(data) && data.length > 0) {
        console.log('Dashboard: First document structure:', JSON.stringify(data[0], null, 2));
        console.log('Dashboard: First document keys:', Object.keys(data[0]));
      }
      setDocumentsData(data);
      setShowDocuments(true);
    } catch (err: any) {
      console.error('Dashboard: Error fetching documents:', err);
      setDocumentsError(err.response?.data?.message || err.message || "Failed to fetch documents");
      setShowDocuments(false);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleVerifiedDocumentsClick = async () => {
    if (!tinNumber) {
      setVerifiedDocumentsError("TIN number not found. Please login again.");
      return;
    }

    // Toggle section
    if (activeSection === 'verifiedDocuments') {
      setActiveSection(null);
      setShowVerifiedDocuments(false);
      return;
    }

    setActiveSection('verifiedDocuments');
    setVerifiedDocumentsLoading(true);
    setVerifiedDocumentsError(null);
    setShowDetails(false);
    setShowDocuments(false);
    setShowVerifiedDocuments(false);
    
    try {
      const response = await getVerifiedDocuments(tinNumber);
      console.log('Dashboard: Verified Documents response:', response);
      console.log('Dashboard: Verified Documents data:', response.data);
      
      // Handle nested data structure
      const data = response.data?.data || response.data;
      console.log('Dashboard: Processed verified documents data:', data);
      console.log('Dashboard: Is array?', Array.isArray(data));
      if (Array.isArray(data) && data.length > 0) {
        console.log('Dashboard: First verified document structure:', JSON.stringify(data[0], null, 2));
      }
      
      setVerifiedDocumentsData(data);
      setShowVerifiedDocuments(true);
    } catch (err: any) {
      console.error('Dashboard: Error fetching verified documents:', err);
      setVerifiedDocumentsError(err.response?.data?.message || err.message || "Failed to fetch verified documents");
      setShowVerifiedDocuments(false);
    } finally {
      setVerifiedDocumentsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('tinNumber');
    
    // Navigate to login page
    navigate("/");
  };

  const handleDeleteDocument = async (documentId: string | number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    setDeletingDocId(documentId);
    
    try {
      await deleteDocument(documentId);
      console.log('Dashboard: Document deleted successfully');
      
      // Refresh documents list
      if (tinNumber) {
        const response = await getAllDocuments(tinNumber);
        const data = response.data?.data || response.data;
        setDocumentsData(data);
      }
      
      alert('Document deleted successfully!');
    } catch (err: any) {
      console.error('Dashboard: Error deleting document:', err);
      alert(err.response?.data?.message || err.message || 'Failed to delete document');
    } finally {
      setDeletingDocId(null);
    }
  };

  const handleUpdateDocument = async (documentId: string | number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    
    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) {
        return;
      }

      // Validate PDF
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }

      setUpdatingDocId(documentId);
      
      try {
        // Get document type from the document data
        const doc = Array.isArray(documentsData) 
          ? documentsData.find((d: any) => 
              d.id === documentId 
              || d.documentId === documentId 
              || d.document_id === documentId
              || d.docId === documentId
              || d.doc_id === documentId
            )
          : null;
        
        console.log('Dashboard: Found document for update:', doc);
        console.log('Dashboard: Document ID being used:', documentId);
        
        const documentType = doc?.documentType || doc?.type || doc?.documentType || 'SIGNEDLETTER'; // Default fallback
        
        await updateDocument(documentId, file, documentType);
        console.log('Dashboard: Document updated successfully');
        
        // Refresh documents list
        if (tinNumber) {
          const response = await getAllDocuments(tinNumber);
          const data = response.data?.data || response.data;
          setDocumentsData(data);
        }
        
        alert('Document updated successfully!');
      } catch (err: any) {
        console.error('Dashboard: Error updating document:', err);
        alert(err.response?.data?.message || err.message || 'Failed to update document');
      } finally {
        setUpdatingDocId(null);
      }
    };
    
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={rra} 
            alt="RRA Logo" 
            className="h-10 object-contain" 
          />
          <span className="text-lg font-semibold text-gray-800">Dashboard</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-200"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex mt-4">
      
        <aside className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50
          w-56 sm:w-64 bg-white min-h-screen border-r border-gray-200 flex flex-col
          transition-transform duration-300 ease-in-out lg:transition-none
        `}>
          
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <img 
              src={rra} 
              alt="RRA Logo" 
              className="h-20 sm:h-24 lg:h-28 object-contain mx-auto lg:mx-0" 
            />
          </div>

          
          <nav className="p-3 sm:p-4 space-y-2 flex-1">
            <button 
              onClick={handleUnderReviewClick}
              className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors ${
                activeSection === 'underReview' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
              <FileText size={18} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm lg:text-base">Under Review</span>
              </div>
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
              ) : activeSection === 'underReview' ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            <button 
              onClick={handleMyDocumentsClick}
              className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors ${
                activeSection === 'myDocuments' 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
              <FileText size={18} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm lg:text-base">My Documents</span>
              </div>
              {documentsLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
              ) : activeSection === 'myDocuments' ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
        
            <button 
              onClick={handleVerifiedDocumentsClick}
              className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors ${
                activeSection === 'verifiedDocuments' 
                  ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <CheckCircle size={18} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm lg:text-base">Verified Documents</span>
              </div>
              {verifiedDocumentsLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
              ) : activeSection === 'verifiedDocuments' ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            <button 
              onClick={() => navigate("/company")}
              className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Building2 size={18} className="sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm lg:text-base">Apply for Company</span>
            </button>
          </nav>

        
          <div className="p-3 sm:p-4 border-t border-gray-200 mt-auto">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-600 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition duration-200"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm lg:text-base">Log Out</span>
            </button>
          </div>
        </aside>

        
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 w-full">
        
          <div className="mb-4 sm:mb-6 lg:mb-8 flex justify-end">
            <button 
              onClick={() => navigate("/documents")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full transition duration-200 shadow-md text-xs sm:text-sm lg:text-base"
            >
              Apply
            </button>
          </div>

          {/* Error Messages */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-xs sm:text-sm">
              {error}
            </div>
          )}
          
          {documentsError && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-xs sm:text-sm">
              {documentsError}
            </div>
          )}

          {verifiedDocumentsError && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-xs sm:text-sm">
              {verifiedDocumentsError}
            </div>
          )}

          {/* Applicant Details Table */}
          {showDetails && applicantData && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-4 sm:mb-6 lg:mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Application Details</h2>
              </div>
              
            <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full border-collapse min-w-full">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-700">Field</th>
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-700">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(applicantData).map(([key, value]: [string, any]) => {
                      // Skip work address field
                      if (key.toLowerCase().includes('workaddress') || key.toLowerCase().includes('work address')) {
                        return null;
                      }
                      
                      // Handle workplace location fields separately
                      if (key.toLowerCase().includes('workplace') && typeof value === 'object' && value !== null) {
                        // Extract location fields from workplace object
                        const locationFields = ['province', 'district', 'sector', 'cell', 'village'];
                        const locationData: any = {};
                        
                        locationFields.forEach(field => {
                          // Check various possible field name formats
                          let fieldValue = value[field] 
                            || value[field.charAt(0).toUpperCase() + field.slice(1)]
                            || value[field.toUpperCase()]
                            || value[`${field}Name`]
                            || value[`${field}Id`];
                          
                          // If fieldValue is an object, extract the name property
                          if (fieldValue && typeof fieldValue === 'object') {
                            fieldValue = fieldValue.name || fieldValue.Name || fieldValue.NAME || fieldValue;
                          }
                          
                          if (fieldValue) {
                            locationData[field] = fieldValue;
                          }
                        });
                        
                        // If we found location data, display it
                        if (Object.keys(locationData).length > 0) {
                          return (
                            <React.Fragment key={key}>
                              {locationFields.map((field) => {
                                const fieldValue = locationData[field];
                                if (!fieldValue) return null;
                                
                                const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
                                return (
                                  <tr key={`workplace-${field}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-700">{formattedField}</td>
                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 break-words">{String(fieldValue)}</td>
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          );
                        }
                        // If no location data found, skip the workplace object
                        return null;
                      }
                      
                      // Skip null, undefined, or empty string values
                      if (value === null || value === undefined || value === '') {
                        return null;
                      }
                      
                      // Format key for display
                      const formattedKey = key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())
                        .trim();
                      
                      // Handle arrays
                      if (Array.isArray(value)) {
                        if (value.length === 0) {
                          return null;
                        }
                        
                        // If array contains objects (like documents), format them
                        if (value.length > 0 && typeof value[0] === 'object') {
                          const formattedValue = value.map((item: any, index: number) => {
                            if (typeof item === 'object') {
                              // Format object properties
                              const objStr = Object.entries(item)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(', ');
                              return `${index + 1}. ${objStr}`;
                            }
                            return String(item);
                          }).join(' | ');
                          
                          return (
                            <tr key={key} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-700">{formattedKey}</td>
                              <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                                <div className="space-y-1">
                                  {value.map((item: any, index: number) => (
                                    <div key={index} className="text-xs bg-gray-50 p-2 rounded break-words">
                                      {typeof item === 'object' 
                                        ? Object.entries(item).map(([k, v]) => (
                                            <div key={k} className="break-words"><span className="font-medium">{k}:</span> {String(v)}</div>
                                          ))
                                        : String(item)
                                      }
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        } else {
                          // Simple array
                          const formattedValue = value.join(', ');
                          return (
                            <tr key={key} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-700">{formattedKey}</td>
                              <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 break-words">{formattedValue}</td>
                            </tr>
                          );
                        }
                      }
                      
                      // Handle nested objects
                      if (typeof value === 'object' && value !== null) {
                        const formattedValue = Object.entries(value)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ');
                        return (
                          <tr key={key} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-700">{formattedKey}</td>
                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                              <div className="space-y-1">
                                {Object.entries(value).map(([k, v]) => (
                                  <div key={k} className="text-xs bg-gray-50 p-2 rounded break-words">
                                    <span className="font-medium">{k}:</span> {String(v)}
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      
                      // Handle primitive values
                      let formattedValue = value;
                      if (typeof value === 'boolean') {
                        formattedValue = value ? 'Yes' : 'No';
                      } else if (typeof value === 'string' && value.length > 100) {
                        formattedValue = value.substring(0, 100) + '...';
                      }
                      
                      return (
                        <tr key={key} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-700">{formattedKey}</td>
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 break-words">{String(formattedValue)}</td>
                        </tr>
                      );
                    })}
                    {/* Status Row - Always show as Pending */}
                    <tr className="border-b border-gray-100 bg-amber-50">
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-700">Status</td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-amber-200 text-amber-800">
                          Pending
                        </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            </div>
          )}

          {/* Documents Table */}
          {showDocuments && documentsData && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-4 sm:mb-6 lg:mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">My Documents</h2>
              </div>
              
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full border-collapse min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-700">Document</th>
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-700">Details</th>
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(documentsData) ? (
                      documentsData.map((doc: any, index: number) => {
                        // Try multiple possible ID field names
                        const docId = doc.id 
                          || doc.documentId 
                          || doc.document_id 
                          || doc.docId
                          || doc.doc_id
                          || doc.documentId
                          || (doc.document && doc.document.id)
                          || null;
                        
                        // If no ID found, skip this document or show error
                        if (!docId) {
                          console.warn('Dashboard: Document missing ID:', doc);
                          return (
                            <tr key={index} className="border-b border-gray-100">
                              <td colSpan={3} className="px-6 py-4 text-sm text-red-600">
                                Document {index + 1}: Missing document ID
                              </td>
                            </tr>
                          );
                        }
                        
                        const isDeleting = deletingDocId === docId;
                        const isUpdating = updatingDocId === docId;
                        
                        return (
                          <tr key={docId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-700">
                              Document {index + 1}
                            </td>
                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                              <div className="space-y-1">
                                {Object.entries(doc).map(([k, v]: [string, any]) => (
                                  <div key={k} className="text-xs bg-gray-50 p-2 rounded break-words">
                                    <span className="font-medium">{k}:</span> {String(v)}
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                              <div className="flex items-center space-x-1 sm:space-x-2">
                                <button
                                  onClick={(e) => handleUpdateDocument(docId, e)}
                                  disabled={isUpdating || isDeleting}
                                  className="p-1.5 sm:p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Update document"
                                >
                                  {isUpdating ? (
                                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                                  ) : (
                                    <Edit size={14} className="sm:w-4 sm:h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={(e) => handleDeleteDocument(docId, e)}
                                  disabled={isUpdating || isDeleting}
                                  className="p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Delete document"
                                >
                                  {isDeleting ? (
                                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                                  ) : (
                                    <Trash2 size={14} className="sm:w-4 sm:h-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      Object.entries(documentsData).map(([key, value]: [string, any]) => {
                        if (value === null || value === undefined || value === '') {
                          return null;
                        }
                        
                        const formattedKey = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase())
                          .trim();
                        
                        let formattedValue = value;
                        if (Array.isArray(value)) {
                          formattedValue = value.length > 0 ? value.join(', ') : 'N/A';
                        } else if (typeof value === 'object') {
                          formattedValue = JSON.stringify(value);
                        } else if (typeof value === 'boolean') {
                          formattedValue = value ? 'Yes' : 'No';
                        }
                        
                        return (
                          <tr key={key} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-700">{formattedKey}</td>
                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 break-words">{String(formattedValue)}</td>
                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4"></td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Verified Documents Table */}
          {showVerifiedDocuments && verifiedDocumentsData && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-4 sm:mb-6 lg:mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Verified Documents</h2>
              </div>
              
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full border-collapse min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-700">Document</th>
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-700">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(verifiedDocumentsData) && verifiedDocumentsData.length > 0 ? (
                      verifiedDocumentsData.map((doc: any, index: number) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-700">
                            Document {index + 1}
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                            <div className="space-y-1">
                              {Object.entries(doc).map(([k, v]: [string, any]) => (
                                <div key={k} className="text-xs bg-gray-50 p-2 rounded break-words">
                                  <span className="font-medium">{k}:</span> {String(v)}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-3 sm:px-4 lg:px-6 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">
                          No verified documents found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}