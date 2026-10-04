const { requestMaterial } = require('../controllers/Request-controllers');
const { verifyTokenWithCookies, verifyIfIsBanned } = require('../middleware/verify-token-middleware');

const router = require('express').Router()


router.use(verifyTokenWithCookies)
router.use(verifyIfIsBanned)


router.post('/create/requestMaterial', requestMaterial);

router.get('/get/',)


module.exports = router
