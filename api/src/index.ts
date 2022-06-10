import express from 'express'
import cors from 'cors'
import { join as pathJoin } from 'path'

// TODO: Replace with environment config
const port = 3080

const app = express()
app.use(express.static(pathJoin(__dirname, '../../app/out')))
app.use(cors())

app.get('/api', (_req, res) => {
  console.log('Received request. ')
  res.status(200).json({ name: 'Otto' })
})

app.get('/', (_req, res) => {
  res.sendFile(pathJoin(__dirname, '../app/out/index.html'))
})

app.listen(port, () => console.log(`Listening on port ${port}`))
