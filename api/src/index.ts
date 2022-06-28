import express from 'express'
import cors from 'cors'
import { join as pathJoin } from 'path'
import {
  json as bodyParserJson,
  urlencoded as bodyParserUrlEncoded
} from 'body-parser'

import { router } from './routes'
import { environmentConfig } from './config/config'

const app = express()
const port = environmentConfig.port

app.use(express.static(environmentConfig.appCompiledStatic))
app.use(cors())
app.use(bodyParserJson())
app.use(bodyParserUrlEncoded({ extended: true }))

app.use('/customer', (req, res) => {
  res.sendFile(pathJoin(environmentConfig.appCompiledStatic, '/customer' + req.path + '.html'))
})

app.use('/business', (req, res) => {
  res.sendFile(pathJoin(environmentConfig.appCompiledStatic, '/business' + req.path + '.html'))
})

app.get('/login', (_req, res) => {
  res.sendFile(pathJoin(environmentConfig.appCompiledStatic, '/index.html'))
})

app.get('/customer-signup', (_req, res) => {
  res.sendFile(pathJoin(environmentConfig.appCompiledStatic, '/customer-signup.html'))
})

app.get('/business-signup', (_req, res) => {
  res.sendFile(pathJoin(environmentConfig.appCompiledStatic, '/business-signup.html'))
})

app.use('/api', router)

app.get('/', (_req, res) => {
  res.sendFile(pathJoin(environmentConfig.appCompiledStatic, '/index.html'))
})

app.listen(port, () => console.log(`Listening on port ${port}`))
