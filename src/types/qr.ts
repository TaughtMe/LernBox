// src/types/qr.ts
import { z } from 'zod'

/**
 * QrCardPayload
 * - versioniert (v)
 * - klar identifizierbar (app, type)
 * - HTML-Inhalte getrennt (questionHtml, answerHtml)
 */
export const QrCardPayloadSchema = z.object({
  app: z.literal('LernBox'),
  v: z.literal(1),
  type: z.literal('card'),
  questionHtml: z.string(),
  answerHtml: z.string(),
  meta: z
    .object({
      createdAt: z.string().datetime().optional(),
    })
    .optional(),
})

// ▼▼▼ Neu: Batch-Payload für mehrere Karten ▼▼▼
export const QrCardBatchItemSchema = z.object({
  questionHtml: z.string(),
  answerHtml: z.string(),
})

export const QrCardBatchPayloadSchema = z.object({
  app: z.literal('LernBox'),
  v: z.literal(1),
  type: z.literal('card_batch'),
  items: z.array(QrCardBatchItemSchema).min(1),
  meta: z
    .object({
      createdAt: z.string().datetime().optional(),
      count: z.number().int().positive().optional(),
    })
    .optional(),
})

export type QrCardBatchItem = z.infer<typeof QrCardBatchItemSchema>
export type QrCardBatchPayload = z.infer<typeof QrCardBatchPayloadSchema>
export type QrCardPayload = z.infer<typeof QrCardPayloadSchema>
