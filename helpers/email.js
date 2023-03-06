'use strict'

const fs = require('fs/promises');
const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sender = process.env.EMAIL_SENDER;
const send = async (recipient, subject, tmplName, data) => {
    const source = await fs.readFile(path.resolve(__dirname, "../templates", tmplName + ".html"), 'utf-8');
    const template = handlebars.compile(source);

    const options = {
        from: sender,
        to: recipient,
        subject: subject,
        html: template(data)
    };

    await transporter.sendMail(options);
}

module.exports = send;