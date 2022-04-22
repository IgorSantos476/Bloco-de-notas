const mongoose = require('mongoose');

const Anotaçoes = mongoose.Schema({
	
	titulo: {
		type: String,
		required: true
	},
	
	conteudo: {
		type: String,
		required: true
	},

	data: {
		type: Date,
		default: Date.now()
	}
});

mongoose.model('anotaçoes', Anotaçoes);