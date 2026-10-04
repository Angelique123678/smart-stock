import api from "../API";



class TeacherService {
  constructor() {

  }

  /**
   * Get all teachers
   * @returns {Promise} - Promise with teachers data
   */
  async getAllTeachers() {
    try {
      const response = await api.get(`/teacher/get-teachers`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Add a single teacher
   * @param {Object} teacherData - Object containing teachername, email, phone, password
   * @returns {Promise} - Promise with created teacher data
   */
  async addTeacher(teacherData) {
    try {
      const response = await api.post(`/teacher/add-teacher`, teacherData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Add multiple teachers at once
   * @param {Array} teachers - Array of teacher objects with teachername, email, phone, password
   * @returns {Promise} - Promise with success and failure information
   */
  async addManyTeachers(teachers) {
    try {
      const response = await api.post(`/teacher/add-many`, {
        teachers
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Edit a teacher's information
   * @param {number} teacherId - ID of the teacher to edit
   * @param {Object} teacherData - Object containing teachername, email, phone to update
   * @returns {Promise} - Promise with updated teacher data
   */
  async editTeacher(teacherId, teacherData) {
    try {
      const response = await api.put(`/teacher/edit/${teacherId}`, teacherData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  /**
   * Ban a teacher
   * @param {number} teacherId - ID of the teacher to ban
   * @returns {Promise} - Promise with updated teacher data
   */
  async banTeacher(teacherId) {
    try {
      const response = await api.put(`/teacher/ban-teacher/${teacherId}`,{}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  /**
   * Unban a teacher
   * @param {number} teacherId - ID of the teacher to unban
   * @returns {Promise} - Promise with updated teacher data
   */
  async unbanTeacher(teacherId) {
    try {
      const response = await api.put(`/teacher/unban-teacher/${teacherId}`,{}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Delete multiple teachers
   * @param {Array} teacherIds - Array of teacher IDs to delete
   * @returns {Promise} - Promise with deletion results
   */
  async deleteTeachers(teacherIds) {
    try {
      const response = await api.delete(`/teacher/delete`, {
        data: { teacherIds },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Handle API error responses
   * @param {Error} error - Error object from API call
   */
  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
  }
}

export default new TeacherService();