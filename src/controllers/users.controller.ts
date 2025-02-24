import { Handler } from 'express'
import { PrismaClient } from '@prisma/client'
import { uuid } from 'uuidv4'

export const prisma = new PrismaClient()

/* export const getUser: Handler = (req, res) => {
    const data = getConnection().get("users").value()
    res.send(res.json(data))
} */

export const postUser: Handler = async(req, res) => {
    const { name } = req.body
    //const newUser = { name, id: uuid() }
    try{
        await prisma.user.create
        (
            {
                data: {
                    name
                }
            }
        )
        res.send(await prisma.user.findMany())
    } catch(error) {
        res.status(500).send(error)
    }
}

export const getUsers: Handler = async(req, res) => {
    const allUsers = await prisma.user.findMany()
    res.send(allUsers)
}
  
/* getUser()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    }) */