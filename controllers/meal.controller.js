import prisma from '../models/prisma.js'

// GET /nutritionist/meals
export const getMeals = async (req, res) => {
  const meals = await prisma.meal.findMany({
    where: { createdById: req.user.id }
  })

  res.status(200).json({ meals })
}

// POST /nutritionist/meals
export const createMeal = async (req, res) => {
  const { name, description, ingredients, calories, macros, isPublic } = req.body

  const meal = await prisma.meal.create({
    data: {
      name,
      description,
      ingredients,
      calories,
      macros,
      isPublic,
      createdById: req.user.id
    }
  })

  res.status(201).json({ message: 'Meal created', meal })
}

// PUT /nutritionist/meals/:id
export const updateMeal = async (req, res) => {
  const { id } = req.params
  const { name, description, ingredients, calories, macros, isPublic } = req.body

  const meal = await prisma.meal.updateMany({
    where: {
      id: Number(id),
      createdById: req.user.id
    },
    data: {
      name,
      description,
      ingredients,
      calories,
      macros,
      isPublic
    }
  })

  if (meal.count === 0) return res.status(404).json({ message: 'Meal not found or unauthorized' })

  res.status(200).json({ message: 'Meal updated' })
}

// DELETE /nutritionist/meals/:id
export const deleteMeal = async (req, res) => {
  const { id } = req.params

  const deleted = await prisma.meal.deleteMany({
    where: {
      id: Number(id),
      createdById: req.user.id
    }
  })

  if (deleted.count === 0) return res.status(404).json({ message: 'Meal not found or unauthorized' })

  res.status(200).json({ message: 'Meal deleted' })
}

// GET /meals/public
export const getPublicMeals = async (req, res) => {
  const meals = await prisma.meal.findMany({
    where: { isPublic: true }
  })

  res.status(200).json({ meals })
}
