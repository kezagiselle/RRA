import React from 'react'
import { FaPlaceOfWorship } from 'react-icons/fa';
import { RiArrowDropDownLine } from "react-icons/ri";


interface InputProps {
    label: string,
    icon: React.ReactNode,
    type?: string,
    placeholder?: string,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean
    className?: boolean
}

function ApplicantForm({label, icon, type, value, onChange,className, placeholder}:InputProps ) {
  return (
    <div className={`w-full ${className}`}>
        <label className="block text=sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="absolute left-3 flex items-center justify-center text-gray-400">{icon}</div>

        <input
         type={type}
         value={value}
         onChange={onChange}
         placeholder={placeholder}
         className=""
          />
      
    </div>
  )
}

export default ApplicantForm
