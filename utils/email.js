import nodemailer from 'nodemailer'

const sendEmail = async options => {
  // Create a transporter

  //?This is how to use gmail as a service
  // const transporter = nodemailer.createTransport({
  //   service: "Gmail",
  //   auth: {
  //     user: process.env.GMAIL_USER,
  //     password: process.env.GMAIL_PASS
  //   }
  // })

  //?This is mailtrap service
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // define the email options
  const mailOptions = {
    from: "Rayhan Rahat <djrayhan8@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  //send the email with nodemailer
  await transport.sendMail(mailOptions)
}

export default sendEmail