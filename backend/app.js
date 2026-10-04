require('dotenv').config()

const express =require('express')
const app = express()
const cors =  require('cors')
const cookieParser = require('cookie-parser')

// routes
const MaterialRoute = require('./routers/Material-routes')
const AuthRoute = require('./routers/auth-routes')
const TradeRoute = require('./routers/Trade-routes')
const RequestRoute = require('./routers/Request-routes')
const TeacherRoute = require('./routers/Teacher-routes')

// db conection
const db = require('./models/index')

// listening port
const PORT = process.env.PORT || 3000

// middle wares
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:['POST','DELETE','PUT','GET','OPTIONS'],
    credentials:true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('uploads'))

// routes mounting
app.use('/uploads',express.static('uploads'))
app.use('/material', MaterialRoute)
app.use('/auth',AuthRoute)
app.use('/trade', TradeRoute )
app.use('/request', RequestRoute)
app.use('/teacher', TeacherRoute)

// test route
app.get('/',(req,res)=>{
    res.json({message:"thanks for the messages"})
})

// 404 route
app.use((req,res)=>{
   return res.status(404).json({message:'this url doesn\'t exist'})
})


app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
    
})