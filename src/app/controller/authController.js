const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const mailer = require('../../module/mailer.js');
const authConfig = require('../../config/auth.json');

const User = require('../model/User');

const router = express.Router();

router.post('/register', async(req, res) => {
    const { email } = req.body;
    try{
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists in database'});

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ 
            user,
            token: generateToken({id: user.id})
         });
    } catch(e){
        return res.status(400).send({ error: 'Registration failed' });
    }
});

router.post('/authenticate', async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user)
        return res.status(400).send({ error: 'User not found' });
    

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password' });

    user.password = undefined;

    res.send({ 
        user, 
        token: generateToken({id: user.id})
     });

});

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });

}

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try{
        const user = await User.findOne({ email });

        if(!user)
            return res.status(400).send({ error: 'User not found' });

        const token = crypto.randomBytes(20).toString('hex');

        const dateNow = new Date();

        dateNow.setHours(dateNow.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: dateNow
            }
        });

        mailer.sendMail({
            to: email,
            from: 'willian.z99999@gmail.com',
            template: 'forgot_password',
            context: { token }
        }, (error) => {
            if(error){
                console.log(error);
                return res.status(400).send({ error: 'The token couldn\'t be sent by email...' });
            }
               
            return res.send();
        })
    } catch (error){
        console.log(error);
        return res.status(400).send({ error: 'Error trying to recover password, try again.' });
    }
});

module.exports = (app) => app.use('/auth', router);