const express = require('express');
const fs = require('fs');
const app = express();
// const morgan = require('morgan')

var nodemailer = require('nodemailer')
var bodyParser = require('body-parser')

app.set('port', (8081));
// app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'))

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Sending Email when user request /contactUs
console.log('Execute Nodemailer')
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-cache')
  next()
})
var smtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'dev.betterlifevietnam@gmail.com',
    pass: 'ThinhNguyen'
  }
}
var transporter = nodemailer.createTransport('smtps://' + smtpConfig.auth.user + ':' + smtpConfig.auth.pass + '@smtp.gmail.com')

var comments = [];

app.get('/api/comments', function(req, res) {
  res.send(comments);
});
app.post('/api/comments', function (req, res) {
    // setup e-mail data
  var mailOptions = {
    from: 'BLV Development Member <dev.betterlifevietnam@gmail.com>', // sender address
    to: ['phamrosalind@gmail.com','dev.betterlifevietnam@gmail.com'], // list of receivers
    subject: 'New BLV Contact from '+ req.body.name, // Subject line
    text: req.body.message, // plaintext body
    html: '<h4> Name: '+req.body.name+'</h4><h4>Email: '+req.body.email+'</h4><h4>Message: "'+ req.body.message +'"</h4>' // html body
  
}
    // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    var errorToComment = 'Oh no! Something went wrong. Please email us directly at betterlifevietnam@gmail.com'
    if (error) {
      comments.push(errorToComment)
      return console.log('Transporter Error: '+ error)
    }
    console.log('Message sent: ' + info.response)
    res.send(comments)
  })
})

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
