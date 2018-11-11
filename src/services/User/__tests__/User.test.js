import {User} from '../User';

describe('User Service', () => {
  test('Register user, if email does not exists', async () => {
    const user = {email: 'test@test.com', password: 'test123', name: "test"}
    const mock = (userObj) => jest.fn().mockImplementation(() => ({
      findUserByEmail: () => [],
      registerUser: () => userObj
    }))
    const userRepo = new User(mock(user)());
    const test = await userRepo.addUser(user);
    expect(test).toBe(user);
  })
  
  test('If Email Already Exists Return Email already in use', async () => {
    const userRepoMock = jest.fn().mockImplementation(() => {
      return {
        findUserByEmail: () => [{
          id: 1,
          email: 'test@test.com',
          password: 'test123',
          name: 'test',
          surname: 'mock',
          google: 123123,
          facebook: 34353,
          github: 234123,
          profilePic: '/test/url/123.jpg'
        }]
      }
    })
    const user = new User(userRepoMock());
    const test = await user.addUser({email: 'test@test.com', password: 'test123', name: "test"})
    expect(test).toEqual({error: 'Email already in use'})
  });
  
  test('findUserUpdateOrCreate should register user', async() => {
    const mock = jest.fn().mockImplementation(() => ({
      findByIdOrMail: () => [],
      registerUser: () => ({calledWith: 'testuser'}),
    }));

    const user = new User(mock());
    
    expect(await user.findUserUpdateOrCreate(
      {type: 'test', user:{calledWith: 'testuser'}}
      ))
      .toEqual({calledWith: 'testuser'})
  })

  test('findUserUpdateOrCreate should update user  when emails match return with array', async() => {
    const mock = jest.fn().mockImplementation(() => ({
      findByIdOrMail: () => [{email: 'test@test.com'}],
      updateUser: () => {}
    }));

    const user = new User(mock());
    
    expect(await user.findUserUpdateOrCreate(
      {type: 'test', user:{email: 'test@test.com'}}
      ))
      .toEqual([{email: 'test@test.com'}])
  })

  test('findUserUpdateOrCreate should fetched when emails does not match', async() => {
    const mock = jest.fn().mockImplementation(() => ({
      findByIdOrMail: () => [{email: 'test@test.com'}],
      updateUser: () => {}
    }));

    const user = new User(mock());
    
    expect(await user.findUserUpdateOrCreate(
      {type: 'test', user:{email: 'anotherMail@another.com'}}
      ))
      .toEqual([{email: 'test@test.com'}])
  })

  test('delete user should be called', async () => {

  const mock = jest.fn().mockImplementation(() => ({
    deleteRegistration: () => 'called'
    }));

    const user = new User(mock());
    expect(await user.deleteUser(2)).toEqual('called')
  });

  test('Should update the user', async () => {

    const mock = jest.fn().mockImplementation(() => ({
      updateUser: () => 'called',
      findByIdOrMail: () => ({testuser: 'test'})
      }));
  
      const user = new User(mock());
      expect(await user.editUser({id: 1})).toEqual({testuser: 'test'})
    });

  test('Should find the user by id or mail', async () => {

      const mock = jest.fn().mockImplementation(() => ({
        findByIdOrMail: () => ({testuser: 'test', email: "test@test.com"})
        }));
    
        const user = new User(mock());
        expect(await user.findUser({id: 1, email: "test@test.com"})).toEqual({testuser: 'test',email: "test@test.com" })
    });

})