const express = require('express');
const server = express();
const userRouter = require('./users/userRouter');
const postsRouter = require('./posts/postRouter')

//custom middleware
server.use(express.json())
function logger(req, res, next) {
  console.log(
    `${req.method} '${req.protocol}://${req.hostname}${req.path}' ${new Date()}`,
    `Params ${req.params.toString()}.`,
    `Body ${req.body}.`
    );

  next();
}
server.use(logger)

server.get('/', (req, res) => {
  
  res.send(`<h2>Let's write some middleware!</h2>`);
});
server.use('/api/users',userRouter);
server.use('/api/posts',postsRouter);

module.exports = server;
