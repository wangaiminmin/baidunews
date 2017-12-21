var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var request = require('request');

/*
获取天气信息
通过向以下网址发起get请求，可以获取北京地区当日气温信息，
从中抽取cond.txt的内容来自动生成日记中的`weather`字段
https://free-api.heweather.com/v5/now?city=beijing&key=593c403d69364de7b0fd2fe104530de5
 */
var weather = null;

//此时weather已获取出来
request("https://free-api.heweather.com/v5/now?city=beijing&key=593c403d69364de7b0fd2fe104530de5",function(err,res,body){
	var obj = JSON.parse(body);
	// console.log(obj.HeWeather5[0].now.cond.txt);
	if (obj.HeWeather5[0].status === 'ok') {
		weather = obj.HeWeather5[0].now.cond.txt
	}
})


/*
数据库链接设置
 */
var connection = mysql.createConnection({
	host:'localhost',
	port:'8889',
	user:'root',
	password:'root',
	database:'diary'
	
});

//建立连接
connection.connect();



//获取所有数据
router.get('/getData',function(req,res,next){

//  从数据库查询数据

	connection.query('SELECT * FROM text',function(err,results,f){
		console.log(results);

		if(!err){
			res.json(results)
		}
	})

});

/*
 * 路由地址：
 * 		'/add',
 * 请求类型：
 * 		'post',
 * 请求返回内容：
 * 		{status:'ok',message:'添加成功'};
 * 		或
 * 		{status:'error',message:'添加失败'};
 * 路由说明：
 * 		用于向数据库中保存新的日记内容
 * 注意：
 * 		天气信息的处理
 */

router.post('/add',function(req,res,next){
	var now = new Date();
	var title = req.body.title,
		emotion = req.body.emotion,
		date = now.toLocaleString(),
		content = req.body.content;

		connection.query(
			`INSERT INTO text (title,emotion,date,weather,content) VALUES ('${title}','${emotion}','${date}','${weather}','${content}')`,
			//[title,emotion,date,weather,content],
			function(err,result,fields){
				//console.log(result);
				if (!err) {
					res.send(200,{statue:'ok',message:'添加成功'})

				}else{
					console.log(err);
					res.send(200,{status:'error',error:err});
				}
			}

		);
});

/*
 * 路由地址：
 * 		'/getdiary',
 * 请求类型：
 * 		'get',
 * 请求返回内容：
 * 		查询到的所有日记内容
 * 路由说明：
 * 		向用户发送所有的日记信息，用于前端页面展示表格
 */
router.get('/getdiary',function(req,res,next){
	var id = req.query.id;
	console.log(id)
	connection.query('SELECT * FROM diary WHERE id=?',id,function(err,results,f){
		if(!err){
			res.send(results);
		}
	})
	
})


/*
 * 路由地址：
 * 		'/getone',
 * 请求类型：
 * 		'get',
 * 请求返回内容：
 * 		根据用户发送的查询请求，查找到的单条日记
 * 路由说明：
 * 		向用户发送单条日记内容，用于在模态框中进行展示
 */
router.get('/getone',function(req,res,next){
	var id = req.query.id;
	console.log(id)
//从数据库中查询一条数据
	connection.query('SELECT * FROM text WHERE id=?',[id],function(err,results,f){
		res.json(results[0])
		console.log(results);
	})
})

module.exports = router;
