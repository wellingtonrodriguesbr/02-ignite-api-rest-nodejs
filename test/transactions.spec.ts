import { it, beforeAll, afterAll, describe } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })
  
  afterAll(async () => {
    await app.close()
  })
  
  it('should be able to create a new transaction', async () => {
   const response = await request(app.server).post('/transactions').send({
      title: 'Example title',
      amount: 5000,
      type: 'credit'
    }).expect(201)
  })
})