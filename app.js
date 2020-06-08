const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const cookieParser = require('cookie-parser')
   
const db = require('./db')
const routes = require('./routes/index')

const app = express()
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())
require('./middlewares/authentication/userAuthentication')

app.set('view engine', 'ejs')

db.any("SELECT * FROM role")
    .then(function (data) {
        console.log(data)
    })
    .catch(function (err) {
        console.log(err);
    });

// app.get('/', (req, res) => {
//     res.send("Hello World")
// })

routes(app)

app.listen(process.env.PORT || 3000, () => console.log('hello'))

