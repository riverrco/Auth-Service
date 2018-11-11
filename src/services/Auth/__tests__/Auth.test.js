import {Auth} from '../Auth';

describe('Auth Service', () => {
  test('Should Return Fields Invalid error on SignUp ', async () => {

    const auth = new Auth();
    expect( await auth.signUp(
      {name: 't', surname: 't', email: 't'}
      ))
      .toEqual({error: 'Fields are invalid'})
  })
  
  test('Should Return Email Already Exists error on SignUp ', async () => { 
    const mock = jest.fn().mockImplementation(() => ({
      addUser:  () => ({error: 'Email Already Exists'})
    }));

    const auth = new Auth({userService: mock()});
    expect(await auth.signUp(
      {name: 't', surname: 't', email: 't', password: 't'}
      ))
      .toEqual({error: 'Email Already Exists'})
  });

  test('Should Return user and token after success on SignUp ', async () => { 
    const mock = jest.fn().mockImplementation(() => ({
      addUser:  () => ({name: 'test', id: 5}),
      insertToken: () => ({token: 123123})
    }));

    const auth = new Auth({userService: mock(), token: mock()});
    const result = await auth.signUp({name: 't', surname: 't', email: 't', password: 't'});
    expect(Object.keys(result)).toEqual(["user", "token"])
    expect(result.token.token).toEqual(123123);
    expect(result.user).toEqual({"id": 5, "name": "test"})
  });

  test('Should return Invalid Credentials if user does not exists on Login', async() => {
    const mock = () => ({findUser: () => []});
    const auth = new Auth({userService: mock()});
    expect(await auth.login({email: 'test@test.com', password: '2123'}))
      .toEqual({error: 'Invalid Credentials'})
  })

  test('Should return Invalid Credentials when user enters invalid password on Login', async() => {
    const mock = () => ({
      findUser: () => [{id: 1, name: 'test', email: 'test@test.com', surname: 'test'}],
      comparePassword: () => false
    });
    const auth = new Auth({userService: mock(), auth: mock()});
    expect(await auth.login({email: 'test@test.com', password: '2123'}))
      .toEqual({error: 'Invalid Credentials'})
  });

  test('Should  returns user and access token on Login', async() => {
    const mock = () => ({
      findUser: () => [{id: 1, name: 'test', email: 'test@test.com', surname: 'test'}],
      comparePassword: () => true,
      insertToken: () => ({token: 123123})
    });
    const auth = new Auth({userService: mock(), auth: mock(), token: mock()});
    const login = await auth.login({email: 'test@test.com', password: '2123'});
    expect(login.token.token).toEqual(123123);
    expect(Object.keys(login.user)).toEqual(['id', 'name', 'surname', 'email']);
  })

  test('Should return facebook authenticate and authCB function', () => {
    const auth = new Auth();
    expect(typeof auth.loginWithOAuth('facebook')).toBe('object');
    Object.values(auth.loginWithOAuth('facebook')).forEach(i => (
      expect(typeof i).toBe('function')
    ))
    expect(Object.keys(auth.loginWithOAuth('facebook')))
      .toEqual(['authenticate', 'authCB'])
  })

  test('Should return google authenticate and authCB function', () => {
    const auth = new Auth();
    expect(typeof auth.loginWithOAuth('google')).toBe('object');
    Object.values(auth.loginWithOAuth('google')).forEach(i => (
      expect(typeof i).toBe('function')
    ))
    expect(Object.keys(auth.loginWithOAuth('google')))
      .toEqual(['authenticate', 'authCB'])
  })

  test('Should return github authenticate and authCB function', () => {
    const auth = new Auth();
    expect(typeof auth.loginWithOAuth('github')).toBe('object');
    Object.values(auth.loginWithOAuth('github')).forEach(i => (
      expect(typeof i).toBe('function')
    ))
    expect(Object.keys(auth.loginWithOAuth('github')))
      .toEqual(['authenticate', 'authCB'])
  })

  test('Should return false when user does not exists on forgerPassword', async() => {
    const mock = () => ({findUser: () => []});
    const auth = new Auth({userService: mock()});
    expect(await auth.forgetPassword({email: 'test@test.com'}))
      .toBe(false)
  })

  test('Should return false when fails to write token to db on forgerPassword', async() => {
    const mock = () => ({
      findUser: () => [{name: 'dummy user', id: 1}],
      updateUser: () => 0
    });
    const auth = new Auth({userService: mock(), user: mock()});
    expect(await auth.forgetPassword({email: 'test@test.com'}))
      .toBe(false)
  })

  test('Should return true when user does exists forgerPassword', async() => {
    const mock = () => ({
      findUser: () => [{name: 'dummy user', id: 1}],
      updateUser: () => 1
    });
    const auth = new Auth({userService: mock(), user: mock()});
    expect(await auth.forgetPassword({email: 'test@test.com'}))
      .toBe(true)
  })

  test('Should return isValid to false when user does not exists on verifyRecoveryCode', async() => {
    const mock = () => ({
      findUser: () => [],
    });
    const auth = new Auth({userService: mock()});
    expect(await auth.verifyRecoveryCode(1,'test@test.com'))
      .toEqual({isValid:false})
  })

  test('Should return isValid to false when user enters invalid verification code on verifyRecoveryCode', async() => {
    const mock = () => ({
      findUser: () => [{recoveryCode: 1}],
    });
    const auth = new Auth({userService: mock()});
    expect(await auth.verifyRecoveryCode(1,'test@test.com'))
    .toEqual({isValid:false})
  })

  test('Should return isValid to false when user enters expired verification code on verifyRecoveryCode', async() => {
    const code = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkhhbGlsIiwidHlwZSI6InVzZXIiLCJpYXQiOjE1Mzg3MDA5NTUsImV4cCI6MTUzODcwMDk1Nn0.JTKvXJpZz8pbtw4n_ExBEVfQXBlYINzpuoRlPLPuGiU';
    const mock = () => ({
      findUser: () => [{recoveryCode: code}],
    });
    const auth = new Auth({userService: mock()});
    expect(await auth.verifyRecoveryCode(code ,'test@test.com'))
    .toEqual({isValid:false})
  })

  test('Should return valid when user enters valid verification code on verifyRecoveryCode', async() => {
    const code = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkhhbGlsIiwidHlwZSI6InVzZXIiLCJpYXQiOjE1Mzg3MDEzMzYsImV4cCI6NjI3MjM0MTMzNn0.riVnAcbncw1k0aR6P3nYu8-5MKK9-gf970n0Jl8GfjA';
    const mock = () => ({
      findUser: () => [{recoveryCode: code}],
    });
    const auth = new Auth({userService: mock()});
    expect(await auth.verifyRecoveryCode(code ,'test@test.com'))
    .toEqual({"data": {"exp": 6272341336, "iat": 1538701336, "id": 1, "name": "Halil", "type": "user"}, "isValid": true})
  })

  test('Should return status fail when password update fails on changePassword', async() => {
    const mock = () => ({
      updateUser: () => 0
    })
    const auth = new Auth({user: mock()});
    expect(await auth.changePassword({id: 1, password: '123'}))
      .toEqual({status: 'failed'})
  })

  test('Should return status success when password update success on changePassword', async() => {
    const mock = () => ({
      updateUser: () => 1
    })
    const auth = new Auth({user: mock()});
    expect(await auth.changePassword({id: 1, password: '123'}))
      .toEqual({status: 'success'})
  })

  test('Should return  success when recovery code successfuly deletes from db on deleteRecoveryCode', async() => {
    const mock = () => ({
      updateUser: () => 1
    })
    const auth = new Auth({user: mock()});
    expect(await auth.deleteRecoveryCode({id: 1}))
      .toEqual({process: 'success'})
  })

  test('Should return  fail when recovery code cant deleted from db on deleteRecoveryCode', async() => {
    const mock = () => ({
      updateUser: () => 0
    })
    const auth = new Auth({user: mock()});
    expect(await auth.deleteRecoveryCode({id: 1}))
      .toEqual({process: 'failed'})
  })

  test('Should return false if token does not exists on logout', async() => {
    const mock = () => ({
      deleteToken: () => 0
    })

    const auth = new Auth({token: mock()});

    expect(await auth.logout('123')).toBe(false);
  })

  test('Should return true if token does exists on logout after deleting', async() => {
    const mock = () => ({
      deleteToken: () => 1
    })

    const auth = new Auth({token: mock()});

    expect(await auth.logout('123')).toBe(true);
  })
})