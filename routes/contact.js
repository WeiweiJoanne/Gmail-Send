var express = require('express');
var router = express.Router();

require('dotenv').config()

var nodemailer = require('nodemailer');

var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })

router.get('/', csrfProtection,function (req, res) {
    console.log(process.env.gmailAccessToken);
    res.render('contact',{ csrfToken: req.csrfToken() });
});
router.get('/review', function (req, res) {
    res.render('contactReview');
});
router.post('/post', csrfProtection, function (req, res) {
    var data = req.body;
    let transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            user: process.env.gmailUser,
            clientId: process.env.gmailClientId,
            clientSecret: process.env.gmailClientSecret,
            refreshToken: process.env.gmailRefreshToken,
            accessToken: process.env.gmailAccessToken,
        }
    });



    let mailOption = {
        from: '鐵來信<ironcat1206@mail.com>',
        to: 'ironcat1206@gmail.com',
        subject: data.title,
        text: data.description
    }

    transport.sendMail(mailOption, function (err, i) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('review');
        }
    })


    // console.log(data)

});
module.exports = router;
