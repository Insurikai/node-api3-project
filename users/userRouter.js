const express = require('express');
const db = require('./userDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  db.insert(req.body)
    .then(user => {
      res.status(200).send(user);
    })
    .catch(err => {
      res.status(500).send({ error: err.toString() });
    });
});

router.post('/:id/posts', validatePost, (req, res) => {
  require('../posts/postDb')
    .insert({ user_id: req.params.id, ...req.body })
    .then(post => {
      res.status(200).send(post);
    })
    .catch(err => {
      res.status(500).send({ error: err.toString() });
    });
});

router.get('/', (req, res) => {
  db.get()
    .then(users => {
      res.status(200).send(users);
    })
    .catch(err => {
      res.status(500).send({ error: err });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).send(req.user);
});

router.get('/:id/posts', (req, res) => {
  db.getUserPosts(req.params.id)
    .then(userPosts => {
      userPosts.length > 0
        ? res.status(200).send(userPosts)
        : res.status(404).send(`No posts for user with id ${req.params.id}.`);
    })
    .catch(err => {
      res.status(500).send({ error: err.toString() });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  db.remove(req.params.id)
    .then(recordsDeleted => {
      res
        .status(200)
        .send(`Successfully deleted user with id ${req.params.id}.`);
    })
    .catch(err => {
      res.status(500).send({ error: err.toString() });
    });
});

router.put('/:id', validateUser, (req, res) => {
  db.update(req.params.id, req.body)
    .then(changes => {
      res.status(200).send(`Made ${changes} changes.`);
    })
    .catch(err => {
      res.status(500).send({ error: err.toString() });
    });
});

function validateUserId(req, res, next) {
  db.getById(req.params.id).then(user => {
    user
      ? (req.user = user)
      : res.status(400).send({ message: 'invalid user id' });
    next();
  });
}

function validateUser(req, res, next) {
  Object.entries(req.body).length > 0
    ? req.body.name
      ? next()
      : res.status(400).send({ message: 'missing required name field' })
    : res.status(400).send({ message: 'missing user data' })
}

function validatePost(req, res, next) {
  Object.entries(req.body).length > 0
    ? req.body.text
      ? next()
      : res.status(400).send({ message: 'missing required text field' })
    : res.status(400).send({ message: 'missing post data' })
}

module.exports = router;
