import React, { useState, useEffect } from "react";
import { AlertCircle, Trash2Icon } from "lucide-react";
import TeacherServices from "../../../services/TeacherServices";

const DeleteTeacherModal = ({ isOpen, onClose, teacherIds, teachers, onDeleteSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [affectedTeachers, setAffectedTeachers] = useState([]);

  useEffect(() => {
    if (isOpen && teacherIds && teachers) {
      // Find the teachers that match the IDs to be deleted
      const teachersToDelete = teachers.filter(teacher => 
        teacherIds.includes(teacher.user_id)
      );
      setAffectedTeachers(teachersToDelete);
    }
  }, [isOpen, teacherIds, teachers]);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await TeacherServices.deleteTeachers(teacherIds);
      
      if (response) {
        onDeleteSuccess(teacherIds);
        onClose();
      }
    } catch (error) {
      console.error("Error deleting teachers:", error);
      setError(error.response?.data?.message || "Failed to delete teachers");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3] flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center mb-4">
          <div className="rounded-full bg-red-100 p-2 mr-3">
            <Trash2Icon className="text-red-600" size={20} />
          </div>
          <h2 className="text-xl font-semibold">Confirm Deletion</h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            {teacherIds.length === 1
              ? "Are you sure you want to delete this teacher?"
              : `Are you sure you want to delete these ${teacherIds.length} teachers?`}
          </p>
          
          {affectedTeachers.length > 0 && (
            <div className="mt-3 max-h-40 overflow-y-auto">
              <p className="font-medium mb-2">Teachers to be deleted:</p>
              <ul className="bg-gray-50 rounded-md p-3">
                {affectedTeachers.map((teacher) => (
                  <li key={teacher.user_id} className="py-1 border-b border-gray-200 last:border-0">
                    <span className="font-semibold">{teacher.name}</span> - {teacher.email}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-center text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle size={18} className="mr-2" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Trash2Icon size={18} className="mr-2" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTeacherModal;