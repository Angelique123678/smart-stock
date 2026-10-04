const { User } = require("../models/index");
const bcrypt = require('bcryptjs')

const { sendMail, generateEmailCodeTemplate, checkInputType, hashEmail, verifyOtp, generateSixDigitNumber } = require('../middleware/Email-middleWare');
const { verifyTokenWithCookies, generateUserAccessToken, generateUserRefreshToken } = require('../middleware/verify-token-middleware');

const loginController = async (req, res) => {
    const { password, email, } = req.body;
    console.log(req.body);

    
    try {

        if (!password) return res.status(400).json({ message: 'password is needed' })

        if (checkInputType(email) !== `email`) return res.status(403).json({ message: 'your email is invalid' })

        const user = await User.findOne({
            where: { email },raw:true
        })

        if (!user) return res.status(404).json({ message: 'user doesn\'t exist' });
        const isPasswordCorrect = bcrypt.compareSync(password, user.password)

        if (!isPasswordCorrect) return res.status(400).json({ message: 'password is incorrect' })

        const AccessToken = await generateUserAccessToken(user)
        const RefreshToken = await generateUserRefreshToken(user)

        const { password: shit, ...others } = user

        res.cookie('AccessToken', AccessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }).cookie('RefreshToken', RefreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }).status(200).json({ message: 'succesfully logged in with email', user: others })

    } catch (error) {
        console.log('error occured try to login : ', error.message);
        res.status(500).json({ message: "server error" })
    }
}


const logoutController = async (req, res) => {

    const { userId } = req.params

    try {

        if (req.user.user_id != userId) {
            return res.status(403).json({ message: `this not your account` })
        }

        res.clearCookie('AccessToken', { httpOnly: true, secure: true, sameSite: `none`, })
            .clearCookie('RefreshToken', { httpOnly: true, secure: true, sameSite: `none`, })
            .status(200).json({ message: 'succesfully logged in with email' })

    } catch (error) {
        console.log('error occured try to logout : ', error.message);
        res.status(500).json({ message: "server error" })
    }
}


const registerController = async (req, res) => {
    const { name: username, password, email, role, } = req.body;
   

    try {

        if (!username || !password || checkInputType(email) !== 'email' || !role) {
            return res.status(400).json({ message: "all info must be filled" })
        }

        const user = await User.findAll({where:{email} })

        if (user.length > 0) {
            return res.status(403).json({ message: 'this user already exist' })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUserData = { email, name:username, password: hashedPassword, role }
        const newuser = await User.create({ ...newUserData })


        res.status(200).json({ message: 'created user succesfully', userContact: email, verify: true, newuser})

    } catch (error) {
        console.log('error occured try to signup : ', error.message);
        res.status(500).json({ message: "server error" })
    }
}


const authUser = async (req, res) => {

    try {

        const user =  req.user

        res.status(200).json({ message: 'succesfully logged in with email', user,authenticated:true })

    } catch (error) {
        console.log('error occured try to check user : ', error.message);
        res.status(500).json({ message: "server error" })
    }
}



module.exports = {
    loginController,
    logoutController,
    authUser,
    registerController,
}