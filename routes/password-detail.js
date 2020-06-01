var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var passCatModel = require('../modules/password_category');
var passModel = require('../modules/add_password');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var getPassCat = passCatModel.find({});
/* GET home page. */


var checkLoginUser = require('../middleware/checklogin');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}




router.get('/', checkLoginUser, function (req, res, next) {
  res.redirect('/dashboard');
});

router.get('/edit/:id', checkLoginUser, function (req, res, next) {
  var loginUser = req.session.userName;
  var id = req.params.id;
  var getPassDetails = passModel.findById({
    _id: id
  });
  getPassDetails.exec(function (err, data) {
    if (err) throw err;
    getPassCat.exec(function (err, data1) {
      res.render('edit_password_detail', {
        title: 'Password Management System',
        loginUser: loginUser,
        records: data1,
        record: data,
        success: ''
      });
    });
  });
});

router.post('/edit/:id', checkLoginUser, function (req, res, next) {
  var loginUser = req.session.userName;
  var id = req.params.id;
  var passcat = req.body.pass_cat;
  var project_name = req.body.project_name;
  var pass_details = req.body.pass_details;
  passModel.findByIdAndUpdate(id, {
    password_category: passcat,
    project_name: project_name,
    password_detail: pass_details
  }).exec(function (err) {
    if (err) throw err;
    var getPassDetails = passModel.findById({
      _id: id
    });
    getPassDetails.exec(function (err, data) {
      if (err) throw err;
      getPassCat.exec(function (err, data1) {
        res.render('edit_password_detail', {
          title: 'Password Management System',
          loginUser: loginUser,
          records: data1,
          record: data,
          success: 'Password Updated Successfully'
        });
      });
    });
  });
});

router.get('/delete/:id', checkLoginUser, function (req, res, next) {
  var loginUser = req.session.userName;
  var id = req.params.id;
  var passdelete = passModel.findByIdAndDelete(id);
  passdelete.exec(function (err) {
    if (err) throw err;
    res.redirect('/view-all-password/');
  });
});


module.exports = router;