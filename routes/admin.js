const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/anotacoes');
const Anotaçoes = mongoose.model('anotaçoes');

router.get('/anotacoes/home', (req, res) => {
	Anotaçoes.find().lean().sort({data: 'DESC'}).then(anotaçoes => {
		res.render('front/home', {anotaçoes, anotaçoes});
	}).catch(e => {
		req.flash('error_msg', 'Houve um erro ao listar as anotaçoes');
		res.redirect('/');
	});
});

router.get('/anotacoes/salvar', (req, res) => {
	res.render('front/salvar');
});

router.post('/anotacoes/salvar/nova', (req, res) => {
	let titulo = req.body.titulo;
	let conteudo = req.body.conteudo;
	let err = Array();

	if(!titulo || titulo == null || titulo == undefined) err.push({text: 'Faltou adicionar um título na anotação !'});

	if(!conteudo || conteudo == null || conteudo == undefined) err.push({text: 'O conteudo ficou vázio °-°'});

	if(err.length > 0) {
		res.render('front/salvar', {err: err});
	} else{	
		const novaAnotaçao = {
			titulo: req.body.titulo,
			conteudo: req.body.conteudo,
		}

		new Anotaçoes(novaAnotaçao).save().then(() => {
			req.flash('success_msg', 'Salvo com sucesso!!!');
			console.log('Anotação salva com sucesso!');
			res.redirect('/admin/anotacoes/salvar');
		}).catch(e => {
			req.flash('error_msg', 'Houve um erro ao fazer a anotação');
			console.log('Houve um erro ao salvar' + e);
			res.redirect('/admin/anotacoes/salvar');
		});
	}
});


router.get('/anotacoes/edit/:id', (req, res) => {
	Anotaçoes.findOne({_id: req.params.id}).lean().then(anotaçao => {
		res.render('front/edit', {anotaçao, anotaçao});
	}).catch(e => {
		req.flash('error_msg', "Infelizmente não encontramos essa anotação");
		res.redirect('/admin/anotacoes/home')
	});
});

router.post('/anotacoes/edit', (req, res) => {
	Anotaçoes.findOne({_id: req.body.id}).then(anotaçao => {
		anotaçao.titulo = req.body.titulo;
		anotaçao.conteudo = req.body.conteudo;

		anotaçao.save().then(() => {
			req.flash('success_msg', 'Editado cm sucesso!');
			res.redirect('/admin/anotacoes/home');
		}).catch(e => {
			req.flash('error_msg', 'Não foi possível salvar a nova edição');
			res.redirect('/admin/anotacoes/home');
		});
	});
});

router.post('/anotacoes/deletar', (req, res) => {
	Anotaçoes.deleteOne({_id: req.body.id}).then(() => {
		req.flash('success_msg', 'Anotação deletada com sucesso!');
		res.redirect('/admin/anotacoes/home');
	}).catch(e => {
		req.flash('error_msg', `Houve um erro ${e}`);
		res.redirect('/admin/anotacoes/home');
	});
});

router.get('/', (req, res) => {
	res.render('front/menu');
})

module.exports = router;