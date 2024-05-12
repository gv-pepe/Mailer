import express from 'express';
import path from 'path';
const app = express()
import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv';

dotenv.config()

app.use(express.json())
sgMail.setApiKey(process.env.SGKEY)
app.use(express.static('app'))

app.get('/', (req, res) => {
    res.sendFile(`${path.resolve()}/index.html`)
})


app.post('/send', async (req, res) => {
    const { to, subject, html } = req.body
    const msg = {
        to,
        from: process.env.CORREO,
        subject,
        html,
    }

    try {
        await sgMail.send(msg)
        res.sendStatus(204)
    }catch(e) {
        const messages = e.response.body.errors.map(e => e.message).join('')
        console.log(e.response.body.errors)
        res.status(400).send(messages); 
    }
})
/*

const msg = {
    to: 'prbsPepe@gmail.com', // Change to your recipient
    from: process.env.CORREO, // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })

    */

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
