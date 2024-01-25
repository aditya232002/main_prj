var express = require('express');
var router = express.Router();
/* GET users listing. */
// const express=require('express');
// const app=express()
var conn=require('../database');

router.get('/form', function(req, res, next) {
  // res.render('voter-registration.ejs');
  if(req.session.loggedinUser){
    res.render('voter-registration.ejs')
  }else{
    res.redirect('/login');
  }
});


var getAge = require('get-age');


var nodemailer = require('nodemailer');
var rand=Math.floor((Math.random() * 10000) + 54);
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'adityamarathe2021@gmail.com',
      pass: 'hawj fgvr rvwj zwwj'
    } 
  });

var account_address;
var data;

// app.use(express.static('public'));
// //app.use('/css',express.static(__dirname+'public/css'));
// //app.use(express.json());
// app.use(express.urlencoded());

router.post('/registerdata',function(req,res){
    var dob=[];
    data=req.body.aadharno;    //data stores PNR no
    console.log(data);
    account_address=req.body.account_address;     //stores metamask acc address
    //console.log(data);
    let sql = "SELECT * FROM aadhar_info WHERE aadharno = ?" ;   
    conn.query(sql, data, (error, results, fields) => {
        if (error) {
          return console.error(error.message);

        }
        if ( results.length == 0){
          res.send('Data not found!');
          return
        }
        //console.log(results)
        dob = results[0].Dob;
        var email=results[0].email;
        age = getAge(dob);
        is_registerd=results[0].Is_registered;
        if (is_registerd!='YES')
        {
          if (age>=18)
          {
            var mailOptions = {
                from: 'adityamarathe2021@gmail.com',
                to: email,
                subject : "Please confirm your Email account",
                text : "Hello, Your otp is "+ "1234"
              };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } 
                else {
                  console.log('Email sent: ' + info.response);
                }
              });
            res.render('emailverify.ejs');
          }
          else
          {
            res.send('You cannot vote as your age is less than 18');
          }
        }
        else    //IF USER ALREADY REGISTERED
        {
          res.render('voter-registration.ejs',{alertMsg:"You are already registered. You cannot register again"});
        }
        
    });

    //console.log(dob);
    //console.log(age);
    //res.send("ok")
    //console.log(dob);
})

router.post('/otpverify', (req, res) => {
    var otp = req.body.otp;
    var data = req.body.PNR;
    var account_address = req.body.account_address;
    if (otp=="1234") 
    {
      let sql = "SELECT * FROM aadhar_info WHERE aadharno = ?" ;   
    conn.query(sql, data, (error, results, fields) => {
        if (error) {
          return console.error(error.message);
        }
        if ( results.length == 0){
          res.send('Data not found!');
          return
        }
        //console.log(results)
        dob = results[0].Dob;
        var email=results[0].email;

        var record= { accaddress: account_address, email : email };
        var sql="INSERT INTO registered_users SET ?";
        conn.query(sql,record, function(err2,res2)
          {
              if (err2){
             throw err2;
            }
              else{
                var sql1="Update aadhar_info set Is_registered=? Where aadharno=?";
                var record1=['YES',data]
                console.log(data)
                conn.query(sql1,record1, function(err1,res1)
                {
                   if (err1) {
                    res.render('voter-registration.ejs');
                   }
                   else{
                    console.log("1 record updated");
                    var msg = "You are successfully registered";
                    // res.send('You are successfully registered');
                    res.render('voter-registration.ejs',{alertMsg:msg});                 
                  }
                }); 
               
              }
          }); 
      
      });
        
    }
    else 
    {
       res.render('voter-registration.ejs',{alertMsg:"Session Expired! , You have entered wronge OTP "});
    }
})




module.exports = router;