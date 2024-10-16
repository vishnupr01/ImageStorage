import express, { NextFunction, Request, Response }  from 'express'
import userRouter  from '../routes/userRoutes'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'



const app=express()
dotenv.config()
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({extended:true}))
const allowOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: allowOrigins,
  optionsSuccessStatus: 200,
  credentials: true,
}));
app.use(cookieParser())


app.use('/api',userRouter)



app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error('error not found') as any
  error.statusCode = 401
  console.log(error);
  next(error)

})
export default app