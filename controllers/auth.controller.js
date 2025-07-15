import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../models/prisma.js'
import crypto from 'crypto'
import { sendEmail } from '../utils/mailer.js' // you’ll create this

const createToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) return res.status(400).json({ message: 'Email already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    })

    const token = createToken(user)
    res.status(201).json({ user: { id: user.id, name: user.name, role: user.role }, token })
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' })

    const token = createToken(user)
    res.status(200).json({ user: { id: user.id, name: user.name, role: user.role }, token })
  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
}

export const me = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true }
  })
  res.status(200).json({ user })
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(404).json({ message: 'User not found' })

  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 1000 * 60 * 10) // 10 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      resetExpires: expires
    }
  })

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`
  await sendEmail(user.email, 'Password Reset', `Reset your password: ${resetLink}`)

  res.status(200).json({ message: 'Password reset link sent' })
}

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetExpires: { gt: new Date() }
    }
  })

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' })

  const hashed = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetToken: null,
      resetExpires: null
    }
  })

  res.status(200).json({ message: 'Password reset successful' })
}
