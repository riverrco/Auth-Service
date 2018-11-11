import handlers from '../index';

describe('Route Handlers', () => {
  const reqMock = {
    body: {
      name: 'test', 
      surname:'test',
      password: 'test',
      email: 'test@test.com'
    },
    params: {
      token: 'testtoken'
    },
    headers: {
      authorization: 'testtoken'
    }
  };

  const resMock = {
    json: (arg) => ({...arg}),
    status: () => ({
      json: (args) => ({...args})
    }) 
  }


  test('Should return error if user contains Error', async() => {
    const mock = {signUp: () => ({error: 'Error occured'})};
    const handler = handlers(mock);
    expect(await handler.signup(reqMock, resMock)).toEqual({error: 'Error occured'})
  })

  test('Should return user info if there is no error', async() => {
    const mock = {signUp: () => ({name: 'test', surname:'test'})};
    const handler = handlers(mock);
    expect(await handler.signup(reqMock, resMock)).toEqual({name: 'test', surname:'test'})
  })

  test('Should login and return the the details auth.login provide', async() => {
    const mock = {login: () => ({name: 'test', surname:'test'})};
    const handler = handlers(mock);
    expect(await handler.login(reqMock, resMock)).toEqual({name: 'test', surname:'test'})
  })

  test('Should return forget password details depends on email', async() => {
    const mock = {forgetPassword: () => (true)};
    const handler = handlers(mock);
    expect(await handler.forgetPassword(reqMock, resMock)).toEqual({status:true})
  })

  test('Should return Invalid status if token is invalid on verifyRecoveryCode', async() => {
    const mock = {verifyRecoveryCode: () => ({isValid: false})};
    const handler = handlers(mock);
    expect(await handler.verifyRecoveryCode(reqMock, resMock)).toEqual({status: 'Invalid'})
  })

  test('Should return error when error occured on change password', async() => {
    const mock = {
      verifyRecoveryCode: () => ({isValid: true , data: {id: 1}}),
      changePassword: () => ({status: 'failed'})
  };
    const handler = handlers(mock);
    expect(await handler.verifyRecoveryCode(reqMock, resMock)).toEqual({status: 'Error occured while change password'})
  })

  test('Should return token status if everything is ok', async() => {
    const mock = {
      verifyRecoveryCode: () => ({isValid: true , data: {id: 1}}),
      changePassword: () => ({status: 'success'}),
      deleteRecoveryCode: () => {}
  };
    const handler = handlers(mock);
    expect(await handler.verifyRecoveryCode(reqMock, resMock)).toEqual({isValid: true , data: {id: 1}})
  })

  test('Should return status failed when logout failed', async() => {
    const mock = {
      logout: () => false
    };
    const handler = handlers(mock);
    expect(await handler.logout(reqMock, resMock)).toEqual({status: 'failed'})
  })

  test('Should return status success when logout sucess', async() => {
    const mock = {
      logout: () => true
    };
    const handler = handlers(mock);
    expect(await handler.logout(reqMock, resMock)).toEqual({status: 'success'})
  })
})