import express from 'express'
import { getPublicMeals } from '../controllers/meal.controller.js'

const router = express.Router()

router.get('/meals/public', getPublicMeals)

export default router
