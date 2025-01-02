import { SignUpController } from "./signup";

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                email: 'teste@gmail.com',
                password: 'teste@123',
                passwordConfirmation: 'teste@123'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new Error('Missing param: name'))
    })

    test('Should return 400 if no emial is provided', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                name: 'Teste',
                password: 'teste@123',
                passwordConfirmation: 'teste@123'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new Error('Missing param: email'))
    })
})