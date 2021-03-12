import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


import { CREATED } from '../core/constants/api'


class UserController {
	static async getUser(req: Request, res: Response) {
		try {
			const { uuid } = req.params
			const user = await prisma.user.findUnique({
				where: {
					id: uuid
				}
			})
			return res.status(CREATED.status).json(user)
		} catch (err) {
			return res.send(err)
		}
	}
	static async updateUser(req: Request, res: Response) {
		const { uuid } = req.params
		const { firstname, lastname, email, encryptedPassword } = req.body

		const user = await prisma.user.update({
			where: {
				id: uuid,
			},
			data: {
				firstname,
				lastname,
				email,
				encryptedPassword
			}
		})

		try {
			res.status(CREATED.status).json('User modified')
		} catch (err) {
			return res.send(err)
		}

	}
	//   static async deleteUser(req: Request, res: Response) {
	//     const { uuid } = req.params
	//     const user = await User.findOne({ id: uuid })
	//     if (user) {
	//       try {
	//         await user.remove()
	//         return res.status(CREATED.status).json('User is remove')
	//       } catch (err) {
	//         return res.send(err)
	//       }
	//     } else {
	//       return res.send('User not existing')
	//     }
	//   }
}

export default UserController
