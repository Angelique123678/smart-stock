import React, { useState, useEffect } from "react";
import TeacherServices from "../../../services/TeacherServices";

const EditTeacherModal = ({ isOpen, onClose, onSubmit, teacherId, initialData }) => {
  const initialFormState = {
    teachername: "",
    email: "",
    phone: "",
  };

  const initialErrorState = {
    teachername: "",
    email: "",
    phone: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrorState);
  const [touched, setTouched] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  // Fetch teacher data when modal opens or teacherId changes
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (isOpen && teacherId) {
        setDataLoading(true);
        try {
          // If initialData is provided, use it, otherwise fetch from API
          if (initialData) {
            const formattedData = {
              teachername: initialData.name || "",
              email: initialData.email || "",
              phone: initialData.phone || "",
            };
            setFormData(formattedData);
            setOriginalData({...formattedData});
          } else {
            const response = await TeacherServices.getTeacherById(teacherId);
            if (response && response.teacher) {
              const teacher = response.teacher;
              const formattedData = {
                teachername: teacher.name || "",
                email: teacher.email || "",
                phone: teacher.phone || "",
              };
              setFormData(formattedData);
              setOriginalData({...formattedData});
            }
          }
        } catch (error) {
          console.error("Error fetching teacher data:", error);
        } finally {
          setDataLoading(false);
        }
      }
    };

    fetchTeacherData();
  }, [isOpen, teacherId, initialData]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setErrors(initialErrorState);
      setTouched({});
      setFormSubmitted(false);
      setOriginalData(null);
    }
  }, [isOpen]);

  // Revalidate form when dependencies change
  useEffect(() => {
    if (formSubmitted || Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [formData]);

  const validateField = (name, value) => {
    let errorMessage = "";
    
    switch (name) {
      case "teachername":
        if (!value.trim()) {
          errorMessage = "Name is required";
        } else if (value.trim().length < 2) {
          errorMessage = "Name must be at least 2 characters";
        } else if (value.trim().length > 50) {
          errorMessage = "Name must be less than 50 characters";
        }
        break;
        
      case "email":
        if (!value.trim()) {
          errorMessage = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = "Please enter a valid email address";
        }
        break;
        
      case "phone":
        if (value.trim() && !/^[0-9+\-\s()]{10,15}$/.test(value)) {
          errorMessage = "Please enter a valid phone number";
        }
        break;
        
      default:
        break;
    }
    
    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const validateForm = () => {
    // Validate all fields
    const newErrors = {
      teachername: validateField("teachername", formData.teachername),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
    };

    setErrors(newErrors);

    // Check if any errors exist
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Check if the form has any changes
  const hasChanges = () => {
    if (!originalData) return false;
    
    return (
      formData.teachername !== originalData.teachername ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTouched({
      teachername: true,
      email: true,
      phone: true
    });
    
    setIsLoading(true);
    
    // Validate all fields before submission
    if (validateForm()) {
      try {
        // Only submit fields that have changed
        const updatedFields = {};
        
        if (formData.teachername !== originalData?.teachername) {
          updatedFields.teachername = formData.teachername;
        }
        
        if (formData.email !== originalData?.email) {
          updatedFields.email = formData.email;
        }
        
        if (formData.phone !== originalData?.phone) {
          updatedFields.phone = formData.phone;
        }
        
        // Only submit if there are changes
        if (Object.keys(updatedFields).length > 0) {
          onSubmit(updatedFields);
        } else {
          // No changes made, just close the modal
          onClose();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      // Scroll to first error
      const firstErrorField = Object.keys(errors).find(field => errors[field] !== "");
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
    }
  };

  const inputContainer = "flex flex-col items-center justify-center gap-6 w-11/12";
  const input = "border rounded-md p-2 w-full";
  const errorStyle = "text-red-500 text-sm mt-1";

  const shouldShowError = (fieldName) => {
    return (touched[fieldName] || formSubmitted) && errors[fieldName];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2] flex items-center justify-center bg-gray-500 bg-opacity-50 w-full">
      <div className="flex flex-col bg-white items-center justify-center min-h-full sm:min-h-max sm:p-10 md:p-14 xl:p-20 sm:rounded-lg shadow-lg w-full sm:w-10/12 md:w-9/12 lg:w-1/2 max-h-screen overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Edit Teacher</h2>

        {dataLoading ? (
          <div className="w-full text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">Loading teacher data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={inputContainer} noValidate>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="teachername">Name: <span className="text-red-500">*</span></label>
              <input
                id="teachername"
                type="text"
                name="teachername"
                value={formData.teachername}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${input} ${shouldShowError('teachername') ? "border-red-500" : ""}`}
                placeholder="Enter teacher name"
                aria-invalid={shouldShowError('teachername')}
                aria-describedby={shouldShowError('teachername') ? "teachername-error" : undefined}
              />
              {shouldShowError('teachername') && <span id="teachername-error" className={errorStyle}>{errors.teachername}</span>}
            </div>
            
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="email">Email: <span className="text-red-500">*</span></label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${input} ${shouldShowError('email') ? "border-red-500" : ""}`}
                placeholder="Enter email address"
                aria-invalid={shouldShowError('email')}
                aria-describedby={shouldShowError('email') ? "email-error" : undefined}
              />
              {shouldShowError('email') && <span id="email-error" className={errorStyle}>{errors.email}</span>}
            </div>
            
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="phone">Phone Number:</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${input} ${shouldShowError('phone') ? "border-red-500" : ""}`}
                placeholder="Enter phone number"
                aria-invalid={shouldShowError('phone')}
                aria-describedby={shouldShowError('phone') ? "phone-error" : undefined}
              />
              {shouldShowError('phone') && <span id="phone-error" className={errorStyle}>{errors.phone}</span>}
              {!errors.phone && (
                <span className="text-gray-500 text-xs">Format: +1234567890 or 10-15 digits</span>
              )}
            </div>

             <div className="flex w-full gap-1 flex-row">
              <button
                type="submit"
                disabled={isLoading || !hasChanges()}
                className="bg-blue-500 flex-auto disabled:opacity-65 text-white rounded-md p-2 mt-3 w-full md:w-[47%] hover:bg-blue-600 transition-colors"
              >
                {isLoading ? "Processing..." : "Update Teacher"}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={onClose}
                className="bg-gray-300 flex-auto disabled:opacity-65 text-black rounded-md p-2 mt-3 ml-2 w-full md:w-[47%] hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditTeacherModal;