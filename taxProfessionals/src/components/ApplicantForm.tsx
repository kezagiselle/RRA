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
  disabled?: boolean
}

function ApplicantForm({ label, icon, type, value, onChange, placeholder, applicantData, disabled }: InputProps) {
  // If applicantData is provided (even if empty), render as dropdown
  if (applicantData !== undefined && applicantData !== null) {
    const dataArray = Array.isArray(applicantData) ? applicantData : [];
    return (
      <div className={"flex flex-col"}>
        <label className="mdc-section-label mb-2">{label}</label>
        <div className="relative">
          <select
            value={value || ""}
            onChange={onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
            disabled={disabled}
            className={`mdc-select appearance-none pr-10 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
      <label className="mdc-section-label mb-2">{label}</label>
      <div className="relative">
        {type === "file" ? (
          <input
            type="file"
            onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
            disabled={disabled}
            className={`mdc-input py-3 px-4 text-base ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          />
        ) : (
          <>
            <input
              type={type}
              value={value}
              onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
              placeholder={placeholder}
              disabled={disabled}
              className={`mdc-input pr-10 ${disabled ? 'cursor-not-allowed' : ''}`}
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
