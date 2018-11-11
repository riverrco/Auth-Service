import {Token as TokenService} from '../TokenService';


describe('Token Service', () => {
  const token = new TokenService({id:23});
  const accessToken = token.accessToken 
  test('Create Token', () => {
    expect(accessToken.length > 10).toBe(true);
  });
  test('Return Token Info If Valid', async() => {
    new TokenService({token: accessToken})
    const {isValid} = await token.isValid()
    expect(isValid).toBe(true)
  });
  test('Return false if token is invalid', async () => {
    const mytoken = 'eyJhbGciOiJIUzI1NiIsI'
    const tokenservice = new TokenService({token: mytoken})
    const {isValid} = await tokenservice.isValid()
    expect(isValid).toBe(false)
  })

  test('TimeHelper Must Return Date Left', () => {
    const {exp} = TokenService.decodeToken(token.accessToken)
    const time = token._timeHelper(exp)
    expect(time.days).toEqual(29);
    expect(time.hours).toEqual(23);
    expect(time.hasOwnProperty('seconds')).toBe(true);
    expect(time.hasOwnProperty('mins')).toBe(true)
  })

  test('Get expire time', () => {
    expect(Object.keys(token.expiresIn)).toEqual(["days", "hours", "mins", "seconds", "exactDate"])
  })
})