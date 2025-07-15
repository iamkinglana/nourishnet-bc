import prisma from '../models/prisma.js'

// GET /client/profile
export const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  })

  res.status(200).json({ user })
}

// PUT /client/profile
export const updateProfile = async (req, res) => {
  const { name } = req.body

  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data: { name }
  })

  res.status(200).json({ message: 'Profile updated', user: updated })
}

// POST /client/intake-form
export const submitIntakeForm = async (req, res) => {
  const { goals, allergies, lifestyle, preferences } = req.body

  const existing = await prisma.intakeForm.findUnique({ where: { userId: req.user.id } })

  if (existing) {
    await prisma.intakeForm.update({
      where: { userId: req.user.id },
      data: { goals, allergies, lifestyle, preferences }
    })
  } else {
    await prisma.intakeForm.create({
      data: { userId: req.user.id, goals, allergies, lifestyle, preferences }
    })
  }

  res.status(200).json({ message: 'Intake form submitted' })
}

// GET /client/intake-form
export const getIntakeForm = async (req, res) => {
  const form = await prisma.intakeForm.findUnique({
    where: { userId: req.user.id }
  })

  if (!form) return res.status(404).json({ message: 'No intake form found' })

  res.status(200).json({ form })
}

// GET /client/meal-plans
export const getMealPlans = async (req, res) => {
  const plans = await prisma.mealPlan.findMany({
    where: { userId: req.user.id },
    orderBy: { weekStart: 'desc' }
  })

  res.status(200).json({ plans })
}

// GET /client/meal-plans/:id
export const getMealPlanById = async (req, res) => {
  const { id } = req.params

  const plan = await prisma.mealPlan.findFirst({
    where: { id: Number(id), userId: req.user.id }
  })

  if (!plan) return res.status(404).json({ message: 'Meal plan not found' })

  res.status(200).json({ plan })
}

// GET /client/meal-plans/:id/grocery-list
export const getGroceryList = async (req, res) => {
  const { id } = req.params

  const list = await prisma.groceryList.findFirst({
    where: {
      userId: req.user.id,
      mealPlanId: Number(id)
    }
  })

  if (!list) return res.status(404).json({ message: 'Grocery list not found' })

  res.status(200).json({ list })
}

// POST /client/check-ins
export const submitCheckIn = async (req, res) => {
  const { weight, mood, energy, notes, photoUrl } = req.body

  const checkIn = await prisma.checkIn.create({
    data: {
      userId: req.user.id,
      weight,
      mood,
      energy,
      notes,
      photoUrl
    }
  })

  res.status(201).json({ message: 'Check-in submitted', checkIn })
}

// GET /client/check-ins
export const getCheckIns = async (req, res) => {
  const checkIns = await prisma.checkIn.findMany({
    where: { userId: req.user.id },
    orderBy: { date: 'desc' }
  })

  res.status(200).json({ checkIns })
}

// PUT /client/check-ins/:id
export const updateCheckIn = async (req, res) => {
  const { id } = req.params
  const { weight, mood, energy, notes, photoUrl } = req.body

  const checkIn = await prisma.checkIn.updateMany({
    where: {
      id: Number(id),
      userId: req.user.id
    },
    data: { weight, mood, energy, notes, photoUrl }
  })

  if (checkIn.count === 0) return res.status(404).json({ message: 'Check-in not found or unauthorized' })

  res.status(200).json({ message: 'Check-in updated' })
}

// GET /client/dashboard
export const getDashboard = async (req, res) => {
  const [latestCheckIn] = await prisma.checkIn.findMany({
    where: { userId: req.user.id },
    orderBy: { date: 'desc' },
    take: 1
  })

  const mealPlans = await prisma.mealPlan.findMany({
    where: { userId: req.user.id },
    orderBy: { weekStart: 'desc' },
    take: 1
  })

  const groceryList = await prisma.groceryList.findFirst({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  })

  res.status(200).json({
    checkIn: latestCheckIn || null,
    currentMealPlan: mealPlans[0] || null,
    groceryList: groceryList?.items || []
  })
}

// GET /client/upcoming-meals
export const getUpcomingMeals = async (req, res) => {
  const today = new Date()
  const day = today.toLocaleDateString('en-US', { weekday: 'long' }) // e.g. Monday

  const plan = await prisma.mealPlan.findFirst({
    where: { userId: req.user.id },
    orderBy: { weekStart: 'desc' }
  })

  if (!plan) return res.status(404).json({ message: 'No meal plan found' })

  const todayMeals = plan.meals?.[day] || []

  res.status(200).json({ day, meals: todayMeals })
}
