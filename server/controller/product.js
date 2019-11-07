var mongoose = require('mongoose');
var products = mongoose.model('products');

exports.addProduct = function (req, res) {
  const new_log = new challenge(req.body);
  new_log.save(function (err, data) {
    if (err) {
      res.json({ status: 200, message: "Something went wrong", data: err });
    }
    res.json({ status: 200, message: "Success", data: data });
  });
};

exports.listLog = function (req, res) {
  const query = { name: /.*/ };
  challenge.find(query, function (err, data) {
    if (err)
      res.send(err);

    challenge.countDocuments(query).exec((count_error, count) => {
      if (err) {
        return res.json(count_error);
      }
      return res.json({
        total: count,
        pageSize: data.length,
        status: 200,
        message: "Success",
        data: data
      });
    });
  })
    .skip(2)
    .limit(5);
};

exports.getLog = function (req, res) {
  challenge.find({ _id: req.body.id }, function (err, data) {
    if (err)
      res.send(err);
    res.json({ status: 200, message: "Success", data: data });
  });
};

exports.findLog = function (req, res) {
  console.log(req.body)
  var re = new RegExp(req.body.name, "");
  challenge.find({ name: re }, function (err, data) {
    if (err)
      res.send(err);
    res.json({ status: 200, message: "Success", data: data });
  });
};