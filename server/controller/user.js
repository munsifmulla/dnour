var mongoose = require('mongoose'),
  app = require('express')(),
  User = require('../models/user'),
  bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),
  passport = require('passport'),
  salt = bcrypt.genSaltSync(+process.env.SALT),
  mailer = require('express-mailer'),
  utils = require('../../lib/helpers/utils');

exports.createUser = (req, res, next) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt)
  }, (err, result) => {
    if (err) {
      next(err);
    } else {
      User.findOne({ email: req.body.email }, (err, data) => {
        if (err) {
          next(err);
        } else {
          if (data && data.password && bcrypt.compareSync(req.body.password, data.password)) {
            const token = jwt.sign({ id: data._id }, req.app.get('secretKey'), { expiresIn: parseInt(process.env.AUTH_EXPIRY_TIME) });
            req.session.token = token;
            req.login(data._id, () => {
              res.json({ status: 200, message: "user created!!!", data: { user: data.name, token: token } });
            });
          } else {
            res.json({ status: 422, message: "error", data: null });
          }
        }
      })
    }
  })
}

exports.loginUser = (req, res, next) => {
  console.log(parseInt(process.env.AUTH_EXPIRY_TIME), 'Time');
  User.findOne({ email: req.body.email }, (err, data) => {
    if (err) {
      next(err);
    } else {
      if (data && data.password && bcrypt.compareSync(req.body.password, data.password)) {
        const token = jwt.sign({ id: data._id, role: data.role }, req.app.get('secretKey'), { expiresIn: parseInt(process.env.AUTH_EXPIRY_TIME) });
        req.session.token = token;
        req.session.role = data.role;
        req.login(data._id, () => {
          res.status(200).json({ status: 200, message: "user found!!!", data: { user: data.name, token: token } });
        });
      } else {
        res.status(200).json({ status: 304, message: "Invalid email / password", data: null });
      }
    }
  });
}

exports.generateUser = (req, res, next) => {
  const { name, email, role } = req.body;
  const randPass = utils.generateRandomPassword();
  const user = {
    name,
    email,
    password: bcrypt.hashSync(randPass, salt),
    role,
  };
  User.count({ email }, function (err, count) {
    if (count > 0) {
      res.send({ status: 401, message: "User exists", data: {} })
    } else {
      User.create(user, (error, result) => {
        if (error) {
          console.log(error, 'Error in create');
          next(error);
        } else {
          // const mail = sendEmail(randPass);
          console.log(randPass, 'Mail Sent');
          res.json({ status: 200, message: "User created successfully", data: {} });
        }
      });
    }
  });
}

app.set('view engine', 'pug');
app.set('views', './dashboard/views/emailers/');

//Mailer
mailer.extend(app, {
  from: 'munsif.ingeniouspix@gmail.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'munsif.ingeniouspix@gmail.com',
    pass: 'Ahabbuka@24'
  }
});

function sendEmail(data) {
  return app.mailer.send('userGeneratedEmail', {
    to: 'munsif.ingeniouspix@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field. 
    subject: 'Test Email', // REQUIRED.
    data: data // All additional properties are also passed to the template as local variables.
  }, function (err) {
    if (err) {
      // handle error
      console.log(err);
      // res.send('There was an error sending the email');
      return false;
    }
    // res.send('Email Sent');
    return true;
  });
}

exports.deleteUser = (req, res, next) => {
  const { email } = req.body;

  User.count({ email }, function (err, count) {
    if (count > 0) {
      User.remove({ email }, function (err, result) {
        if (err) {
          next(err)
        } else {
          res.json({ status: 200, message: "User deleted successfully", data: {} });
        }
      });
    } else {
      res.json({ status: 404, message: "User not found", data: {} });
    }
  })
}

exports.listUsers = (req, res, next) => {
  User.find({}, (err, data) => {
    if (err) {
      res.json({ status: 500, message: "Something went wrong", data: err });
    } else {
      if (data.length > 0) {
        res.json({ status: 200, message: "Users found", data: data });
      }
      else {
        res.json({ status: 304, message: "No Users found", data: data });
      }
    }
  });
}

passport.serializeUser((id, done) => {
  done(null, id);
})

passport.deserializeUser((id, done) => {
  done(null, id);
})