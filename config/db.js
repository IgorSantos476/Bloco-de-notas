if(process.env.NODE_ENV == "production") {
	module.exports = {
		mongoURI: "mongodb+srv://IgorFreitas:xpcsms02@cluster0.aal5q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
	}
} else {
	module.exports = {mongoURI: "mongodb://localhost/blocoNotas"}
}