//@ts-check
import express from "express"
import usersRoutes from "./app/routes/users.js"
import recruitRouter from "./app/routes/recruit.js"
import recruiterRouter from "./app/routes/recruiter.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import swaggerJSDoc from "swagger-jsdoc"
import { options } from "./app/swagger.js"
import swaggerUi from 'swagger-ui-express'
import companyRouter from "./app/routes/company.js"


const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin:"http://127.0.0.1:5500",
  credentials:true,
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}))

app.use(`/api/users`, usersRoutes )
app.use(`/api/recruits`, recruitRouter)
app.use(`/api/recruiter`, recruiterRouter)
app.use('/api/companies', companyRouter);

const specs = swaggerJSDoc(options)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
app.listen(3000, ()=>{
    console.log("App running on port 3000")
})