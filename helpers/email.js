'use strict'

const fs = require('fs/promises');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sender = process.env.EMAIL_SENDER;

const send = async (recipient, subject, tmplName, data) => {
    const source = await fs.readFile(tmplName, 'utf-8');
    const template = handlebars.compile(source);

    const options = {
        from: sender,
        to: recipient,
        subject: subject,
        html: template(data)
    };

    await transporter.sendMail(options);
}

module.exports = {
    send
}