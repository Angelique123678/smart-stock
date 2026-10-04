import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddTeacherModal = ({ isOpen, onClose, onSubmit }) => {
  const initialFormState = {
    teachername: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  };

  const initialErrorState = {
    teachername: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrorState);
  const [touched, setTouched] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Optional: pre-populate with default values when modal opens
      setFormData(initialFormState);
    } else {
      // Reset form state when modal closes
      setFormData(initialFormState);
      setErrors(initialErrorState);
      setTouched({});
      setFormSubmitted(false);
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
          errorMessage = "Teacher name is required";
        } else if (value.trim().length < 2) {
          errorMessage = "Teacher name must be at least 2 characters";
        } else if (value.trim().length > 50) {
          errorMessage = "Teacher name must be less than 50 characters";
        }
        break;
        
      case "email":
        if (!value.trim()) {
          errorMessage = "Email is required";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          errorMessage = "Please enter a valid email address";
        }
        break;
        
      case "phone":
        if (value && !/^\+?[0-9]{10,15}$/.test(value)) {
          errorMessage = "Please enter a valid phone number";
        }
        break;
        
      case "password":
        if (!value) {
          errorMessage = "Password is required";
        } else if (value.length < 6) {
          errorMessage = "Password must be at least 6 characters";
        } else if (value.length > 50) {
          errorMessage = "Password must be less than 50 characters";
        }
        break;
        
      case "confirmPassword":
        if (!value) {
          errorMessage = "Please confirm your password";
        } else if (value !== formData.password) {
          errorMessage = "Passwords do not match";
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
      password: validateField("password", formData.password),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword)
    };

    setErrors(newErrors);

    // Check if any errors exist
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTouched({
      teachername: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    });
    
    setIsLoading(true);
    
    // Validate all fields before submission
    if (validateForm()) {
      // Prepare the data for API submission
      const teacherData = {
        teachername: formData.teachername,
        email: formData.email,
        phone: formData.phone || null,
        password: formData.password
      };
      
      try {
        onSubmit(teacherData);
        onClose(); // Close the modal after submission
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to add teacher");
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
        <h2 className="text-lg font-semibold mb-4">Add New Teacher</h2>

        <form onSubmit={handleSubmit} className={inputContainer} noValidate>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="teachername">Full Name: <span className="text-red-500">*</span></label>
            <input
              id="teachername"
              type="text"
              name="teachername"
              value={formData.teachername}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${input} ${shouldShowError('teachername') ? "border-red-500" : ""}`}
              placeholder="Enter teacher's full name"
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
            <label htmlFor="phone">Phone Number: <span className="text-gray-400">(Optional)</span></label>
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
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="password">Password: <span className="text-red-500">*</span></label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${input} ${shouldShowError('password') ? "border-red-500" : ""}`}
              placeholder="Enter password"
              aria-invalid={shouldShowError('password')}
              aria-describedby={shouldShowError('password') ? "password-error" : undefined}
            />
            {shouldShowError('password') && <span id="password-error" className={errorStyle}>{errors.password}</span>}
            {!errors.password && (
              <span className="text-gray-500 text-xs">Password must be at least 6 characters</span>
            )}
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="confirmPassword">Confirm Password: <span className="text-red-500">*</span></label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${input} ${shouldShowError('confirmPassword') ? "border-red-500" : ""}`}
              placeholder="Confirm password"
              aria-invalid={shouldShowError('confirmPassword')}
              aria-describedby={shouldShowError('confirmPassword') ? "confirmPassword-error" : undefined}
            />
            {shouldShowError('confirmPassword') && <span id="confirmPassword-error" className={errorStyle}>{errors.confirmPassword}</span>}
          </div>

            <div className="flex w-full gap-1 flex-row">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 flex-auto disabled:opacity-65 text-white rounded-md p-2 mt-3 w-full md:w-[47%] hover:bg-blue-600 transition-colors"
            >
              {isLoading ? "Processing..." : "Add Teacher"}
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
      </div>
    </div>
  );
};

export default AddTeacherModal;