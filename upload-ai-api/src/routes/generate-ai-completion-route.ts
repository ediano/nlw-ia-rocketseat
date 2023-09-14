import { FastifyInstance } from "fastify";
import { z } from "zod"
import { streamToResponse, OpenAIStream } from 'ai'

import { prisma } from "../libs/prisma";
import { openai } from "../libs/openai";

export async function generateAiCompletionRoute(app: FastifyInstance) {
  app.post('/ai/complete', async (request, replay) => {
    const bodySchema = z.object({
      videoId: z.string().uuid(),
      prompt: z.string(),
      temperature: z.number().min(0).max(1).default(0.5)
    })

    const { videoId, prompt, temperature } = bodySchema.parse(request.body)

    const video = await prisma.video.findUniqueOrThrow({ where: { id: videoId } })

    if(!video.transcription){
      return replay.status(400).send({ error: 'Video transcription was not generated yet.' })
    }

    const promptMessage = prompt.replace('{transcription}', video.transcription)

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k-0613',
      temperature,
      messages: [
        { 
          role: 'user',
          content: promptMessage
        }
      ],
      stream: true
    })

    const stream = OpenAIStream(response)
    streamToResponse(stream, replay.raw, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    })
  })
}