import React, { useState, useEffect } from "react";
import TradeServices from "../../../services/TradeServices";

const AddTradeModel = ({ isOpen, onClose, onSubmit }) => {
  const initialFormState = {
    trade_short_name: "",
    trade_long_name: "",
  };

  const initialErrorState = {
    trade_short_name: "",
    trade_long_name: "",
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
      case "trade_short_name":
        if (!value.trim()) {
          errorMessage = "Short name is required";
        } else if (value.trim().length < 2) {
          errorMessage = "Short name must be at least 2 characters";
        } else if (value.trim().length > 30) {
          errorMessage = "Short name must be less than 30 characters";
        } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(value)) {
          errorMessage = "Short name contains invalid characters";
        }
        break;
        
      case "trade_long_name":
        if (!value.trim()) {
          errorMessage = "Long name is required";
        } else if (value.trim().length < 3) {
          errorMessage = "Long name must be at least 3 characters";
        } else if (value.trim().length > 100) {
          errorMessage = "Long name must be less than 100 characters";
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
      trade_short_name: validateField("trade_short_name", formData.trade_short_name),
      trade_long_name: validateField("trade_long_name", formData.trade_long_name),
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
      trade_short_name: true,
      trade_long_name: true
    });
    
    setIsLoading(true);
    
    // Validate all fields before submission
    if (validateForm()) {
      try {
        onSubmit(formData);
        onClose(); // Close the modal after submission
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
        <h2 className="text-lg font-semibold mb-4">Add New Trade</h2>

        <form onSubmit={handleSubmit} className={inputContainer} noValidate>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="trade_short_name">Trade Short Name: <span className="text-red-500">*</span></label>
            <input
              id="trade_short_name"
              type="text"
              name="trade_short_name"
              value={formData.trade_short_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${input} ${shouldShowError('trade_short_name') ? "border-red-500" : ""}`}
              placeholder="Enter trade short name"
              aria-invalid={shouldShowError('trade_short_name')}
              aria-describedby={shouldShowError('trade_short_name') ? "trade_short_name-error" : undefined}
            />
            {shouldShowError('trade_short_name') && <span id="trade_short_name-error" className={errorStyle}>{errors.trade_short_name}</span>}
            {!errors.trade_short_name && (
              <span className="text-gray-500 text-xs">Short identifier used to represent the trade (ex: HVAC, Elec, Plumb)</span>
            )}
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="trade_long_name">Trade Long Name: <span className="text-red-500">*</span></label>
            <input
              id="trade_long_name"
              type="text"
              name="trade_long_name"
              value={formData.trade_long_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${input} ${shouldShowError('trade_long_name') ? "border-red-500" : ""}`}
              placeholder="Enter trade full name"
              aria-invalid={shouldShowError('trade_long_name')}
              aria-describedby={shouldShowError('trade_long_name') ? "trade_long_name-error" : undefined}
            />
            {shouldShowError('trade_long_name') && <span id="trade_long_name-error" className={errorStyle}>{errors.trade_long_name}</span>}
            {!errors.trade_long_name && (
              <span className="text-gray-500 text-xs">Full descriptive name of the trade (ex: Heating, Ventilation, and Air Conditioning)</span>
            )}
          </div>
  <div className="flex w-full gap-1 flex-row">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 flex-auto disabled:opacity-65 text-white rounded-md p-2 mt-3 w-full md:w-[47%] hover:bg-blue-600 transition-colors"
            >
              {isLoading ? "Processing..." : "Add Trade"}
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

export default AddTradeModel;