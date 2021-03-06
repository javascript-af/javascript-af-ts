import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { v1 as neo4j } from 'neo4j-driver';
import typeDefs from './schema';
import resolvers from './resolvers';
import authInit from './utils/passport';
import * as initStore from 'connect-redis';
import * as dotenv from 'dotenv';
import * as Redis from 'ioredis';
import * as passport from 'passport';
import * as express from 'express';
import * as session from 'express-session';
import * as cors from 'cors';

dotenv.config({ path: `${__dirname}/../.env` });

const RedisStore = initStore(session);
const redisClient = new Redis(process.env.REDIS_HOST);

const app = express();
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

app.use(
  session({
    secret: process.env.COOKIE_SIGNING_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'ssid',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15552000000
    }, // 6 months
    store: new RedisStore({
      client: redisClient as any
    })
  })
);

const corsMW = {
  origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsMW));
app.options('*', cors(corsMW));

app.use(passport.initialize());
app.use(passport.session());

authInit();

interface Ctx {
  req: express.Request;
}

const server = new ApolloServer({
  context: ({ req }: Ctx) => {
    return {
      driver,
      user: req.user
    };
  },
  playground: {
    settings: {
      'editor.cursorShape': 'line',
      'request.credentials': 'include'
    }
  },
  schema
});

app.get(
  '/auth/github',
  passport.authenticate('github', {
    scope: ['read:user,user:email']
  })
);
app.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: 'http://localhost:3000'
  })
);

export const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'letmein'
  )
);

server.applyMiddleware({ app, cors: corsMW, path: '/graphql' });

app.listen(8080, () => {
  // tslint:disable-next-line
  console.log(`Server started on http://localhost:8080`);
  // tslint:disable-next-line
  console.log(`Graphql endpoint is up at http://localhost:8080/graphql`);
   
  
});
