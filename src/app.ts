import express from 'express';
import { Application, RequestHandler } from 'express';
import { MainRouter } from './routes';
import { loadErrorHandlers } from './utilities/error-handling';
import session from 'express-session';
import helmet from "helmet";
import compression from "compression";
import { SESSION_SECRET } from "./utilities/secrets";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import './database'; // initialize database
import './utilities/passport'



const app: Application = express();

app.use(helmet());
app.use(compression());

const jsonParser: RequestHandler = express.json();
const urlencodedParser: RequestHandler = express.urlencoded({ extended: true });

app.use(jsonParser);
app.use(urlencodedParser);
app.use(session({
    secret: SESSION_SECRET,
    cookie: {
      maxAge: 60000
    },
    resave           : false,
    saveUninitialized: false
  }
));
// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Social Media API Documentation'
}));

app.use('/api', MainRouter);

loadErrorHandlers(app);


export default app;
