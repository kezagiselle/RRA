import React from 'react'
import ApplicantForm from '../components/ApplicantForm'
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdCloudUpload } from "react-icons/md";


function ApplicantPage() {
  const [tpin, setTpin] = React.useState('')
  const [tcompany, setTcompany] = React.useState('')
  const [fullname, setFullname] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phonenumber, setPhoneNumber] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [province, setProvince] = React.useState('')
  const [district, setDistrict] = React.useState('')
  const [sector, setSector] = React.useState('')
  const [cell, setCell] = React.useState('')
  const [village, setVillage] = React.useState('')
const [bachelor, setBachelor] = React.useState<File | null>(null)
  const [date, setDate] = React.useState('')
  const [status, setStatus] = React.useState('')

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-10">
        
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Applicant Registration
            </h1>
            <p className="text-gray-500">
              Please fill out all required fields carefully.
            </p>
          </div>

          
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-700 mb-5 border-b border-gray-200 pb-2">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ApplicantForm label="T-PIN" value={tpin} onChange={(e) => setTpin(e.target.value)} />
              <ApplicantForm label="T-Company" value={tcompany} onChange={(e) => setTcompany(e.target.value)} />
              <ApplicantForm label="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} />
              <ApplicantForm label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <ApplicantForm label="Phone Number" value={phonenumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <ApplicantForm label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </section>

        
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-700 mb-5 border-b border-gray-200 pb-2">
              Location Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ApplicantForm label="Province" icon={<RiArrowDropDownLine />} value={province} onChange={(e) => setProvince(e.target.value)} />
              <ApplicantForm label="District" icon={<RiArrowDropDownLine />} value={district} onChange={(e) => setDistrict(e.target.value)} />
              <ApplicantForm label="Sector" icon={<RiArrowDropDownLine />} value={sector} onChange={(e) => setSector(e.target.value)} />
              <ApplicantForm label="Cell" icon={<RiArrowDropDownLine />} value={cell} onChange={(e) => setCell(e.target.value)} />
              <ApplicantForm label="Village" icon={<RiArrowDropDownLine />} value={village} onChange={(e) => setVillage(e.target.value)} />
            </div>
          </section>

          
          <section>
            <h2 className="text-xl font-bold text-gray-700 mb-5 border-b border-gray-200 pb-2">
              Education & Other Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       <ApplicantForm
        label={
         <span className="flex items-center gap-2">
        <MdCloudUpload className="text-blue-500 text-2xl" /> 
           Bachelor Degree (Upload)
         </span>
     }
         type="file"
         onChange={(e) => {
          const files = e.target.files;
         if (files && files.length > 0) {
          setBachelor(files[0]);
         }
         }}
         />

              <ApplicantForm label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <ApplicantForm label="Status" icon={<RiArrowDropDownLine />} value={status} onChange={(e) => setStatus(e.target.value)} />
            </div>
          </section>

          
          <div className="mt-12 flex justify-center">
            <button className="w-full md:w-1/2 py-4 text-lg font-semibold bg-blue-300 text-white rounded-full hover:bg-blue-500 transition duration-200 shadow-md">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicantPage
