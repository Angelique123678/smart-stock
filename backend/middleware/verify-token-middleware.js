const jwt = require('jsonwebtoken')
const {User} = require('../models/index')

const verifyTokenWithHeaders = (req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
    if(!token){
        return  res.status(403).json({message:'dont have no token'})
    }
    jwt.verify(token,process.env.USER_ACCESS_TOKEN, async(err,data)=>{
        if(err) return res.status(403).json({message:'not authicated'})

        const user  = await User.findByPk(data.id,{attributes:{exclude:['password']}})
        
        req.user = user
        next()

    })
}


// Middleware to verify access token and automatically refresh if expired
const verifyTokenWithCookies = (req, res, next) => {
    const accessToken = req.cookies?.AccessToken;

    
    
    if (!accessToken) {
        return res.status(403).json({ message: 'Access token not found' });
    }
    
    jwt.verify(accessToken, process.env.USER_ACCESS_TOKEN, async (err, decoded) => {
        // If token is valid, proceed normally
        if (!err) {
            try {
                const user = await User.findByPk(decoded.id,{attributes:{exclude:['password']}});
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                req.user = user;
                return next();
            } catch (error) {
                console.log('Error finding user: ', error.message);
                return res.status(500).json({ message: 'Server error during authentication' });
            }
        }
        
        // If token is expired, try to use refresh token
        if (err.name === 'TokenExpiredError') {
            const refreshToken = req.cookies?.RefreshToken;
            
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token not found, please login again' });
            }
            
            // Verify refresh token
            jwt.verify(refreshToken, process.env.USER_REFRESH_TOKEN, async (refreshErr, refreshDecoded) => {
                if (refreshErr) {
                    console.log(`invalid`);
                    
                    return res.status(403).json({ message: 'Invalid refresh token, please login again' });
                }
                
                try {
                    // Find user from refresh token
                    const user = await User.findByPk(refreshDecoded.id,{attributes:{exclude:['password']}});
                    
                    if (!user) {
                        return res.status(404).json({ message: 'User not found' });
                    }
                    
                    // Generate new tokens
                    const newAccessToken = await generateUserAccessToken(user);
                    const newRefreshToken = await generateUserRefreshToken(user);
                    console.log(`token generated ${newAccessToken}`);
                    console.log(`token refresh generated ${newRefreshToken}`);
                    
                    
                    // Set new cookies
                    res.cookie('AccessToken', newAccessToken, {
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true,
                        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days 
                    });
                    
                    res.cookie('RefreshToken', newRefreshToken, {
                        httpOnly: true,
                        sameSite: `none`,
                        secure: true,
                        maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
                    });
                    
                    // Set user in request and continue
                    req.user = user;
                    next();
                    
                } catch (error) {
                    console.log('Error refreshing token in middleware: ', error.message);
                    return res.status(500).json({ message: 'Server error during token refresh' });
                }
            });
        } else {
            // For other token errors (not expiration)
            return res.status(403).json({ message: 'Authentication failed' });
        }
    });
};


const verifyAdminMiddleWare = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(403).json({ message: 'User not authenticated' });
        }

        const user = req.user
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        next();
    } catch (error) {
        console.error('Error in verifyAdminMiddleWare:', error.message);
        res.status(500).json({ message: 'Server error during admin verification' });
    }
};


const verifyIfIsBanned = async (req,res,next)=>{
    try {
        const user = req.user

        if (!user) {
            return res.status(403).json({ message: 'User not authenticated' });
        }

        if (!user || user.isBanned) {
            return res.status(403).json({ message: 'Access denied. You have been banned.' });
        }

        next()

    } catch (error) {
    
            console.error('Error in veirifyIfIsBanned middleware:', error.message);
        
        res.status(500).json({ message: 'Server error during  verification' });
    }
}

const generateUserAccessToken = async (data) => {   
    return jwt.sign({ id: data.user_id, username: data.name }, process.env.USER_ACCESS_TOKEN,{expiresIn:"24h"})
}
const generateUserRefreshToken = async (data) => {
    return jwt.sign({ id: data.user_id, username: data.name }, process.env.USER_REFRESH_TOKEN, {expiresIn: "30d"})
}
module.exports = {
    verifyTokenWithCookies,
    verifyTokenWithHeaders,
    generateUserAccessToken,
    generateUserRefreshToken,
    verifyAdminMiddleWare,
    verifyIfIsBanned,
}