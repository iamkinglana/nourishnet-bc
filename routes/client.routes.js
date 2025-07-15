import express from 'express'
import {
    getProfile,
    updateProfile,
    submitIntakeForm,
    getIntakeForm,
    //   Client stuff
    getMealPlans,
    getMealPlanById,
    getGroceryList,
    //   checkins
    submitCheckIn,
    getCheckIns,
    updateCheckIn,
    //   dahsboard
    getDashboard,
    getUpcomingMeals


} from '../controllers/client.controller.js'

import { protect } from '../middleware/auth.middleware.js'
import { authorize } from '../middleware/role.middleware.js'

const router = express.Router()

router.use(protect, authorize(['client']))

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.post('/intake-form', submitIntakeForm)
router.get('/intake-form', getIntakeForm)
// client routes
router.get('/meal-plans', getMealPlans)
router.get('/meal-plans/:id', getMealPlanById)
router.get('/meal-plans/:id/grocery-list', getGroceryList)

// Add after meal plan routes
router.post('/check-ins', submitCheckIn)
router.get('/check-ins', getCheckIns)
router.put('/check-ins/:id', updateCheckIn)
// getDashboard
router.get('/dashboard', getDashboard)
router.get('/upcoming-meals', getUpcomingMeals)

export default router
