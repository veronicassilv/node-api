import { InvalidParamError, ServerError, MissingParamError } from "../../errors";
import { EmailValidator, AddAccount, AccountModel, AddAccountModel } from "./signup-protocols"
import { SignUpController } from "./signup";

interface SutTypes {
    sut: SignUpController,
    emailValidatorStub: EmailValidator, 
    addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        add(account: AddAccountModel): AccountModel {
           const fakeAccountModel = {
                id: 'valid_id',
                name: 'Teste',
                email: 'teste@gmail.com',
                password: 'teste@123'
           }
           return fakeAccountModel
        }
    }
    return new AddAccountStub()
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub)
    return {
        sut,
        emailValidatorStub,
        addAccountStub
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

    test('Should return 400 if no passwordConfirmation fails', () => {
        const { sut  } = makeSut()
        const httpRequest = {
            body: {
                name: 'Teste',
                email: 'teste@gmail.com',
                password: 'teste@123',
                passwordConfirmation: 'teste2'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
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
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
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

    test('Should call AddAccount with the correct values', () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        const httpRequest = {
            body: {
                name: 'Teste',
                email: 'teste_invalid@gmial.com',
                password: 'teste@123',
                passwordConfirmation: 'teste@123'
            }
        }
        sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'Teste',
            email: 'teste_invalid@gmial.com',
            password: 'teste@123',
        })
        
    })

    test('Should return 500 if addAccount throws', () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
            throw new Error()
        })
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

    test('Should return 200 if a valid data is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'Teste',
                email: 'teste@gmail.com',
                password: 'teste@123',
                passwordConfirmation: 'teste@123'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual({
            id: 'valid_id',
            name: 'Teste',
            email: 'teste@gmail.com',
            password: 'teste@123'
        })
    })
})