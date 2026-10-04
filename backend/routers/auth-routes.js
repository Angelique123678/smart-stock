
const router = require('express').Router()
const { loginController, logoutController, registerController, authUser } = require('../controllers/auth-controller');
const { verifyTokenWithCookies, verifyIfIsBanned } = require('../middleware/verify-token-middleware');



router.post('/login', loginController )
router.post('/register',registerController)

router.use(verifyTokenWithCookies)
router.use(verifyIfIsBanned)
router.get('/user-auth' ,authUser)
router.post('/logout/:userId', logoutController)


module.exports = router