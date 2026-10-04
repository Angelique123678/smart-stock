import React, { useState, useEffect } from "react";
import { AlertCircle, CheckSquare } from "lucide-react";
import TeacherServices from "../../../services/TeacherServices";

const UnbanTeacherModal = ({ isOpen, onClose, teacherId, teacherData, onUnbanSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    if (isOpen && teacherId && teacherData) {
      // Find the teacher that matches the ID
      const teacherToUnban = teacherData.find(teacher => teacher.user_id === teacherId);
      setTeacher(teacherToUnban);
    }
  }, [isOpen, teacherId, teacherData]);

  const handleUnban = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await TeacherServices.unbanTeacher(teacherId);
      
      if (response) {
        onUnbanSuccess(response.teacher);
        onClose();
      }
    } catch (error) {
      console.error("Error unbanning teacher:", error);
      setError(error.response?.data?.message || "Failed to unban teacher");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 z-[3] flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center mb-4">
          <div className="rounded-full bg-green-100 p-2 mr-3">
            <CheckSquare className="text-green-600" size={20} />
          </div>
          <h2 className="text-xl font-semibold">Confirm Unban</h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to unban this teacher? They will be able to access the system again.
          </p>
          
          <div className="mt-3 bg-gray-50 rounded-md p-4">
            <div className="flex flex-col">
              <p className="font-medium">Teacher Information:</p>
              <p className="mt-2"><span className="font-semibold">Name:</span> {teacher.name}</p>
              <p><span className="font-semibold">Email:</span> {teacher.email}</p>
              <p><span className="font-semibold">Phone:</span> {teacher.phone || 'Not provided'}</p>
              <p className="mt-2">
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  Currently Banned
                </span>
              </p>
            </div>
          </div>

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
            onClick={handleUnban}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
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
                <CheckSquare size={18} className="mr-2" />
                Unban Teacher
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnbanTeacherModal;