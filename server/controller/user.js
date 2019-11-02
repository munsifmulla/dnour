var mongoose = require('mongoose'),
  User = require('../models/user'),
  bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),
  passport = require('passport'),
  salt = 10;

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
            const token = jwt.sign({ id: data._id }, req.app.get('secretKey'), { expiresIn: '1h' });
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
  User.findOne({ email: req.body.email }, (err, data) => {
    if (err) {
      next(err);
    } else {
      if (data && data.password && bcrypt.compareSync(req.body.password, data.password)) {
        const token = jwt.sign({ id: data._id }, req.app.get('secretKey'), { expiresIn: '1h' });
        req.session.token = token;
        req.login(data._id, () => {
          res.json({ status: 200, message: "user found!!!", data: { user: data.name, token: token } });
        });
      } else {
        res.json({ status: 304, message: "Invalid email / password", data: null });
      }
    }
  })
}

passport.serializeUser((id, done) => {
  done(null, id);
})

passport.deserializeUser((id, done) => {
  done(null, id);
})