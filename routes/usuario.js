const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/usuarios');
const Usuarios = mongoose.model('usuarios');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/registro', (req, res) => {
	res.render('usuarios/registro');
});

router.post('/registro', (req, res) => {

	let erros = [];
	const nome = req.body.nome;
	const email = req.body.email;
	const senha = req.body.senha;

	if(!nome || typeof nome == undefined || nome == null) erros.push({text: "Nome inválido"});
	if(!email || typeof email == undefined || email == null) erros.push({text: "email inválido"});
	if(!senha || typeof senha == undefined || senha == null) erros.push({text: "Senha inválido"});
	if(senha.legth < 4) erros.push({text: "Senha muito curta"});
	if(senha != req.body.senha2 ) erros.push({text: "As senhas estão diferentes"});

	if(erros.length > 0) {
		res.render('usuarios/registro', {erros: erros});
	} else {
		Usuarios.findOne({email: req.body.email}).then(usuarios => {
			if(usuarios) {
				req.flash('error_msg', "Esse email já esta sendo utilizado. Tente outro!");
				res.redirect('/usuarios/registro');
			} else {
				const novoUsuario = new Usuarios({
					nome: req.body.nome,
					email: req.body.email,
					senha: req.body.senha
				});

				bcrypt.genSalt(10, (erro, salt) => {
					bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
						if(erro) {
							req.flash('error_msg', 'Houve um erro ao salvar');
							res.redirect('/usuarios/registro');
						}

						novoUsuario.senha = hash;

						novoUsuario.save().then(() => {
							req.flash('success_msg', 'Usuario criado com sucesso!');
							res.redirect('/admin/anotacoes/home');
						}).catch(e => {
							req.flash('error_msg', 'Houve um erro ao criar o usuário');
							res.redirect('/usuarios/registro');
							console.log(e);
						});
					});
				});
			}
		}).catch(e => {
			req.flash('error_msg', `Houve um erro interno em nosso sistema`);
			res.redirect('/');
			console.log(e);
		});
	}
});

router.get('/login', (req, res) => {
	res.render('usuarios/login');
});

router.post('/login', (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: '/',
		failureRedirect: '/usuarios/login',
		failureFlash: true
	})(req, res, next)
});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', "Você foi deslogado da sua conta com sucesso");
	res.redirect('/usuarios/login');
});

module.exports = router;