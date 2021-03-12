/**
 * ln:43 to add new entities ex : [User, Post...]
 * ln:37 add your database type
 */
import dotenv from 'dotenv'
import { createConnection, Connection } from 'typeorm'
import { addUser } from '../fixtures/insert.users'
import { PrismaClient } from '@prisma/client'


export default class Database {
	private static _instance: Database | null = null
	private _connection: Connection | null = null

	private constructor() { }

	public static getInstance(): Database {
		if (!Database._instance) {
			Database._instance = new Database()
		}

		return Database._instance
	}

	public async authenticate() {
		dotenv.config()

		const founded = (process.env.DATABASE_URL as string).match(/^(postgres):\/\/(.*):(.*)@(.*):(\d+)\/(.*)$/)

		if (!founded) {
			throw new Error('[ERROR] Please check your DATABASE_URL value')
		}

		const [, , username, password, host, port, database] = founded

		const prisma = new PrismaClient()

		async function main() {
			const user = await prisma.user.create({
				data: {
					email: 'test@test.com',
					encryptedPassword: 'test',
					firstname: 'Esteban',
					lastname: 'Mestrie',
					birthdate: '30/11/1999',
					gender: 'homme',
				}
			})
			console.log(user);
			
		}

		main()
			.catch(e => {
				throw e
			})
			.finally(async () => {
				await prisma.$disconnect()
			})

	}
}
