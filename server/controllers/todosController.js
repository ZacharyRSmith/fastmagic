const Todo = require('../models/todo');

module.exports = {
  create: (req, res, next) => {
    // FIXME get params
    // FIXME support multiple?
    console.log('req.body', req.body);
    const owner = req.body.owner;
    req.body.owner = { name: owner };
    console.log('req.body', req.body);
    Todo.create(req.body, function todoCreateCb(err, todo) {
      console.error('err', err);
      if (err) return res.status(500).send(err);
      res.status(200).send(todo);
    });
  },
  delete: (req, res, next) => {
    Todo.remove({}, err => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    });
  },
  getIndex: (req, res, next) => {
    Todo.find({}, (err, todos) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(todos);
    });
  },
  update: (req, res, next) => {
    const update = Object.assign({}, req.body, { done: !req.body.done });

    Todo.findOneAndUpdate({ _id: req.body.id }, update, { new: true }, (err, todo) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(todo);
    });
  }
};
