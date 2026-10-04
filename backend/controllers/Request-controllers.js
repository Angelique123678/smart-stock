const { Material, Request } = require("../models")

const requestMaterial = async(req, res)=>{
    const { userId, materialId, quantity_requested, status , request_date} = req.body
    console.log(req.body)
    
    try {
        const material = await Material.findByPk(materialId,{
            attributes:['quantity']
        })
        if(!material) return res.status(404).json({ message: "material not found" })
        console.log('quantity:', material.quantity);
        // if(material.quantity < quantity_requested) return res.status(400).json({ message:"not enough material" })
        const createRequest = await Request.create({
            user_id: userId,
            material_id: materialId,
            quantity_requested: quantity_requested,
            status:status,
            request_date: request_date,
        })
        return res.status(201).json({
            message:"request created successfully",
            request: createRequest
        })
    } catch (error) {
        console.log('error  creating request:', error)
        res.status(500).json({
            message:error.message
        })
    }
}



const getAllRequest = async (req,res)=>{

    try {

        const requests = await Request.findAll();

        res.status(200).json({message:'all requests', requests}) 

        
    } catch (error) {
        console.log('error  creating request:', error)
        res.status(500).json({
            message:error.message
        })
    }

}

const UpdateOneRequest = async (req,res)=>{
    const {id} = req.params

    const {quantity_requested} = req.body

    try {

        const request = await Request.findByPk(id);
        if(request) return res.status(404).json({message:'request not found'})

        // const updateRequest = await Request.update({
        //     {quantity_requested:quantity_requested},
        //     where:{
        //         request_id:id
        //     }}
        // )

        
    } catch (error) {
        console.log('error  creating request:', error)
        res.status(500).json({
            message:error.message
        })
    }

}




module.exports = {
    requestMaterial,
    getAllRequest,
}