import { Router, Request, Response } from 'express'
import passport from 'passport'

import secured from './secured/index'
import AuthController from '@/controllers/AuthController'
import TaskController from '@/controllers/TaskController'

export const argv: string[] = process.argv.slice(2)

const api = Router()

api.get('/', (req: Request, res: Response) => {
  res.json({
    hello: ' Gizmo Api',
    meta: {
      status: 'running',
      version: '1.0.0',
    },
  })
})

//Auth
api.post('/auth/signup', AuthController.signup)
api.post('/auth/signin', AuthController.signin)

api.post('/task/:uuid', TaskController.addTask)
api.get('/task/:uuid', TaskController.getTask)
api.put('/task/:taskId', TaskController.updateTask)
api.delete('/task/:taskId', TaskController.deleteTask)

//Secured api
api.use('/', passport.authenticate('jwt', { session: false }), secured)

export default api
