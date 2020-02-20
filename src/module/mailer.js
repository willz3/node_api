const nodemailer = require('nodemailer');
const { resolve } = require('path');
const exphbs = require('express-handlebars');
const nodeMailerHbs = require('nodemailer-express-handlebars');

const  {host, port, user, pass} = require('../config/mail.json');
const viewPath = resolve(__dirname, '..', 'resource', 'template', 'mail');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
  });

const handlebarOptions = {
  viewEngine: exphbs.create({
    extName: '.handlebars',
    defaultLayout: 'default',
    layoutsDir: resolve(viewPath, 'layouts'),
    partialsDir: resolve(viewPath, 'partials'),
  }),
  viewPath,
  extName: '.handlebars',
};

transport.use('compile',  nodeMailerHbs(handlebarOptions));

module.exports = transport;