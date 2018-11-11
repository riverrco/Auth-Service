import Redis from '../connectors/redis';
import AuthService from '../services/Auth';
import chalk from 'chalk'

const sub = new Redis();
const auth = new AuthService();

const subscribe = () => {
  sub.asyncsubscribe('token', auth.verifyToken);
}

export default subscribe;