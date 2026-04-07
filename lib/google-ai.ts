import { GoogleGenerativeAI } from '@google/generative-ai'

let _googleAI: GoogleGenerativeAI | null = null

export function getGoogleAI(): GoogleGenerativeAI {
  if (!_googleAI) {
    _googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? '')
  }
  return _googleAI
}

export const GEMMA_MODEL = process.env.GOOGLE_AI_MODEL ?? 'gemma-3-27b-it'
