// const nodemailer = require('nodemailer')
// require('dotenv').config()

// const transporter = nodemailer.createTransport({
//   host: 'sandbox.smtp.mailtrap.io',
//   //host: 'smtp.freesmtpservers.com',
//   port: 2525,
//   auth: {
//     user: '9487256961fc46',
//     pass: 'd03fa5c8901336',
//   },
// })

// exports.sendEmail = async (emailOptions) => {
//   return await transporter.sendMail(emailOptions)
// }

const pug = require('pug')
const htmlToText = require('html-to-text')
const nodemailer = require('nodemailer')
require('dotenv').config()

class EmailService {
  constructor(user, url) {
    this.to = user.username
    this.url = url
    this.from = 'Umar <hello@mysite.com>'
  }

  async sendWelcomeEmail() {
    await this.sendEmailAsync('welcome', 'Welcome to family')
  }

  newTransporter() {
    return nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      //host: 'smtp.freesmtpservers.com',
      port: 2525,
      auth: {
        user: '9487256961fc46',
        pass: 'd03fa5c8901336',
      },
    })
  }

  async sendEmailAsync(template, subject) {
    const htmlString = pug.renderFile(
      `${__dirname}/../views/email/${template}.pug`,
      {
        firstName: 'Umar',
        url: this.url,
      },
    )

    console.log('htmlString', this.to)

    const emailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText.convert(htmlString),
      html: htmlString,
    }

    //return 1
    return await this.newTransporter().sendMail(emailOptions)
  }
}

module.exports = EmailService
