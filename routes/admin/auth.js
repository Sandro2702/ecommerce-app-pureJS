/* ============INSTALLED PACKAGES======== */
const express = require('express');
const router = express.Router();

/*==============MIDDLEWARES================ */
const { handleErrors } = require('./middlewares.js');

/*==============USER REPO================ */
const usersRepo = require('../../repositories/users.js');

/* =============TEMPLATES================ */
const signupTemplate = require('../../views/admin/auth/signup.js');
const signinTemplate = require('../../views/admin/auth/signin.js');

/* =============VALIDATORS============== */
const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	requireEmailExists,
	requireValidPasswordForUser
} = require('./validators.js');


/* =================SIGNUP================ */

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

router.post(
	'/signup',
	[requireEmail, requirePassword, requirePasswordConfirmation],
	handleErrors(signupTemplate),
	async (req, res) => {
		const { email, password } = req.body;
		const user = await usersRepo.create({
			email,
			password
		});

		req.session.userId = user.id;

		res.redirect('/admin/products');
	}
);

/* =================SIGN OUT================ */

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are logged out');
});

/* =================SIGN IN================ */

router.get('/signin', (req, res) => {
	res.send(signinTemplate({}));
});

router.post(
	'/signin',
	[requireEmailExists, requireValidPasswordForUser],
	handleErrors(signinTemplate),
	async (req, res) => {
		const { email } = req.body;

		const user = await usersRepo.getOneBy({ email });

		req.session.userId = user.id;

		res.redirect('/admin/products');
	});

module.exports = router;
