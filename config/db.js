if(process.env.NODE_ENV == "production") {
	module.exports = {
		mongoURI: "mongodb+srv://IgorSantos:xpcsms02@bloconotas.ymiyx.mongodb.net/blocoNotas?retryWrites=true&w=majority"
	}
} else {
		module.exports = {mongoURI: "mongodb://localhost/blocoNotas"}
	}