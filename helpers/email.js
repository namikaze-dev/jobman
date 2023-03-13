import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const send = async (recipient, subject, tmplName, data) => {
    const source = await fs.readFile(path.resolve(path.dirname(process.argv[1]), "./templates", tmplName + ".html"), 'utf-8');
    const template = handlebars.compile(source);

    const options = {
        from: process.env.EMAIL_SENDER,
        to: recipient,
        subject: subject,
        html: template(data)
    };

    await transporter.sendMail(options);
}

export default send;