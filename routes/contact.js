
var express = require('express');
var router = express.Router();
var flash = require('connect-flash');

const expressValidator = require('express-validator');

router.use(expressValidator());
router.use(flash());


require('dotenv').config()

var nodemailer = require('nodemailer');

var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })



router.get('/', csrfProtection,function (req, res) {
    console.log(process.env.gmailAccessToken);
    res.render('contact', { csrfToken: req.csrfToken(), errors: req.flash('errors')});
});
router.get('/review', function (req, res) {
    res.render('contactReview');
});


router.post('/post', csrfProtection ,function (req, res) {
    var data = req.body;
    req.checkBody('username').notEmpty().trim().withMessage('name is not blank');
    req.checkBody('title', 'title is required').notEmpty().trim();
    req.checkBody('description', 'description is required').notEmpty().trim();
    req.checkBody('email', 'email is required').isEmail().normalizeEmail();

    const validationResults = req.validationErrors();
    // console.info(`validation results: ${JSON.stringify(validationResults)}`);

    if (!validationResults || validationResults.length < 1) {
        req.sanitizeBody('username').escape().trim();
        res.send(`checking done, hello: ${JSON.stringify(req.body)}`);
    } else {
        // res.send(`checking done, error: ${JSON.stringify(validationResults)}`);
        req.flash('errors', validationResults)
        res.redirect('/contact')
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
