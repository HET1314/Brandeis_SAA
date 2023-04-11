const Event = require('../models/event');

const getEventParams = (body) => {
  return {
    title: body.title,
    description: body.description,
    location: body.location,
    startDate: body.startDate,
    endDate: body.endDate,
    isOnline: body.isOnline,
    registrationLink: body.registrationLink,
    organizer: body.organizer,
    attendees: body.attendees,
  };
};
module.exports = {
  index: (req, res, next) => {
    Event.find({})
      .then((events) => {
        res.locals.events = events;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render('events/index');
  },
  new: (req, res) => {
    res.render('events/new');
  },
  create: (req, res, next) => {
    let eventParams = getEventParams(req.body);

    Event.create(eventParams)
      .then((event) => {
        req.flash('success', `${event.title}'s account created successfully!`);
        res.locals.redirect = '/events';
        res.locals.event = event;
        next();
      })
      .catch((error) => {
        console.log(`Error saving event: ${error.message}`);
        res.locals.redirect = '/events';
        req.flash(
          'error',
          `Failed to create event account because: ${error.message}`
        );
        next();
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let eventId = req.params.id;
    Event.findById(eventId)
      .then((event) => {
        res.locals.event = event;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching event by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render('events/show');
  },

  edit: (req, res, next) => {
    let eventId = req.params.id;
    Event.findById(eventId)
      .then((event) => {
        res.render('events/edit', {
          event: event,
        });
      })
      .catch((error) => {
        console.log(`Error fetching event by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let eventId = req.params.id,
      eventParams = {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        isOnline: req.body.isOnline,
        registrationLink: req.body.registrationLink,
        organizer: req.body.organizer,
        attendees: req.body.attendees,
      };
    Event.findByIdAndUpdate(eventId, {
      $set: eventParams,
    })
      .then((event) => {
        res.locals.redirect = `/events/${eventId}`;
        res.locals.event = event;
        next();
      })
      .catch((error) => {
        console.log(`Error updating event by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let eventId = req.params.id;
    Event.findByIdAndRemove(eventId)
      .then(() => {
        res.locals.redirect = '/events';
        next();
      })
      .catch((error) => {
        console.log(`Error deleting event by ID: ${error.message}`);
        next();
      });
  },
};
