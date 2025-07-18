import express from 'express'
import { signup, login, me } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/me', protect, me)

export default router
