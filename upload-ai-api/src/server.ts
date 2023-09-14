import "dotenv/config"

import { fastify } from 'fastify'
import { fastifyCors } from "@fastify/cors"

import { getAllPromptsRoute } from './routes/get-all-prompts-route'
import { uploadVideoRoute } from './routes/upload-video-route'
import { createTranscriptionRoute } from './routes/create-transcription-route'
import { generateAiCompletionRoute } from "./routes/generate-ai-completion-route"

const app = fastify()

app.register(fastifyCors, {
  origin: '*'
})

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(generateAiCompletionRoute)

app.listen({
  port: 3333
}).then(() => {
  console.log('HTTP Server Running!')
})