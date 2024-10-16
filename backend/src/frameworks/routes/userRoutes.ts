import express, { Request, Response, NextFunction } from 'express'
import { UserController } from '../../controllers/userController'
import { CloudinaryService } from '../utils/cloudinary'
import { authMiddleware } from '../middleware/authmiddleware'

const cloudinaryService = new CloudinaryService()
const userController = new UserController(cloudinaryService)
const router = express.Router()

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  userController.signup(req, res, next)
})
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  userController.login(req, res, next)
})
router.post('/saveImage', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  userController.saveImage(req, res, next)
})
router.get('/getImages', authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
  userController.getUserImages(req, res, next)
})

router.patch('/updateImages',authMiddleware,(req:Request,res:Response,next:NextFunction)=>{
  userController.updateImages(req,res,next)
})

router.patch('/imageUpdate',authMiddleware,(req:Request,res:Response,next:NextFunction)=>{
  userController.updateImage(req,res,next)
})

router.patch('/deleteImage',authMiddleware,(req:Request,res:Response,next:NextFunction)=>{
  userController.deleteImage(req,res,next)
})

export default router