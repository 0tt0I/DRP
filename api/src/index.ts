import express from 'express'
import cors from 'cors'
import { join as pathJoin } from 'path'
import {
  json as bodyParserJson,
  urlencoded as bodyParserUrlEncoded
} from 'body-parser'

import { router } from './routes'

// TODO: Replace with environment config
const port = 3080

const app = express()
app.use(express.static(pathJoin(__dirname, '../../app/out')))
app.use(cors())
app.use(bodyParserJson())
app.use(bodyParserUrlEncoded({ extended: true }))

app.use('/api', router)

app.get('/', (_req, res) => {
  res.sendFile(pathJoin(__dirname, '../app/out/index.html'))
})

app.listen(port, () => console.log(`Listening on port ${port}`))
