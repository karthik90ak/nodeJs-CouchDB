 const http=require('http');
const port=3000;
const fs=require('fs');


const nodeCouchDb=require('node-couchdb');
const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');

const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//const couch=new nodeCouchDb({

//	      auth: {
//		       user: 'karthik',
//		       password: 'karthik'
//	      }
//});

const couch=new nodeCouchDb();

const dbName='employeedb';
const viewUrl='_design/viewdesign/_view/firstview'



app.get('/', function(req,res) {

	        couch.get(dbName, viewUrl).then(({data, headers, status}) => {
//			    	console.log(data.rows);
			    	res.render('index', {
					    		employees:data.rows
					    	});
					}, err => {
						    	res.send(err);
						    });

});

app.post('/employee/add',function(req,res){
	 const name=req.body.Name;
	 const email=req.body.Email
	 const empid=req.body.EmployeeID
	 
	 couch.uniqid().then(function(ids){
		  const id=ids[0];
		  
		  couch.insert(dbName,{
			  	_id:id,
			  	name:name,
			  	email:email,
			        emp_id:empid
			  
			   }).then(
				    function(data,headers,status){
					     res.redirect('/');
					     },
				    function(err){
					     res.send(err);
					     });
		  });
});



app.post('/employee/delete/:id',function(req,res){
     	
	const id=req.params.id;
	const rev=req.body.rev;

//	console.log('rev logging ' +rev);
	couch.del(dbName, id, rev).then(({data, headers, status}) => {
		  	res.redirect('/')
		         }, err => {
		         res.send(err);
                   });
 
});


        app.listen(port, function(){
		                   console.log('running on port '+port);

		                });
