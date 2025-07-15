import prisma from '../models/prisma.js'

// GET /nutritionist/meal-plans
export const getMealPlans = async (req, res) => {
  const plans = await prisma.mealPlan.findMany({
    where: { createdById: req.user.id },
    orderBy: { weekStart: 'desc' }
  })

  res.status(200).json({ plans })
}

// POST /nutritionist/meal-plans
export const createMealPlan = async (req, res) => {
  const { weekStart, meals, isTemplate } = req.body

  const plan = await prisma.mealPlan.create({
    data: {
      createdById: req.user.id,
      weekStart: new Date(weekStart),
      meals,
      isTemplate: !!isTemplate
    }
  })

  res.status(201).json({ message: 'Meal plan created', plan })
}

// PUT /nutritionist/meal-plans/:id
export const updateMealPlan = async (req, res) => {
  const { id } = req.params
  const { meals } = req.body

  const updated = await prisma.mealPlan.updateMany({
    where: { id: Number(id), createdById: req.user.id },
    data: { meals }
  })

  if (updated.count === 0) return res.status(404).json({ message: 'Meal plan not found or unauthorized' })

  res.status(200).json({ message: 'Meal plan updated' })
}

// DELETE /nutritionist/meal-plans/:id
export const deleteMealPlan = async (req, res) => {
  const { id } = req.params

  const deleted = await prisma.mealPlan.deleteMany({
    where: { id: Number(id), createdById: req.user.id }
  })

  if (deleted.count === 0) return res.status(404).json({ message: 'Meal plan not found or unauthorized' })

  res.status(200).json({ message: 'Meal plan deleted' })
}

// POST /nutritionist/meal-plans/:id/assign
export const assignMealPlan = async (req, res) => {
  const { id } = req.params
  const { clientId } = req.body

  const mealPlan = await prisma.mealPlan.update({
    where: { id: Number(id) },
    data: { userId: clientId }
  })

  res.status(200).json({ message: 'Meal plan assigned to client', mealPlan })
}
