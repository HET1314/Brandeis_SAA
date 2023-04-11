const mongoose = require('mongoose');
const express = require('express');
// const Subscriber = require('./models/subscriber');
const usersController = require('./controllers/usersController');
const eventsController = require('./controllers/eventsController');
const jobsController = require('./controllers/jobsController');
const methodOverride = require('method-override');
const layouts = require('express-ejs-layouts');
const connectFlash = require('connect-flash');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const router = express.Router();
// const subscribersController = require('./controllers/subscribersController');
mongoose.connect(
  'mongodb+srv://HET:19980610521Abc.@cluster0.yx55ksj.mongodb.net/?retryWrites=true&w=majority'
);

const app = express();
app.use(express.static('public'));
app.use(layouts);
router.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);
router.use(cookieParser('secret-pascode'));
router.use(
  expressSession({
    secret: 'secret_passcode',
    cookie: {
      maxAge: 40000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
router.use(connectFlash());

app.use(express.json());
app.use(express.urlencoded());
app.set('view engine', 'ejs');
const db = mongoose.connection;

db.once('open', () => {
  console.log('Successfully connected to mongodb!');
});

router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

app.use('/', router);
app.get('/users', usersController.index, usersController.indexView);
router.get('/users/new', usersController.new);
router.post(
  '/users/create',
  usersController.create,
  usersController.redirectView
);
router.get('/users/:id', usersController.show, usersController.showView);
router.get('/users/:id/edit', usersController.edit);
router.put(
  '/users/:id/update',
  usersController.update,
  usersController.redirectView
);
router.delete(
  '/users/:id/delete',
  usersController.delete,
  usersController.redirectView
);
app.get('/events', eventsController.index, eventsController.indexView);
router.get('/events/new', eventsController.new);
router.post(
  '/events/create',
  eventsController.create,
  eventsController.redirectView
);
router.get('/events/:id', eventsController.show, eventsController.showView);
router.get('/events/:id/edit', eventsController.edit);
router.put(
  '/events/:id/update',
  eventsController.update,
  eventsController.redirectView
);
router.delete(
  '/events/:id/delete',
  eventsController.delete,
  eventsController.redirectView
);

app.get('/jobs', jobsController.index, jobsController.indexView);
router.get('/jobs/new', jobsController.new);
router.post('/jobs/create', jobsController.create, jobsController.redirectView);
router.get('/jobs/:id', jobsController.show, jobsController.showView);
router.get('/jobs/:id/edit', jobsController.edit);
router.put(
  '/jobs/:id/update',
  jobsController.update,
  jobsController.redirectView
);
router.delete(
  '/jobs/:id/delete',
  jobsController.delete,
  jobsController.redirectView
);

app.listen(3000, () => {
  console.log('application is running');
});
