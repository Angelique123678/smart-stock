const { Material, Trade } = require("../models")

const addMaterial = async (req, res) => {
    const { name, category, quantity, default_message, trade_categories } = req.body;
    console.log(req.body);

    try {
        const image = req.file ? req.file.path : null;

        if (!name || !category || !quantity || !default_message) return res.status(400).json({ message: "All fields are required" });
        if (!trade_categories || !Array.isArray(trade_categories) || trade_categories.length === 0) return res.status(400).json({ message: "Trade categories must be a non-empty array" });

        const existingMaterial = await Material.findOne({ where: { name } });

        if (existingMaterial) return res.status(400).json({ message: "Material already exists" });
        if (quantity < 0) return res.status(400).json({ message: "Quantity cannot be negative" });
        if (!["Equipment", "Non-Consumable", "Consumable"].includes(category)) return res.status(400).json({ message: "Category must be either Equipment, Non-Consumable or Consumable" });

        const createdMaterial = await Material.create({
            name,
            category,
            image,
            isAvailable: true,
            quantity,
            default_message
        });

        // Validate and attach trades
        const validTradeIds = [];
        for (const tradeId of trade_categories) {
            if (!tradeId) continue;
            const trade = await Trade.findByPk(tradeId);
            if (trade) validTradeIds.push(tradeId);
        }

        if (validTradeIds.length > 0) {
            await createdMaterial.setTrades(validTradeIds);
        }

        // Fetch the created material with its associated trades
        const materialWithTrades = await Material.findByPk(createdMaterial.material_id, {
            include: [{
                model: Trade,
                as: 'trades',
                through: { attributes: [] } // Exclude junction table attributes
            }]
        });

        return res.status(201).json({
            message: "Material created successfully",
            material: materialWithTrades
        });

    } catch (error) {
        console.error('Error on creating material:', error);
        return res.status(500).json({
            message: error.message
        });
    }
};


const getAllMaterials = async(req, res)=>{
    try {
        const materials = await Material.findAll({
            include: [{
                association: Material.associations.trades
              }]
        })
        return res.status(200).json({
            materials
        })
    } catch (error) {
        console.log('error on fetching material:', error)
        return res.status(400).json({
            message:error.message
        })
    }
}

const getOneMaterial = async (req, res)=>{
    const { materialId } = req.params
    console.log(materialId);
    

    try {
        if(!materialId) return res.status(400).json({ message: "material id is required" })
        const material = await Material.findByPk(materialId,{
            include: [{
                association: Material.associations.trades
              }]
        })
        if(!material) return res.status(400).json({ message: "material not found" })
        return res.status(200).json({
            material
        })
    } catch (error) {
        console.log('error on fetching one material:', error)
        return res.status(400).json({
            message:error.message
        })
    }
}

const deleteMaterial = async (req, res) => {
    const { AllmaterialId } = req.body;

    try {
        if (!Array.isArray(AllmaterialId) || AllmaterialId.length === 0) {
            return res.status(400).json({ message: "Material IDs are required" });
        }

        const results = await Promise.all(
            AllmaterialId.map(async (materialId) => {
                if (!materialId) return { success: false, id: materialId, message: "Invalid material ID." };

                const material = await Material.findByPk(materialId);

                if (!material) return { success: false, id: materialId, message: "Material not found." };

                await material.destroy();
                return { success: true, id: materialId };
            })
        );

        const failures = results.filter(result => !result.success);

        if (failures.length) {
            return res.status(207).json({
                message: "Some materials could not be deleted.",
                failures,
            });
        }

        return res.status(200).json({
            message: "All materials deleted successfully",
        });

    } catch (error) {
        console.log('Error on deleting material:', error);
        return res.status(500).json({
            message: error.message
        });
    }
};



const updateMaterial = async (req, res) => {
    const { materialId } = req.params;
    const { name, category, quantity, default_message, trade_categories } = req.body;
    console.log('update model',materialId);
    console.log(req.body);
    
    
    try {
        // Find material
        const material = await Material.findByPk(materialId);
        if (!material) {
            return res.status(404).json({ message: "Material not found" });
        }
        
        // Validate inputs - only validate what's provided
        if (quantity !== undefined && quantity < 0) {
            return res.status(400).json({ message: "Quantity cannot be negative" });
        }
        
        if (category && !["Equipment", "Non-Consumable", "Consumable"].includes(category)) {
            return res.status(400).json({ message: "Category must be either Equipment, Non-Consumable, or Consumable" });
        }
        
        if (trade_categories && (!Array.isArray(trade_categories) || trade_categories.length === 0)) {
            return res.status(400).json({ message: "Trade categories must be a non-empty array" });
        }
        
        // Update material fields - only update what's provided
        if (name !== undefined) material.name = name;
        if (category !== undefined) material.category = category;
        if (quantity !== undefined) material.quantity = quantity;
        if (default_message !== undefined) material.default_message = default_message;
        if (req.file) material.image = req.file.path;
        
        await material.save();
        
        // Update trade associations if provided
        if (trade_categories && Array.isArray(trade_categories)) {
            const validTradeIds = [];
            for (const tradeId of trade_categories) {
                if (!tradeId) continue;
                const trade = await Trade.findByPk(tradeId);
                if (trade) validTradeIds.push(tradeId);
            }
            
            await material.setTrades(validTradeIds);
        }
        
        // Fetch updated material with trades
        const updatedMaterial = await Material.findByPk(materialId, {
            include: [{
                model: Trade,
                as: 'trades',
                through: { attributes: [] } // Exclude junction table attributes
            }]
            
        });
        
        return res.status(200).json({
            message: "Material updated successfully",
            material: updatedMaterial
        });
    } catch (error) {
        console.error('Error on updating material:', error);
        return res.status(500).json({
            message: error.message || 'An error occurred while updating the material'
        });
    }
};


module.exports = {
    addMaterial,
    getAllMaterials,
    deleteMaterial,
    getOneMaterial,
    updateMaterial
}