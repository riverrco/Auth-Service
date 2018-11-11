const dotEnv = require('dotenv');

dotEnv.load();
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: CONFIG

module.exports = {
  PORT: process.env.PORT,
  FBAPPID: process.env.FBAPPID,
  FBAPPSECRET: process.env.FBAPPSECRET,
  GOOGLEAPPID: process.env.GOOGLEAPPID,
  GOOGLEAPPSECRET: process.env.GOOGLEAPPSECRET,
  GITHUBAPPID: process.env.GITHUBAPPID,
  GITHUBAPPSECRET: process.env.GITHUBAPPSECRET,
  GITHUBCBURL: process.env.GITHUBCBURL,
  PG_USER: process.env.PG_USER,
  PG_PASSWORD: process.env.PG_PASSWORD,
  PG_DB: process.env.PG_DB,
  PG_HOST: process.env.PG_HOST,
  PG_PORT: process.env.PG_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  FBCBURL: process.env.FBCBURL,
  DEFAULTPP: process.env.DEFAULTPP,
  GOOGLECBURL: process.env.GOOGLECBURL,
  REDIS_CLIENT: process.env.REDIS_CLIENT,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_VAL_EXPIRE_TIME: process.env.REDIS_VAL_EXPIRE_TIME,
  SENTY: process.env.SENTY,
  NATSURL: process.env.NATSURL,
  NATSCLUSTER: process.env.NATSCLUSTER,
  NATSTOKEN: process.env.NATSTOKEN
};
