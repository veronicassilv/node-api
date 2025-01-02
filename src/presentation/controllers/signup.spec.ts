import { InvalidParamError, ServerError, MissingParamError } from "../errors";
import { EmailValidator } from "../protocols";
import { SignUpController } from "./signup";

interface SutTypes {
    sut: SignUpController,
    emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeEmailValidatorWithError = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            throw new Error()
        }
    }
    return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new SignUpController(emailValidatorStub)
    return {
        sut,
        emailValidatorStub
    }
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', () => {
        const { sut  } = makeSut()
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
        const { sut  } = makeSut()
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
        const { sut  } = makeSut()
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
        const { sut  } = makeSut()
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

    test('Should return 400 if a invalid email is provided', () => {
        const { sut, emailValidatorStub } = makeSut()
        const httpRequest = {
            body: {
                name: 'Teste',
                email: 'teste_invalid@gmial.com',
                password: 'teste@123',
                passwordConfirmation: 'teste@123'
            }
        }
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('Should call EmailValidator with the correct email', () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = {
            body: {
                name: 'Teste',
                email: 'teste_invalid@gmial.com',
                password: 'teste@123',
                passwordConfirmation: 'teste@123'
            }
        }
        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
        
    })

    test('Should return 500 if EmailValidator throws', () => {
        const emailValidatorStub = makeEmailValidatorWithError()
        const sut = new SignUpController(emailValidatorStub)
        const httpRequest = {
            body: {
                name: 'Teste',
                email: 'teste_invalid@gmial.com',
                password: 'teste@123',
                passwordConfirmation: 'teste@123'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })
})