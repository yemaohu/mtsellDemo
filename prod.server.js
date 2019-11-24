/**
 * 模拟后台访问地址启动项目
 * node prod.server.js (命令行)
 */
var express = require('express')

var config = require('./config/index')

var port = process.env.PORT || config.build.port

var app = express()

var router = express.Router()

router.get('/',function(req,res,next){
    req.url = '/index.html'
    next()
})

app.use(router)

const appData = require('./data.json')//加载本地数据文件
const seller = appData.seller//获取对应本地数据并赋值给变量
const goods = appData.goods//获取对应本地数据并赋值给变量
const ratings = appData.ratings//获取对应本地数据并赋值给变量
const apiRoutes = express.Router()//express框架的Router函数
app.use('/api', apiRoutes);

    app.get('/api/seller',(req,res) =>{
      res.json({
        errno:0,
        data:seller
      })
    }),
    app.get('/api/goods',(req,res) =>{
      res.json({
        errno:0,
        data:goods
      })
    }),
    app.get('/api/ratings',(req,res) =>{
      res.json({
        errno:0,
        data:ratings
      })
    })




app.use(express.static('./dist'))

 //启动express
 module.exports = app.listen(port, function (err) {
   if (err) {
     console.log(err)
    return
   }
 
  console.log('Listen on http://localhost:' + port + '\n')
 })








