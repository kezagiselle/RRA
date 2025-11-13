import React from 'react'


interface InputProps {
    label: React.ReactNode,
    icon?: React.ReactNode,
    type?: string,
    placeholder?: string,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    required?: boolean
    className?: boolean
    applicantData?: any
}

function ApplicantForm({label, icon, type, value, onChange, placeholder, applicantData}:InputProps ) {
  // Debug logging
  console.log(`ApplicantForm [${label}]:`, {
    applicantData,
    isArray: Array.isArray(applicantData),
    length: Array.isArray(applicantData) ? applicantData.length : 'N/A',
    type: typeof applicantData
  });
  
  // If applicantData is provided (even if empty), render as dropdown
  if (applicantData !== undefined && applicantData !== null) {
    const dataArray = Array.isArray(applicantData) ? applicantData : [];
    console.log(`ApplicantForm [${label}]: Rendering dropdown with ${dataArray.length} items`);
    return (
      <div className={"flex flex-col"}>
        <label className="text-gray-700 font-medium mb-2">{label}</label>
        <div className="relative">
          <select
            value={value || ""}
            onChange={onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-4 px-5 pr-10 text-base text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none appearance-none cursor-pointer"
          >
            <option value="">Select {label}</option>
            {dataArray.map((item: any, index: number) => (
              <option key={item?.locationId || item?.id || item?.name || index} value={item?.name || item?.id || ""}>
                {item?.name || item?.id || ""}
              </option>
            ))}
          </select>
          {icon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-2xl pointer-events-none">
              {icon}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={"flex flex-col"}>
        <label className="text-gray-700 font-medium mb-2">{label}</label>
      <div className="relative">
        {type === "file" ? (
          <input
            type="file"
            onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-700 text-base cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        ) : (
          <>
            <input
              type={type}
              value={value}
              onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
              placeholder={placeholder}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg py-4 px-5 pr-10 text-base text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
            />
            {icon && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-2xl pointer-events-none">
                {icon}
              </span>
            )}
            </>
        )}
      </div>
      </div>
  )
}

export default ApplicantForm
