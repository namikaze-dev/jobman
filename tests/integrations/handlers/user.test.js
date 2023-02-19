const request = require('supertest');
const appFactory = require('../../../app');
const userModel = require('../../../models/mocks/user');

const env = {
    models: {
        users: userModel
    }
}

const app = appFactory(env);

describe('POST /signup', () => {

    it('should respond with status UNPROCESSABLE ENTITY for empty input body', () => {
        return request(app)
            .post('/signup')
            .set('Content-Type', 'aplication/json')
            .then(resp => {
                expect(resp.statusCode).toBe(422);
                expect(resp.header['content-type']).toMatch(/json/);
            })
    })

    it('should respond with status UNPROCESSABLE ENTITY for incomplete input body', () => {
        return request(app)
            .post('/signup')
            .set('Content-Type', 'aplication/json')
            .send({
                email: "test@email.com",
                name: "test"
            })
            .then(resp => {
                expect(resp.statusCode).toBe(422);
                expect(resp.header['content-type']).toMatch(/json/);
            })
    })

    it('should respond with status UNPROCESSABLE ENTITY for invalid email', () => {
        return request(app)
            .post('/signup')
            .set('Content-Type', 'aplication/json')
            .send({
                email: "test-email.com",
                name: "test",
                password: "password"
            })
            .then(resp => {
                expect(resp.statusCode).toBe(422);
                expect(resp.header['content-type']).toMatch(/json/);
            })
    })

    it('should respond with status UNPROCESSABLE ENTITY for invalid password', () => {
        return request(app)
            .post('/signup')
            .set('Content-Type', 'aplication/json')
            .send({
                email: "test-email.com",
                name: "test",
                password: "pass"
            })
            .then(resp => {
                expect(resp.statusCode).toBe(422);
                expect(resp.header['content-type']).toMatch(/json/);
            })
    })

    it('should respond with status CREATED for valid input', () => {
        return request(app)
            .post('/signup')
            .send({
                email: "test@email.com",
                name: "test",
                password: "password"
            })
            .then(resp => {
                expect(resp.statusCode).toBe(201);
                expect(resp.header['content-type']).toMatch(/json/);
                console.log(resp.body);
                expect(resp.body).toEqual(
                    expect.objectContaining({
                        id: expect.any(Number),
                        name: "test",
                        email: "test@gmail.com",
                        activated: false,
                        created_at: expect.any(String),
                    })
                )
            })
    })
})