import randomString from '../randomString';

test('Create random string with the lenght of 30', () => {
  expect(randomString(30).length).toEqual(30);
})