const supertest = require('supertest')
const index = require('./index')

describe('POST /readDrive', () => {
    testing('should respond with a 200 status code', async() => {
        const response = await request(index).post('/getUserInfo').send({

        })
    })
})