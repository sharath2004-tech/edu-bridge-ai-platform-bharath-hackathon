"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    AlertCircle,
    ArrowLeft,
    Building2,
    CheckCircle,
    Lock,
    Mail,
    MapPin,
    Phone,
    Upload,
    User
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SchoolRegistrationPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    // School Information
    schoolName: "",
    schoolCode: "",
    schoolType: "private",
    board: "CBSE",
    medium: "English",
    logo: null as File | null,
    
    // Address
    addressLine1: "",
    addressLine2: "",
    district: "",
    state: "",
    pincode: "",
    
    // Admin Details
    adminName: "",
    adminEmail: "",
    adminMobile: "",
    designation: "principal"
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: "Logo size must be less than 2MB" }))
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, logo: "Please upload an image file" }))
        return
      }

      setFormData(prev => ({ ...prev, logo: file }))
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      setErrors(prev => ({ ...prev, logo: "" }))
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = "School name is required"
    }
    
    if (!formData.schoolCode.trim()) {
      newErrors.schoolCode = "School code is required"
    } else if (!/^[A-Z0-9]{4,10}$/.test(formData.schoolCode.toUpperCase())) {
      newErrors.schoolCode = "Code must be 4-10 alphanumeric characters"
    }
    
    if (!formData.medium.trim()) {
      newErrors.medium = "Medium of instruction is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required"
    }
    
    if (!formData.district.trim()) {
      newErrors.district = "District is required"
    }
    
    if (!formData.state.trim()) {
      newErrors.state = "State is required"
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required"
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.adminName.trim()) {
      newErrors.adminName = "Administrator name is required"
    }
    
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      newErrors.adminEmail = "Invalid email format"
    }
    
    if (!formData.adminMobile.trim()) {
      newErrors.adminMobile = "Mobile number is required"
    } else if (!/^\d{10}$/.test(formData.adminMobile)) {
      newErrors.adminMobile = "Mobile number must be 10 digits"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    let isValid = false
    
    if (step === 1) {
      isValid = validateStep1()
    } else if (step === 2) {
      isValid = validateStep2()
    }
    
    if (isValid) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setStep(step - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep3()) {
      return
    }

    setLoading(true)

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      
      // School Information
      submitData.append('schoolName', formData.schoolName)
      submitData.append('schoolCode', formData.schoolCode.toUpperCase())
      submitData.append('schoolType', formData.schoolType)
      submitData.append('board', formData.board)
      submitData.append('medium', formData.medium)
      
      if (formData.logo) {
        submitData.append('logo', formData.logo)
      }
      
      // Address
      submitData.append('addressLine1', formData.addressLine1)
      submitData.append('addressLine2', formData.addressLine2 || '')
      submitData.append('district', formData.district)
      submitData.append('state', formData.state)
      submitData.append('pincode', formData.pincode)
      
      // Admin Details
      submitData.append('adminName', formData.adminName)
      submitData.append('adminEmail', formData.adminEmail)
      submitData.append('adminMobile', formData.adminMobile)
      submitData.append('designation', formData.designation)

      const res = await fetch('/api/school-registration', {
        method: 'POST',
        body: submitData
      })

      const data = await res.json()

      if (res.ok) {
        setStep(4) // Success step
      } else {
        alert(data.error || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Home</span>
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">School Registration</h1>
          <p className="text-muted-foreground">Join EduBridge AI Platform - Empower Your School with AI-Driven Learning</p>
        </div>

        {/* Progress Steps */}
        {step !== 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[
                { num: 1, label: "School Info" },
                { num: 2, label: "Address" },
                { num: 3, label: "Admin Account" }
              ].map((item, idx) => (
                <div key={item.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= item.num 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > item.num ? <CheckCircle className="w-5 h-5" /> : item.num}
                    </div>
                    <span className="text-xs mt-2 font-medium hidden md:block">{item.label}</span>
                  </div>
                  {idx < 2 && (
                    <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                      step > item.num ? 'bg-primary' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Card */}
        <Card className="p-6 md:p-8 shadow-xl">
          {step === 1 && (
            <form className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-primary" />
                  School Information
                </h2>
                <p className="text-muted-foreground text-sm mb-6">Enter your school's basic details</p>

                <div className="space-y-5">
                  {/* School Name */}
                  <div>
                    <Label htmlFor="schoolName" className="text-base">
                      School Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="schoolName"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      placeholder="Enter full school name"
                      className="mt-2"
                    />
                    {errors.schoolName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.schoolName}
                      </p>
                    )}
                  </div>

                  {/* School Code */}
                  <div>
                    <Label htmlFor="schoolCode" className="text-base">
                      School Code / Registration Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="schoolCode"
                      name="schoolCode"
                      value={formData.schoolCode}
                      onChange={(e) => {
                        e.target.value = e.target.value.toUpperCase()
                        handleInputChange(e)
                      }}
                      placeholder="e.g., SCH001 (4-10 characters)"
                      maxLength={10}
                      className="mt-2 font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use 4-10 alphanumeric characters (letters and numbers only)
                    </p>
                    {errors.schoolCode && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.schoolCode}
                      </p>
                    )}
                  </div>

                  {/* School Type & Board */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="schoolType" className="text-base">
                        School Type <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="schoolType"
                        name="schoolType"
                        value={formData.schoolType}
                        onChange={handleInputChange}
                        className="w-full mt-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      >
                        <option value="government">Government</option>
                        <option value="private">Private</option>
                        <option value="aided">Aided</option>
                        <option value="international">International</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="board" className="text-base">
                        Board <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="board"
                        name="board"
                        value={formData.board}
                        onChange={handleInputChange}
                        className="w-full mt-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      >
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="State Board">State Board</option>
                        <option value="IB">IB (International Baccalaureate)</option>
                        <option value="Cambridge">Cambridge</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Medium of Instruction */}
                  <div>
                    <Label htmlFor="medium" className="text-base">
                      Medium of Instruction <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="medium"
                      name="medium"
                      value={formData.medium}
                      onChange={handleInputChange}
                      placeholder="e.g., English, Hindi, Telugu"
                      className="mt-2"
                    />
                    {errors.medium && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.medium}
                      </p>
                    )}
                  </div>

                  {/* School Logo Upload */}
                  <div>
                    <Label htmlFor="logo" className="text-base">
                      School Logo (Optional)
                    </Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {logoPreview ? (
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-24 h-24 object-cover rounded-lg border-2 border-primary"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          id="logo"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('logo')?.click()}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Logo
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          PNG, JPG up to 2MB. Recommended: 200x200px
                        </p>
                        {errors.logo && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.logo}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="button" onClick={handleNext} size="lg" className="px-8">
                  Next Step →
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  School Address
                </h2>
                <p className="text-muted-foreground text-sm mb-6">Provide your school's complete address</p>

                <div className="space-y-5">
                  {/* Address Line 1 */}
                  <div>
                    <Label htmlFor="addressLine1" className="text-base">
                      Address Line 1 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="Building No., Street Name"
                      className="mt-2"
                    />
                    {errors.addressLine1 && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.addressLine1}
                      </p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <Label htmlFor="addressLine2" className="text-base">
                      Address Line 2 (Optional)
                    </Label>
                    <Input
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Area, Landmark"
                      className="mt-2"
                    />
                  </div>

                  {/* District & State */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="district" className="text-base">
                        District <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="Enter district"
                        className="mt-2"
                      />
                      {errors.district && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.district}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-base">
                        State <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                        className="mt-2"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pincode */}
                  <div className="md:w-1/2">
                    <Label htmlFor="pincode" className="text-base">
                      Pincode <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className="mt-2"
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={handleBack} size="lg">
                  ← Back
                </Button>
                <Button type="button" onClick={handleNext} size="lg" className="px-8">
                  Next Step →
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  Administrator Account
                </h2>
                <p className="text-muted-foreground text-sm mb-6">Create admin account for school management</p>

                <div className="space-y-5">
                  {/* Admin Name */}
                  <div>
                    <Label htmlFor="adminName" className="text-base">
                      Administrator Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="adminName"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className="mt-2"
                    />
                    {errors.adminName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.adminName}
                      </p>
                    )}
                  </div>

                  {/* Email & Mobile */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="adminEmail" className="text-base">
                        Official Email Address <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="adminEmail"
                          name="adminEmail"
                          type="email"
                          value={formData.adminEmail}
                          onChange={handleInputChange}
                          placeholder="admin@school.edu"
                          className="pl-10"
                        />
                      </div>
                      {errors.adminEmail && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.adminEmail}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="adminMobile" className="text-base">
                        Mobile Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative mt-2">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="adminMobile"
                          name="adminMobile"
                          value={formData.adminMobile}
                          onChange={handleInputChange}
                          placeholder="10-digit number"
                          maxLength={10}
                          className="pl-10"
                        />
                      </div>
                      {errors.adminMobile && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.adminMobile}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Designation */}
                  <div>
                    <Label htmlFor="designation" className="text-base">
                      Designation <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="w-full mt-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    >
                      <option value="principal">Principal</option>
                      <option value="director">Director</option>
                      <option value="admin-head">Admin Head</option>
                      <option value="vice-principal">Vice Principal</option>
                      <option value="coordinator">Coordinator</option>
                    </select>
                  </div>

                  {/* Password Info - Auto-generated */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 rounded-full p-2">
                        <Lock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-1">🔐 Secure Auto-Generated Password</h4>
                        <p className="text-sm text-purple-800">
                          A secure password will be automatically generated and sent to your registered email address. You can change it anytime after your first login.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        required 
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-700">
                        I agree to the <Link href="/terms" className="text-primary underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>. I confirm that all information provided is accurate and I have the authority to register this school.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={handleBack} size="lg">
                  ← Back
                </Button>
                <Button type="submit" disabled={loading} size="lg" className="px-8">
                  {loading ? 'Registering...' : 'Complete Registration'}
                </Button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Registration Successful! 🎉</h2>
              <p className="text-lg text-muted-foreground mb-2">
                Welcome to EduBridge AI Platform
              </p>
              <p className="text-muted-foreground mb-8">
                Your school has been successfully registered. An admin will review and approve your registration shortly.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
                <h3 className="font-semibold mb-2">What's Next?</h3>
                <ul className="text-sm text-left space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Check your email for verification link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Admin will review within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>You'll receive approval notification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Start onboarding teachers and students</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => window.location.href = '/login'} size="lg">
                  Go to Login
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'} size="lg">
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Help Text */}
        {step !== 4 && (
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>Already registered? <Link href="/login" className="text-primary hover:underline font-medium">Sign in here</Link></p>
            <p className="mt-2">Need help? Contact us at <a href="mailto:support@edubridge.ai" className="text-primary hover:underline">support@edubridge.ai</a></p>
          </div>
        )}
      </div>
    </main>
  )
}
