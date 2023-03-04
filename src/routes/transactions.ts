import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async (req, reply) => {
    const transactions = await knex('transactions').select()

    return transactions
  })

  app.post('/', async (req, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(req.body)

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    reply.status(201).send()
  })

  app.get('/:id', async (req, reply) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(req.params)
    const transaction = await knex('transactions').where('id', id).first()

    return { transaction }
  })

  app.get('/summary', async (req, reply) => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })
}
