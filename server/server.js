const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const { logger, logEvents } = require('./MIDDLEWARE/logger')
const errorHandler = require('./MIDDLEWARE/errorHandler')
const cookieParser = require('cookie-parser')
const corsOptions = require('./CONFIG/corsOptions')
const path = require('path')

//Logger
app.use(logger)

//BodyParser
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

//CORS
app.use(cors(corsOptions))

//.env
dotenv.config();

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./ROUTES/root'))

//Routes
// app.use('/api/auth',require('./ROUTES/Auth')) //Auth Api
// app.use('/api',require('./ROUTES/User')) //User Api
// app.use('/api/post',require('./ROUTES/Post')) //Post Api
// app.use('/api/upload',require('./ROUTES/Upload')) //Upload images Api
// app.use('/api/comment',require('./ROUTES/Comments')) //Comment Api

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
      res.json({ message: '404 Not Found' })
  } else {
      res.type('txt').send('404 Not Found')
  }
})

app.use(errorHandler)

//Connect to DB.
// connectDB()

//PORT
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running at port:${port}`);
});
