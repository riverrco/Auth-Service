import route from '../index';
import {Core} from '../Core';


describe('Routes', () => {
  test('Should return an function', () => {
    expect(typeof route()).toEqual('function');
  });
  test('Core should return a function', () => {
    expect(typeof Core()).toEqual('function');
  })

  test('CoreRoutes should return a function', () => {
    expect(typeof Core()).toEqual('function');
  })

})

