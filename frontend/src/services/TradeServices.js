import api from '../API';


/**
 * Service for managing trades through API calls
 */
class TradeService {
  /**
   * Get all trades
   * @returns {Promise} Promise with trades data
   */
  async getAllTrades() {
    try {
      const response = await api.get(`/trade/getAll`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trades:', error);
      throw error;
    }
  }

  /**
   * Get a specific trade by id
   * @param {string} tradeId - The ID of the trade
   * @returns {Promise} Promise with trade data
   */
  async getTradeById(tradeId) {
    try {
      const response = await api.get(`/trade/getOne/${tradeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching trade ${tradeId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new trade
   * @param {Object} tradeData - The trade data
   * @param {string} tradeData.trade_long_name - Long name of the trade
   * @param {string} tradeData.trade_short_name - Short name/code of the trade
   * @returns {Promise} Promise with created trade
   */
  async createTrade(tradeData) {
    try {
      const response = await api.post(`/trade/create`, tradeData);
      return response.data;
    } catch (error) {
      console.error('Error creating trade:', error);
      throw error;
    }
  }

  /**
   * Update an existing trade
   * @param {string} tradeId - The ID of the trade to update
   * @param {Object} tradeData - The trade data to update
   * @param {string} [tradeData.trade_long_name] - Long name of the trade
   * @param {string} [tradeData.trade_short_name] - Short name/code of the trade
   * @returns {Promise} Promise with updated trade
   */
  async updateTrade(tradeId, tradeData) {
    try {
      const response = await api.put(`/trade/update/${tradeId}`, tradeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating trade ${tradeId}:`, error);
      throw error;
    }
  }

  /**
   * Delete trades by their IDs
   * @param {Array} tradeIds - Array of trade IDs to delete
   * @returns {Promise} Promise with deletion result
   */
  async deleteTrades(tradeIds) {
    try {
      const response = await api.delete(`/trade/delete`, {
        data: { AllTradeId: tradeIds }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error deleting trades:', error);
      throw error;
    }
  }
}

export default new TradeService();