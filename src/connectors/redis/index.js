import redis from 'redis';
import config from '../../config';

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: CHALK FOR LOGGING PURPOSE
import chalk from 'chalk';

const {REDIS_CLIENT, REDIS_PASSWORD, REDIS_PORT} = config;


class Redis { 
  constructor({host, port, password, mock} = {}) {
    this.host = host || REDIS_CLIENT;
    this.port = port || REDIS_PORT;
    this.password = password || REDIS_PASSWORD
    this.client = mock || this._client()
  }

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: INTERNAL SETUP
  _client(){
    return redis.createClient({
      host: this.host,
      port: this.port,
      auth_pass: this.password,
      retry_strategy: () => 1000
    });
  }

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: PUBLISH EVENT
  /**
   * Takes channel and value, and broadcasts the value to the channel which has
   * been registered
   */

  publish(channel, value,){
    const publisher = this.client.duplicate();
    return new Promise((resolve, reject) => {
      publisher.publish(channel, value, (err) => {
        if(err) return reject(err);
        console.log(chalk.bold.yellow(`===> Publish event happened on channel ${chalk.bold.red(channel)}`))
        return resolve(true); 
      });
    })
  }

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: SUBSCRIBE SYNC
  /**
   * Takes channel, function and other paramaters for the fn, when value recived
   * from publish event to related channel, takes the value calls the function 
   * with the value, and saves the result as hset with the channel id, and
   * message as a key. If function returns an object, stringifys it and saves 
   * like that way. Before using the value must parse it.
   */

  subscribe(channel, fn, ...rest){
    
    const subscriber = this.client.duplicate()
    subscriber.on('message', (chn, message) => {
      console.log(chalk.bold.green(`===> Subscribe event happened on channel ${chalk.bold.red(channel)}`))
      const result = fn(message, ...rest);
      this.client.hset(channel, message, (typeof result === 'object') ? JSON.stringify(result) : result)
    });
    subscriber.subscribe(channel)
  }

   // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: SUBSCRIBE SYNC
  /**
   * ***************SAME AS SUBSCRIBE ONLY ASYNC WAY****************************
   * Takes channel, function and other paramaters for the fn, when value recived
   * from publish event to related channel, takes the value calls the function 
   * with the value, and saves the result as hset with the channel id, and
   * message as a key. If function returns an object, stringifys it and saves 
   * like that way. Before using the value must parse it.
   */

  asyncsubscribe(channel, fn, ...rest){
    const subscriber = this.client.duplicate()
    subscriber.on('message', async (chn, message) => {
      console.log(chalk.bold.green(`===> Subscribe event happened on channel ${chalk.bold.red(channel)}`))
      const result = await fn(message, ...rest);
      this.client.hset(channel, message, (typeof result === 'object') ? JSON.stringify(result) : result)
    })
    subscriber.subscribe(channel)
  }

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: GET VALUES
  /**
   * Takes the key and reutnrs the value as promise. 
   */
  getValues(key){
    return new Promise((resolve, reject) => {
      this.client.hgetall(key, (err, values) => {
        if (err) return reject(err);
        resolve(values)
      })
    })
  }
}


export default Redis;