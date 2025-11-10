import React from 'react'
import { FaPlaceOfWorship } from 'react-icons/fa';
import { RiArrowDropDownLine } from "react-icons/ri";


interface InputProps {
    label: React.ReactNode,
    icon?: React.ReactNode,
    type?: string,
    placeholder?: string,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean
    className?: boolean
}

function ApplicantForm({label, icon, type, value, onChange,className, placeholder}:InputProps ) {
  return (
    <div className={"flex flex-col"}>
        <label className="text-gray-700 font-medium mb-2">{label}</label>
      <div className="relative">
        {type === "file" ? (
          <input
            type="file"
            onChange={onChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-700 text-base cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        ) : (
          <>
            <input
              type={type}
              value={value}
              onChange={onChange}
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
