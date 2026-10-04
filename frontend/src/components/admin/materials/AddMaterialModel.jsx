import React, { useEffect, useState } from "react";
import TradeServices from "../../../services/TradeServices";
import toast from "react-hot-toast";

const AddMaterialModel = ({ isOpen, onClose, onSubmit }) => {
  const initialFormState = {
    name: "",
    category: "",
    quantity: 5,
    default_message: "",
    trade_categories: [],
  };

  const initialErrorState = {
    name: "",
    category: "",
    quantity: "",
    default_message: "",
    trade_categories: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(initialErrorState);
  const [touched, setTouched] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchTrades = async () => {
      setIsLoading(true);
      try {
        const response = await TradeServices.getAllTrades();
        const trades = response.trades;
        setTrades(pre=>trades);
      } catch (error) {
        console.error("Error fetching trades:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrades();
  }, []);

  useEffect(()=>{

    if( isOpen && !isLoading && trades.length ==0 ){

      toast.error('Need to Add Trades First Before You Add Materials')
      
      onClose()
    }

  },[trades,isOpen])



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
      case "name":
        if (!value.trim()) {
          errorMessage = "Name is required";
        } else if (value.trim().length < 2) {
          errorMessage = "Name must be at least 2 characters";
        } else if (value.trim().length > 50) {
          errorMessage = "Name must be less than 50 characters";
        } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(value)) {
          errorMessage = "Name contains invalid characters";
        }
        break;
        
      case "category":
        if (!value) {
          errorMessage = "Please select a category";
        }
        break;
        
      case "quantity":
        if (value === "" || value === null) {
          errorMessage = "Quantity is required";
        } else if (isNaN(Number(value))) {
          errorMessage = "Quantity must be a number";
        } else if (Number(value) < 5) {
          errorMessage = "Minimum quantity is 5";
        } else if (Number(value) > 1000) {
          errorMessage = "Maximum quantity is 1000";
        } else if (!Number.isInteger(Number(value))) {
          errorMessage = "Quantity must be a whole number";
        }
        break;
        
      case "default_message":
        if (!value.trim()) {
          errorMessage = "Default message is required";
        } else if (value.trim().length < 10) {
          errorMessage = "Message must be at least 10 characters";
        } else if (value.trim().length > 500) {
          errorMessage = "Message cannot exceed 500 characters";
        }
        break;
        
      case "trade_categories":
        if (!Array.isArray(value) || value.length === 0) {
          errorMessage = "At least one trade must be selected";
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

  const handleTradeChange = (e) => {
    const { value, checked } = e.target;
    let updatedTrades;

    if (checked) {
      updatedTrades = [...formData.trade_categories, Number(value)];
    } else {
      updatedTrades = formData.trade_categories.filter(
        (tradeId) => tradeId !== Number(value)  
      );
    }

    setFormData((prev) => ({
      ...prev,
      trade_categories: updatedTrades,
    }));

    // Mark field as touched
    if (!touched.trade_categories) {
      setTouched(prev => ({ ...prev, trade_categories: true }));
    }
  };

  const validateForm = () => {
    // Validate all fields
    const newErrors = {
      name: validateField("name", formData.name),
      category: validateField("category", formData.category),
      quantity: validateField("quantity", formData.quantity),
      default_message: validateField("default_message", formData.default_message),
      trade_categories: validateField("trade_categories", formData.trade_categories),
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
      name: true,
      category: true,
      quantity: true,
      default_message: true,
      trade_categories: true
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
  const selectInput = `${input} h-10`;

  const shouldShowError = (fieldName) => {
    return (touched[fieldName] || formSubmitted) && errors[fieldName];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2] flex items-center justify-center bg-gray-500 bg-opacity-50 w-full">
      <div className="flex flex-col bg-white items-center justify-center min-h-full sm:min-h-max sm:p-10 md:p-14 xl:p-20 sm:rounded-lg shadow-lg w-full sm:w-10/12 md:w-9/12 lg:w-1/2 max-h-screen overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add New Item</h2>

        <form onSubmit={handleSubmit} className={inputContainer} noValidate>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="name">Name: <span className="text-red-500">*</span></label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${input} ${shouldShowError('name') ? "border-red-500" : ""}`}
              placeholder="Enter item name"
              aria-invalid={shouldShowError('name')}
              aria-describedby={shouldShowError('name') ? "name-error" : undefined}
            />
            {shouldShowError('name') && <span id="name-error" className={errorStyle}>{errors.name}</span>}
          </div>
          
          <div className="flex flex-col gap-4 w-full">
            <label>Trade: <span className="text-red-500">*</span></label>
            
            {trades.length === 0 && isLoading ? (
              <div className="text-center py-2">Loading trades...</div>
            ) : trades.length === 0 ? (
              <div className="text-center py-2 text-red-500">No trades available</div>
            ) : (
              <div className="flex flex-wrap items-center justify-start gap-4 overflow-x-auto w-full">
                {trades.map((trade) => (
                  <div key={trade.trade_id} className="flex items-center gap-2">
                    <input
                      id={`trade-${trade.trade_id}`}
                      type="checkbox"
                      name="trade_categories"
                      value={trade.trade_id}
                      onChange={handleTradeChange}
                      onBlur={() => setTouched(prev => ({ ...prev, trade_categories: true }))}
                      className="checkbox border-gray-300 checked:checkbox-info"
                      checked={formData.trade_categories.includes(trade.trade_id)}
                    />
                    <label htmlFor={`trade-${trade.trade_id}`}>{trade.trade_short_name}</label>  
                  </div>
                ))}
              </div>
            )}
            {shouldShowError('trade_categories') && <span className={errorStyle}>{errors.trade_categories}</span>}
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="category">Type: <span className="text-red-500">*</span></label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${selectInput} ${shouldShowError('category') ? "border-red-500" : ""}`}
              aria-invalid={shouldShowError('category')}
              aria-describedby={shouldShowError('category') ? "category-error" : undefined}
            >
              <option value="" disabled>Select Category</option>
              <option value="Equipment">Equipment</option>
              <option value="Non-Consumable">Non-Consumable</option>
              <option value="Consumable">Consumable</option>
            </select>
            {shouldShowError('category') && <span id="category-error" className={errorStyle}>{errors.category}</span>}
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="quantity">Quantity: <span className="text-red-500">*</span></label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              min={5}
              max={1000}
              value={formData.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${input} ${shouldShowError('quantity') ? "border-red-500" : ""}`}
              placeholder="Enter quantity (minimum 5)"
              aria-invalid={shouldShowError('quantity')}
              aria-describedby={shouldShowError('quantity') ? "quantity-error" : undefined}
            />
            {shouldShowError('quantity') && <span id="quantity-error" className={errorStyle}>{errors.quantity}</span>}
            {!errors.quantity && (
              <span className="text-gray-500 text-xs">Enter a value between 5 and 1000</span>
            )}
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="default_message">Default Message: <span className="text-red-500">*</span></label>
            <textarea
              id="default_message"
              name="default_message"
              value={formData.default_message}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              className={`${input} ${shouldShowError('default_message') ? "border-red-500" : ""}`}
              placeholder="Enter default message which it will send at teacher when request this material and it is not available (10-500 characters)"
              aria-invalid={shouldShowError('default_message')}
              aria-describedby={shouldShowError('default_message') ? "default_message-error" : undefined}
            ></textarea>
            {shouldShowError('default_message') && (
              <span id="default_message-error" className={errorStyle}>{errors.default_message}</span>
            )}
            <div className="text-gray-500 text-xs flex justify-between">
              <span>Min: 10 characters</span>
              <span>{formData.default_message.length}/500 characters</span>
            </div>
          </div>

        <div className="flex w-full gap-1 flex-row">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 flex-auto disabled:opacity-65 text-white rounded-md p-2 mt-3 w-full md:w-[47%] hover:bg-blue-600 transition-colors"
            >
              {isLoading ? "Processing..." : "Add Item"}
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

export default AddMaterialModel;