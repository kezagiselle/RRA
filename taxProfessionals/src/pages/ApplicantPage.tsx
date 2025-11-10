import React from 'react'
import ApplicantForm from '../components/ApplicantForm'
import { RiArrowDropDownLine } from "react-icons/ri";


function ApplicantPage() {
    const [tpin, setTpin] = React.useState('')
    const [tcompany, setTcompany] = React.useState('')
    const [fullname, setFullname] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [phonenumber, setPhoneNumber] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [province, setProvince] = React.useState('')
    const [district, setDistrict] = React.useState('')
    const [cell, setCell] = React.useState('')
    const [sector, setSector] = React.useState('')
    const [village, setVillage] = React.useState('')
    const [bachelor, setBachelor] = React.useState('')
    const [date, setDate] = React.useState('')
    const [status, setStatus] = React.useState('')
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2"> Applicant Registration</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ApplicantForm
                    label="T-Pin"
                    icon={<RiArrowDropDownLine />}
                    placeholder="Enter TPIN"
                    value={tpin}
                    onChange={(e) => setTpin(e.target.value)} />

                </div>
            </div>
        </div>
      
    </div>
  )
}

export default ApplicantPage
