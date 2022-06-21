import express from 'express'
import cors from 'cors'
import { join as pathJoin } from 'path'
import {
  json as bodyParserJson,
  urlencoded as bodyParserUrlEncoded
} from 'body-parser'

import { router } from './routes'
import { environmentConfig } from './config/config'
import cookieParser from 'cookie-parser'
import readCookie from './middleware/cookieReader'

const app = express()
const port = environmentConfig.port

app.use(express.static(environmentConfig.appCompiledStatic))
app.use(cors())
app.use(bodyParserJson())
app.use(bodyParserUrlEncoded({ extended: true }))
app.use(cookieParser())
app.use(readCookie)

app.use('/api', router)

app.get('/', (_req, res) => {
  res.sendFile(pathJoin(environmentConfig.appCompiledStatic, '/index.html'))
})

app.listen(port, () => console.log(`Listening on port ${port}`))
