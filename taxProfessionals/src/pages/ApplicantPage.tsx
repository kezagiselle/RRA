import React, { useState } from 'react'
import ApplicantForm from '../components/ApplicantForm'
import { RiArrowDropDownLine } from "react-icons/ri"
import { MdCloudUpload } from "react-icons/md"
import { useNavigate } from 'react-router-dom'
import Errors from '../components/Errors'

function ApplicantPage() {
  const navigate = useNavigate()

  const [tpin, setTpin] = useState('')
  const [tcompany, setTcompany] = useState('')
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [phonenumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [sector, setSector] = useState('')
  const [cell, setCell] = useState('')
  const [village, setVillage] = useState('')
  const [bachelor, setBachelor] = useState<File | null>(null)
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('')

  const [errors, setErrors] = useState<any>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formErrors: any = {}

    if (!tpin.trim()) formErrors.tpin = "TPIN is required"
    if (!tcompany.trim()) formErrors.tcompany = "Company name is required"
    if (!fullname.trim()) formErrors.fullname = "Full name is required"
    if (!email.trim()) formErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) formErrors.email = "Email is invalid"
    if (!phonenumber.trim()) formErrors.phonenumber = "Phone number is required"
    else if (!/^\+?\d{8,15}$/.test(phonenumber)) formErrors.phonenumber = "Phone number is invalid"
    if (!password) formErrors.password = "Password is required"
    else if (password.length < 6) formErrors.password = "Password must be at least 6 characters"
    if (!province) formErrors.province = "Province is required"
    if (!district) formErrors.district = "District is required"
    if (!sector) formErrors.sector = "Sector is required"
    if (!cell) formErrors.cell = "Cell is required"
    if (!village) formErrors.village = "Village is required"
    if (!bachelor) formErrors.bachelor = "Please upload your Bachelor Degree"
    if (!date) formErrors.date = "Date is required"
    if (!status) formErrors.status = "Status is required"

    setErrors(formErrors)

    if (Object.keys(formErrors).length === 0) {
      navigate("/success")
    }
  }

  
  const renderField = (input: React.ReactNode, errorKey: string) => (
    <div>
      <Errors message={errors[errorKey]} />
      {input}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Applicant Registration</h1>
            <p className="text-gray-500">Please fill out all required fields carefully.</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            <section className="mb-10">
              <h2 className="text-xl font-bold text-gray-700 mb-5 border-b border-gray-200 pb-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderField(<ApplicantForm label="T-PIN" value={tpin} onChange={(e) => setTpin(e.target.value)} />, 'tpin')}
                {renderField(<ApplicantForm label="T-Company" value={tcompany} onChange={(e) => setTcompany(e.target.value)} />, 'tcompany')}
                {renderField(<ApplicantForm label="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} />, 'fullname')}
                {renderField(<ApplicantForm label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />, 'email')}
                {renderField(<ApplicantForm label="Phone Number" value={phonenumber} onChange={(e) => setPhoneNumber(e.target.value)} />, 'phonenumber')}
                {renderField(<ApplicantForm label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />, 'password')}
              </div>
            </section>

            
            <section className="mb-10">
              <h2 className="text-xl font-bold text-gray-700 mb-5 border-b border-gray-200 pb-2">Location Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderField(<ApplicantForm label="Province" icon={<RiArrowDropDownLine />} value={province} onChange={(e) => setProvince(e.target.value)} />, 'province')}
                {renderField(<ApplicantForm label="District" icon={<RiArrowDropDownLine />} value={district} onChange={(e) => setDistrict(e.target.value)} />, 'district')}
                {renderField(<ApplicantForm label="Sector" icon={<RiArrowDropDownLine />} value={sector} onChange={(e) => setSector(e.target.value)} />, 'sector')}
                {renderField(<ApplicantForm label="Cell" icon={<RiArrowDropDownLine />} value={cell} onChange={(e) => setCell(e.target.value)} />, 'cell')}
                {renderField(<ApplicantForm label="Village" icon={<RiArrowDropDownLine />} value={village} onChange={(e) => setVillage(e.target.value)} />, 'village')}
              </div>
            </section>

            
            <section>
              <h2 className="text-xl font-bold text-gray-700 mb-5 border-b border-gray-200 pb-2">Education & Other Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderField(
                  <ApplicantForm
                    label={<span className="flex items-center gap-2"><MdCloudUpload className="text-blue-500 text-2xl" /> Bachelor Degree (Upload)</span>}
                    type="file"
                    onChange={(e) => {
                      const files = e.target.files
                      if (files && files.length > 0) setBachelor(files[0])
                    }}
                  />, 
                  'bachelor'
                )}

                {renderField(<ApplicantForm label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />, 'date')}
                {renderField(<ApplicantForm label="Status" icon={<RiArrowDropDownLine />} value={status} onChange={(e) => setStatus(e.target.value)} />, 'status')}
              </div>
            </section>

            
            <div className="mt-12 flex justify-center">
              <button className="w-full md:w-1/2 py-4 text-lg font-semibold bg-blue-300 text-white rounded-full hover:bg-blue-500 transition duration-200 shadow-md">
                Apply Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ApplicantPage
