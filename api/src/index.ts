import express from 'express'
import cors from 'cors'

// TODO: Replace with environment config
const port = 3080

const app = express()
app.use(cors())

app.get('/api', (_req, res) => {
  console.log('Received request. ')
  res.status(200).json({ name: 'Otto' })
})
app.listen(port, () => console.log(`Listening on port ${port}`))
