import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


import { CREATED } from '../core/constants/api'


class TaskController {
	static async getTask(req: Request, res: Response) {
		try {
			const { uuid } = req.params
			const tasks = await prisma.task.findMany({
				where: {
					userId: uuid
				}
			})
			return res.status(CREATED.status).json(tasks)
		} catch (err) {
			return res.send(err)
		}
	}
	static async addTask(req: Request, res: Response) {
		const { uuid } = req.params
		const { content } = req.body

		const task = await prisma.task.create({
			data: {
				content,
				userId: uuid
			}
		})
		return res.status(CREATED.status).json({ task })

	}
	static async updateTask(req: Request, res: Response) {
		const { taskId } = req.params
		const { content, isComplete } = req.body

		const task = await prisma.task.update({
			where: {
				id: parseInt(taskId),
			},
			data: {
				content,
				isComplete: isComplete == 'true' ? true : false
			}
		})
		try {
			res.status(CREATED.status).json({ task })
		} catch (err) {
			return res.send(err)
		}

	}
	static async deleteTask(req: Request, res: Response) {
		const { taskId } = req.params
		const task = await prisma.task.delete({
			where: {
				id: parseInt(taskId),
			}
		})
		try {
			res.status(CREATED.status).json({task})
		} catch (err) {
			return res.send(err)
		}
	}
}

export default TaskController
