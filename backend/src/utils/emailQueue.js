const Queue = require('bull')
const EmailService = require('./emailService')
require('dotenv').config()

const emailQueue = new Queue('emailQueue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  limiter: {
    max: 10,
    duration: 1000,
  },
})

// Process emails in the queue
emailQueue.process(async (job) => {
  //console.log(`Processing job ${job.id} for ${job.data}`)
  try {
    // const { to, subject, text, html } = job.data
    // const emailOptions = {
    //   from: 'Umar <hello@mysite.com>',
    //   to,
    //   subject,
    //   text,
    //   html,
    // }
    //await emailService.sendEmail(emailOptions)

    const { user, url } = job.data
    const emailSer = new EmailService(user, url)
    //console.log('---user', user, '===url', url)
    await emailSer.sendWelcomeEmail()

    //console.log(`Email sent to ${to}`)
  } catch (error) {
    console.error(`Error sending email: ${error.message}`)
    // Automatically retry failed jobs (up to 3 attempts)
    if (job.attemptsMade < 3) throw error
  }
})

// Error handling
emailQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`)
})

module.exports = emailQueue
