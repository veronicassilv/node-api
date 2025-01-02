import { MissingParamError } from "../errors/missing-param-error";
import { SignUpController } from "./signup";

const makeSut = (): SignUpController => {
    return new SignUpController()
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', () => {
        const sut = makeSut()
        const httpRequest = {
            body: {
                email: 'teste@gmail.com',
                password: 'teste@123',
                passwordConfirmation: 'teste@123'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is provided', () => {
        const sut = makeSut()
        const httpRequest = {
            body: {
                name: 'Teste',
                password: 'teste@123',
                passwordConfirmation: 'teste@123'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provided', () => {
        const sut = new SignUpController()
        const httpRequest = {
            body: {
                name: 'Teste',
                email: 'teste@gmail.com',
                passwordConfirmation: 'teste@123'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 400 if no password is provided', () => {
        const sut = new SignUpController()
        const httpRequest = {
            body: {
                name: 'Teste',
                email: 'teste@gmail.com',
                password: 'teste@123'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })
})