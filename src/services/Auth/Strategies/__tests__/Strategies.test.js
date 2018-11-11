import {FacebookStrategy, GoogleStrategy, GithubStrategy, JWTService} from '../index';
import { Google } from '../Google';


describe('FacebookStrategy', () => {
  test('Should initialize component constructor', () => {
    const facebook = new FacebookStrategy({
      callbackUrl: '/cb/url',
      clientId: '123',
      clientSecret: 'secret',
      permissions: 'permissions',
      profileFields: 'email'
    });
    expect(facebook.callbackUrl).toEqual('/cb/url');
    expect(facebook.clientId).toEqual('123');
    expect(facebook.clientSecret).toEqual('secret');
    expect(facebook.permissions).toEqual('permissions');
    expect(facebook.profileFields).toEqual('email');
  });
});

describe('GoogleStrategy', () => {
  test('Should initialize component constructor', () => {
    const google = new GoogleStrategy({
      callbackUrl: '/cb/url',
      clientId: '123',
      clientSecret: 'secret',
    });
    expect(google.callBackUrl).toEqual('/cb/url');
    expect(google.clientId).toEqual('123');
    expect(google.clientSecret).toEqual('secret');
  });
})

describe('GithubStrategy', () => {
  test('Should initialize component constructor', () => {
    const github = new GithubStrategy({
      callbackUrl: '/cb/url',
      clientId: '123',
      clientSecret: 'secret',
    });
    expect(github.callbackUrl).toEqual('/cb/url');
    expect(github.clientId).toEqual('123');
    expect(github.clientSecret).toEqual('secret');
  });

})
