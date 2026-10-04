
import api from '../API';

/**
 * Service for managing materials through API calls
 */
class MaterialService {
  /**
   * Get all materials
   * @returns {Promise} Promise with materials data
   */
  async getAllMaterials() {
    try {
      const response = await api.get(`/material/getall`);
      return response.data;
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  }

  /**
   * Get a specific material by id
   * @param {string} materialId - The ID of the material
   * @returns {Promise} Promise with material data
   */
  async getMaterial(materialId) {
    try {
      const response = await api.get(`/material/getone/${materialId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching material ${materialId}:`, error);
      throw error;
    }
  }

 /**
 * Create a new material
 * @param {Object} materialData - The material data
 * @param {string} materialData.name - Material name
 * @param {string} materialData.category - Material category (Equipment, Non-Consumable, Consumable)
 * @param {number} materialData.quantity - Material quantity
 * @param {string} materialData.default_message - Default message for the material
 * @param {Array} materialData.trade_categories - Array of trade category IDs
 * @param {File} [file] - Optional image file
 * @returns {Promise} Promise with created material
 */
async createMaterial(materialData, file) {
  try {
    const formData = new FormData();
   
    // Append all material data fields
    Object.keys(materialData).forEach(key => {
      if (key === 'trade_categories' && Array.isArray(materialData[key])) {
        // Handle array of trade categories - force array format even for single item
        if (materialData[key].length === 0) {
          // Handle empty array case if needed
        } else if (materialData[key].length === 1) {
          // For single item, explicitly append with the same key name twice
          // This forces the backend to treat it as an array
          formData.append('trade_categories[]', materialData[key][0]);
        } else {
          // For multiple items
          materialData[key].forEach(tradeId => {
            formData.append('trade_categories[]', tradeId);
          });
        }
      } else {
        formData.append(key, materialData[key]);
      }
    });
   
    // Append file if exists
    if (file) {
      formData.append('image', file);
    }
   
    const response = await api.post(`/material/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      
    });
   
    return response.data;
  } catch (error) {
    console.error('Error creating material:', error);
    throw error;
  }
}

/**
 * Update an existing material
 * @param {string} materialId - The ID of the material to update
 * @param {Object} materialData - The material data to update
 * @param {File} [file] - Optional new image file
 * @returns {Promise} Promise with updated material
 */
async updateMaterial(materialId, materialData, file) {
  try {
    const formData = new FormData();
   
    // Append all material data fields that are defined
    Object.keys(materialData).forEach(key => {
      if (materialData[key] !== undefined) {
        if (key === 'trade_categories' && Array.isArray(materialData[key])) {
          // Handle array of trade categories - force array format even for single item
          if (materialData[key].length === 0) {
            // Handle empty array case if needed
          } else if (materialData[key].length === 1) {
            // For single item, explicitly append with the same key name twice
            // This forces the backend to treat it as an array
            formData.append('trade_categories[]', materialData[key][0]);
          } else {
            // For multiple items
            materialData[key].forEach(tradeId => {
              formData.append('trade_categories[]', tradeId);
            });
          }
        } else {
          formData.append(key, materialData[key]);
        }
      }
    });
   
    // Append file if exists
    if (file) {
      formData.append('image', file);
    }
   
    const response = await api.put(`/material/edit/${materialId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
   
    return response.data;
  } catch (error) {
    console.error(`Error updating material ${materialId}:`, error);
    throw error;
  }
}
  /**
   * Delete materials by their IDs
   * @param {Array} materialIds - Array of material IDs to delete
   * @returns {Promise} Promise with deletion result
   */
  async deleteMaterials(materialIds) {
    try {
      const response = await api.delete(`/material/delete`, {
        data: { AllmaterialId: materialIds }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error deleting materials:', error);
      throw error;
    }
  }
}

export default new MaterialService();