
const {Trade, Material} = require("../models");


const createTrade = async (req,res)=>{
    const {trade_long_name, trade_short_name} = req.body
    try {

        if(!trade_long_name || !trade_short_name) return res.status(400).json({ message: "trade name is required" })
        const existingTrade = await Trade.findOne({ where: { trade_short_name: trade_short_name } })
        if(existingTrade) return res.status(400).json({ message: "trade already exists" })

        const createdTrade = await Trade.create({
            trade_long_name: trade_long_name,
            trade_short_name:  trade_short_name,
        },{
             include:{
                model:Material,
                as:"materials",
                through:{attributes:[]}
            }
        })
        return res.status(201).json({
            message:"trade created successfully",
            trade: createdTrade
        })
        
    } catch (error) {
        console.log('error on creating trade:', error)
        return res.status(500).json({
            message:error.message
        })
        
    }
}

const getAllTrades = async(req, res)=>{
    try {
        const trades = await Trade.findAll({
            include:{
                model:Material,
                as:"materials",
                through:{attributes:[]}
            }
        })
        return res.status(200).json({
            trades
        })
    } catch (error) {
        console.log('error on fetching trade:', error)
        return res.status(500).json({
            message:'server error'
        })
    }
}


const getOneTrade = async (req, res)=>{
    const { tradeId } = req.params
    try {
        if(!tradeId) return res.status(400).json({ message: "trade id is required" })
        const trade = await Trade.findByPk(tradeId,{
            include:{
                model:Material,
                as:"materials",
                through:{attributes:[]}
            }
        })
        if(!trade) return res.status(404).json({ message: "trade not found" })
        return res.status(200).json({
            trade
        })
        
    } catch (error) {
        console.log('error on fetching one trade:', error)
        return res.status(500).json({
            message:'server error'
        })
        
    }
}
const deleteTrade = async (req, res) => {
    const { AllTradeId } = req.body; // Should come from body, not params

    if (!Array.isArray(AllTradeId) || AllTradeId.length === 0) {
        return res.status(400).json({ message: "Valid trade IDs are required." });
    }

    try {
        const results = await Promise.all(
            AllTradeId.map(async (tradeId) => {
                if (!tradeId) return { success: false, id: tradeId, message: "Invalid trade ID." };

                const trade = await Trade.findByPk(tradeId);
                if (!trade) return { success: false, id: tradeId, message: "Trade not found." };

                await trade.destroy();
                return { success: true, id: tradeId };
            })
        );

        const failures = results.filter(result => !result.success);

        if (failures.length) {
            return res.status(207).json({
                message: "Some trades could not be deleted.",
                failures,
            });
        }

        return res.status(200).json({ message: "All trades deleted successfully." });

    } catch (error) {
        console.error('Error deleting trades:', error);
        return res.status(500).json({ message: "Server error." });
    }
};


const updateTrade = async (req, res) => {
    const { tradeId } = req.params
    const { trade_long_name, trade_short_name } = req.body

    try {
        console.log(tradeId);
        
        if (!tradeId) return res.status(400).json({ message: "trade id is required" })
        const trade = await Trade.findByPk(tradeId,{
            include:{
                model:Material,
                as:"materials",
                through:{attributes:[]}
            }
        })

        if (!trade) return res.status(404).json({ message: "trade not found" })

        await trade.update({
            trade_long_name: trade_long_name || trade.trade_long_name,
            trade_short_name: trade_short_name || trade.trade_short_name,
        }, {
            where: { trade_id: tradeId },
            returning: true,
        })

        return res.status(200).json({
            message: "trade updated successfully",
            trade
        })
    } catch (error) {
        console.log('error on updating trade:', error)
        return res.status(500).json({
            message: 'server error'
        })
    }
}


module.exports = {
    createTrade,
    getAllTrades,
    getOneTrade,
    deleteTrade,
    updateTrade
}