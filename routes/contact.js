
var express = require('express');
var app = express();
var router = express.Router();


require('dotenv').config()

var nodemailer = require('nodemailer');

var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })

const expressValidator = require('express-validator');
app.use(expressValidator());

router.get('/', csrfProtection,function (req, res) {
    console.log(process.env.gmailAccessToken);
    res.render('contact', { csrfToken: req.csrfToken(), nameErr: req.flash('nameErr')});
});
router.get('/review', function (req, res) {
    res.render('contactReview');
});


router.post('/post', csrfProtection ,function (req, res) {
    var data = req.body;
    req.checkBody('username').isLength({ min: 1 });

    const validationResults = req.validationErrors();
    console.info(`validation results: ${JSON.stringify(validationResults)}`);

    if (!validationResults || validationResults.length < 1) {
        req.sanitizeBody('username').escape().trim();
        res.send(`checking done, hello: ${req.body['username']}`);
    } else {
        res.send(`checking done, error: ${JSON.stringify(validationResults)}`);
    }


    // let transport = nodemailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     secure: true,
    //     auth: {
    //         type: "OAuth2",
    //         user: process.env.gmailUser,
    //         clientId: process.env.gmailClientId,
    //         clientSecret: process.env.gmailClientSecret,
    //         refreshToken: process.env.gmailRefreshToken,
    //         accessToken: process.env.gmailAccessToken,
    //     }
    // });

    // let mailOption = {
    //     from: '鐵<ironcat1206@mail.com>',
    //     to: data.email,
    //     subject: data.title,
    //     text: data.description
    // }

    // transport.sendMail(mailOption, function (err, i) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.redirect('review');
    //     }
    // })


    // console.log(data)

});
module.exports = router;
