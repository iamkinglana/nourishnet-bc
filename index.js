// server/index.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import clientRoutes from './routes/client.routes.js'
import nutritionistRoutes from './routes/nutritionist.routes.js'
import prisma from './models/prisma.js'
import publicRoutes from './routes/public.routes.js'


dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/client', clientRoutes)
app.use('/api/nutritionist', nutritionistRoutes)
app.use('/api', publicRoutes)

app.get('/', (req, res) => res.send('NourishNet API is running'))

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`)
})
