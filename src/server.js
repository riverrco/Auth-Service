import express from 'express';
import config from './config';
import routes from './Routes';
import osLog from './utils/osinfo';
import passport from 'passport';
import bodyParser from 'body-parser';
import subscriptions from './subscriptions';
const Sentry =  require('@sentry/node');

const isDevelopment = process.env.NODE_ENV === 'development';


const {PORT, SENTY} = config;
const app = express();
Sentry.init({ dsn:SENTY });

!isDevelopment && app.use(Sentry.Handlers.requestHandler());

app.use(bodyParser.json());
app.use(passport.initialize())
app.use('/auth',routes())

app.get('/', (req,res) => res.send('Hello'))

// ::::::::::::::::::::::::::::::: INVOKING SUBSCRIPTIONS FROM DIFFRENT SERVICES

subscriptions();

!isDevelopment && app.use(Sentry.Handlers.errorHandler());

!isDevelopment && app.use((req,res,next) => {
  res.statusCode = 500;
  res.end(res.sentry + '\n')
})

app.listen(PORT, '0.0.0.0', async(err) => {
  if (err)  console.log(err)
  else{
    osLog({url: `http://0.0.0.0:${PORT}`, service: 'Auth'});
  }
})

export default app;