import Redis from '../index';

describe('Redis Service', () => {
  const redis = new Redis();
  test('Should succesfully instansiate the Redis Client', () => {
    const redis = new Redis({host: 'localhost', port: 2222, password: '123'});
    expect(redis.host).toEqual('localhost');
    expect(redis.port).toEqual(2222);
    expect(redis.password).toEqual("123");
    expect(typeof redis.client).toEqual('object');
  });

  test('Should return function from _client method', () => {
    expect(typeof redis._client()).toBe('object')
  });

})