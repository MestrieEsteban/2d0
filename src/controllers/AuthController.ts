import { Request, Response } from 'express'
import { isEmpty } from 'lodash'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { success } from '../core/helpers/response'
import { CREATED, OK } from '../core/constants/api'

class AuthController {
	static async signup(req: Request, res: Response): Promise<Response> {
		const fields: string[] = ['email', 'password', 'passwordConfirmation', 'firstname', 'lastname', 'birthdate', 'gender']
		try {
			const missings = fields.filter((field: string) => !req.body[field])

			if (!isEmpty(missings)) {
				const isPlural = missings.length > 1
				console.log(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
				throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
			}

			const { email, password, passwordConfirmation, firstname, lastname, birthdate, gender } = req.body

			if (password !== passwordConfirmation) {
				throw new Error("Password doesn't match")
			}
			let encryptedPassword = bcrypt.hashSync(password, 8)

			const user = await prisma.user.create({
				data: {
					email,
					encryptedPassword,
					firstname,
					lastname,
					birthdate,
					gender
				}
			})

			const payload = { id: user.id, email }
			const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)
			return res.status(CREATED.status).json({ user, token })
		} catch (errorMessage) {
			return res.send(errorMessage)
		}
	}
	static async signin(req: Request, res: Response): Promise<void> {
		const authenticate = passport.authenticate('local', { session: false }, (errorMessage, user) => {
			if (errorMessage) {
				return res.send(errorMessage)
			}

			const payload = { id: user.id, firstname: user.firstname }
			const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)

			return res.status(CREATED.status).json({ user, token })
		})
		authenticate(req, res)
	}
}

export default AuthController
