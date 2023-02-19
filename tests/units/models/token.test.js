const { generateToken, TokenModel } = require('../../../models/token');

describe('generateToken', () => {

    it('should generate a new token', () => {
        const exp = new Date();
        exp.setHours(exp.getHours() + 2);

        const token = generateToken(1, exp, 'activation');
        expect(token).toBeDefined();
        expect(token).toMatchObject({
                plain: expect.any(String),
                hash: expect.any(Buffer),
                type: 'activation',
                expiry: exp
            })
    })

})