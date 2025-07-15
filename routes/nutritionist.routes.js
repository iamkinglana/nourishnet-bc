import express from 'express'
import {
  getAllClients,
  getClientDetails,
  getClientNotes,
  addClientNote,
  getNutritionistDashboard, // ← Add this
  getNutritionistProfile
} from '../controllers/nutritionist.controller.js'

import { protect } from '../middleware/auth.middleware.js'
import { authorize } from '../middleware/role.middleware.js'

const router = express.Router()

router.use(protect, authorize(['nutritionist']))

// Dashboard route
router.get('/dashboard', getNutritionistDashboard)
router.get('/profile', getNutritionistProfile)

router.get('/clients', getAllClients)
router.get('/clients/:id', getClientDetails)
router.get('/clients/:id/notes', getClientNotes)
router.post('/clients/:id/notes', addClientNote)

import {
  getMeals,
  createMeal,
  updateMeal,
  deleteMeal
} from '../controllers/meal.controller.js'

router.get('/meals', getMeals)
router.post('/meals', createMeal)
router.put('/meals/:id', updateMeal)
router.delete('/meals/:id', deleteMeal)

import {
  getMealPlans,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  assignMealPlan
} from '../controllers/mealplan.controller.js'

router.get('/meal-plans', getMealPlans)
router.post('/meal-plans', createMealPlan)
router.put('/meal-plans/:id', updateMealPlan)
router.delete('/meal-plans/:id', deleteMealPlan)
router.post('/meal-plans/:id/assign', assignMealPlan)

export default router
