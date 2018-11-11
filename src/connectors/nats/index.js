import nats from 'node-nats-streaming';
import uuid from 'uuid/v3';
import config from '../../config';
import { resolve } from 'dns';


const {NATSCLUSTER, NATSTOKEN, NATSURL} = config;

class Nats {
  constructor(url, token, cluster){
    this.url = url || NATSURL;
    this.token = token || NATSTOKEN;
    this.cluster = cluster || NATSCLUSTER; 
    this.client = this._client();
  }

  _client(){
    const stan = nats.connect(this.cluster, uuid())
    stan.on('connect', (err) => {
      if(err) {
        console.log(err);
      }
      else {
        console.log('Nats client connected')
      }
    })
    return stan;
  }

  producer(ch, data){
    const normalized = typeof data === 'object' ? JSON.stringify(data) : data;
    return this.client.publish(ch, normalized);
  }

  subscribe(ch, worker){
    const opts = this.client.subscriptionOptions();
    opts.setMaxInFlight(100);
    opts.setDeliverAllAvailable();
    opts.setDurableName(ch, worker);
    opts.setManualAckMode(true);
    opts.setAckWait(60*1000);
    const sub = this.client.subscribe(ch, worker, opts);
    return new Promise((resove, reject) => {
      sub.on('message', msg => {
        const data = msg.getData();
        msg.ack();
        return resolve(data);
      });
      sub.on('error', err => reject(err));
    })
  }

  async requestReply(ch, data, worker) {
    await this.producer(ch,data);
    return await this.subscribe(ch, worker);
  }
}

export default Nats