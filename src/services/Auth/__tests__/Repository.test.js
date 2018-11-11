import repo from '../Repository';

describe('Auth Repository', () => {
  
  test('Should hash the password', async() => {
    const hash = await repo.hashPassword('123')
    expect(hash.length > 10).toBe(true);
  });

  test('Should return true when passwords are equal', async() => {
    const hash = await repo.hashPassword('12345');
    const result = await repo.comparePassword('12345', hash);
    expect(result).toBe(true);
  });

  test('Should return false when passwords are not equal', async() => {
    const hash = await repo.hashPassword('12345');
    const result = await repo.comparePassword('123456', hash);
    expect(result).toBe(false);
  });

  test('Should return true when every value in object truthy', () => {
    const testObj = {test: 1, test2:2, test3:3, test4: 'test' }
    expect(repo.fieldControl(testObj)).toBe(true)
  })

  test('Should return false when one or more object falsy', () => {
    const testObj = {test: 1, test2:2, test3:undefined, test4: undefined }
    expect(repo.fieldControl(testObj)).toBe(false)
  })
})