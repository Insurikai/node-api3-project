const express = require('express');
const db = require('./postDb');
const router = express.Router();

router.get('/', (req, res) => {
  db.get()
    .then(posts => {
      res.status(200).send(posts);
    })
    .catch(err => {
      res.status(500).send({ error: err });
    });
});

router.get('/:id', (req, res) => {
  db.getById(req.params.id)
    .then(post => {
      post
        ? res.status(200).send(post)
        : res.status(404).send(`No post with id ${req.params.id}.`);
    })
    .catch(err => {
      res.status(500).send({ error: err });
    });
});

router.delete('/:id', (req, res) => {
  db.remove(req.params.id)
    .then(recordsDeleted => {
      recordsDeleted > 0
        ? res.status(200).send(`Successfully deleted post with id ${req.params.id}.`)
        : res.status(404).send(`No post with id ${req.params.id}.`);
    })
    .catch(err => {
      res.status(500).send({ error: err.toString() });
    });
});

router.put('/:id', (req, res) => {
  db.update(req.params.id, req.body)
    .then(changes => {
      res.status(200).send(`Made ${changes} changes.`)
    })
    .catch(err => {
      res.status(500).send({ error: err.toString() });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
