import prisma from '../models/prisma.js'

// GET /nutritionist/clients
export const getAllClients = async (req, res) => {
  const clients = await prisma.user.findMany({
    where: { role: 'client' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  })

  res.status(200).json({ clients })
}

// GET /nutritionist/clients/:id
export const getClientDetails = async (req, res) => {
  const clientId = Number(req.params.id)

  const user = await prisma.user.findUnique({
    where: { id: clientId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      intakeForm: true,
      checkIns: {
        orderBy: { date: 'desc' },
        take: 5
      }
    }
  })

  if (!user || user.role !== 'client') {
    return res.status(404).json({ message: 'Client not found' })
  }

  res.status(200).json({ user })
}

// GET /nutritionist/clients/:id/notes
export const getClientNotes = async (req, res) => {
  const clientId = Number(req.params.id)

  const notes = await prisma.clientNote.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' }
  })

  res.status(200).json({ notes })
}

// POST /nutritionist/clients/:id/notes
export const addClientNote = async (req, res) => {
  const clientId = Number(req.params.id)
  const { note } = req.body

  const created = await prisma.clientNote.create({
    data: {
      clientId,
      nutritionistId: req.user.id,
      note
    }
  })

  res.status(201).json({ message: 'Note added', note: created })
}

// GET /nutritionist/dashboard
export const getNutritionistDashboard = async (req, res) => {
  try {
    const nutritionistId = req.user.id

    // Clients who were assigned meal plans created by this nutritionist
    const clients = await prisma.user.findMany({
      where: {
        role: 'client',
        assignedMealPlans: {
          some: {
            createdById: nutritionistId
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    // Meal plan templates created by the nutritionist
    const templates = await prisma.mealPlan.findMany({
      where: {
        createdById: nutritionistId,
        isTemplate: true
      },
      select: {
        id: true,
        weekStart: true,
        meals: true,
        createdAt: true
      }
    })

    // Meals created by this nutritionist
    const meals = await prisma.meal.findMany({
      where: {
        createdById: nutritionistId
      },
      select: {
        id: true,
        name: true,
        title: true,
        calories: true,
        tags: true,
        isPublic: true
      }
    })

    res.status(200).json({
      clients,
      templates,
      meals
    })
  } catch (error) {
    console.error('[Dashboard Error]', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /nutritionist/profile
export const getNutritionistProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  })

  if (!user || user.role !== 'nutritionist') {
    return res.status(404).json({ message: 'Nutritionist not found' })
  }

  res.status(200).json({ user })
}
