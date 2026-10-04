const { addMaterial, getAllMaterials, getOneMaterial, deleteMaterial, updateMaterial } = require('../controllers/Material-controllers')
const upload = require('../middleware/Upload-middlware')
const { verifyTokenWithCookies, verifyAdminMiddleWare, verifyIfIsBanned } = require('../middleware/verify-token-middleware')

const router = require('express').Router()

// all user routes only
router.use(verifyTokenWithCookies)
router.use(verifyIfIsBanned)
router.get('/getall', getAllMaterials)
router.get('/getone/:materialId', getOneMaterial)

// admin only routes 
router.use(verifyAdminMiddleWare)
router.post('/add',upload.single('materialImage'), addMaterial)
router.delete('/delete', deleteMaterial)
router.put('/edit/:materialId',upload.single('materialImage'), updateMaterial)



module.exports = router