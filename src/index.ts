import express, { Express } from "express"

import cors from 'cors'
import morgan from "morgan"
import dotenv from 'dotenv'

import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { swaggerOptions } from "./swaggerOptions";

import userRouter from "./routes/users.routes";

const app: Express = express()
const port = process.env.PORT || 3001

dotenv.config({ path: './.env'})

app.set("port", process.env.PORT || 3001)

/** middlewares **/
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.disable('x-powered-by')

const swaggerDocs = swaggerJsDoc(swaggerOptions)

app.use(userRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

