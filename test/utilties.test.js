import {expect} from 'chai';
import {decipherLibnameTableName} from '../src/utilities';

describe("Deciphering Libnames and Tablename using the Utility",function(){

	it('&ENV.&OPSLIB..TESTER should get broken down into &ENV.&OPSLIB as libname and TESTER as tablename', function (done) {
	  var providedTableName="&ENV.&OPSLIB..TESTER";
	  var libname=decipherLibnameTableName(providedTableName).libname;
	  var tablename=decipherLibnameTableName(providedTableName).tablename;

	  expect(libname).to.equal('&ENV.&OPSLIB');
	  expect(tablename).to.equal('TESTER');
	  done();
	});

	it('&ENVLIB..&ENV.TESTER should get broken down into &ENVLIB as libname and TESTER as tablename', function (done) {
	  var providedTableName="&ENVLIB..&ENV.TESTER";
	  var libname=decipherLibnameTableName(providedTableName).libname;
	  var tablename=decipherLibnameTableName(providedTableName).tablename;

	  expect(libname).to.equal('&ENVLIB');
	  expect(tablename).to.equal('&ENV.TESTER');
	  done();
	});

	it('&ENVLIB..T&ENV.TESTER should get broken down into &ENVLIB as libname and T&ENV.TESTER as tablename', function (done) {
	  var providedTableName="&ENVLIB..T&ENV.TESTER";

	  var libname=decipherLibnameTableName(providedTableName).libname;
	  var tablename=decipherLibnameTableName(providedTableName).tablename;

	  expect(libname).to.equal('&ENVLIB');
	  expect(tablename).to.equal('T&ENV.TESTER');
	  done();
	});

	it('WORK.TEST should get broken down into WORK as libname and TEST as tablename', function (done) {
	  var providedTableName="WORK.TEST";

	  var libname=decipherLibnameTableName(providedTableName).libname;
	  var tablename=decipherLibnameTableName(providedTableName).tablename;

	  expect(libname).to.equal('WORK');
	  expect(tablename).to.equal('TEST');
	  done();
	});

	it('SUSHIL should get broken down into WORK as libname and SUSHIL as tablename', function (done) {
	  var providedTableName="SUSHIL";
	  var libname=decipherLibnameTableName(providedTableName).libname;
	  var tablename=decipherLibnameTableName(providedTableName).tablename;

	  expect(libname).to.equal('WORK');
	  expect(tablename).to.equal('SUSHIL');
	  done();
	});

	it('&RMPTABLE should get broken down into WORK as libname and &RMPTABLE as tablename', function (done) {
	  var providedTableName="&RMPTABLE";
	  var libname=decipherLibnameTableName(providedTableName).libname;
	  var tablename=decipherLibnameTableName(providedTableName).tablename;

	  expect(libname).to.equal('WORK');
	  expect(tablename).to.equal('&RMPTABLE');
	  done();
	});

	it('&PREFIX.&TEMPTBL.&SUFFIX. should get broken down into WORK as libname and &PREFIX.&TEMPTBL.&SUFFIX. as tablename', function (done) {
	  var providedTableName="&PREFIX.&TEMPTBL.&SUFFIX.";
	  var libname=decipherLibnameTableName(providedTableName).libname;
	  var tablename=decipherLibnameTableName(providedTableName).tablename;

	  expect(libname).to.equal('WORK');
	  expect(tablename).to.equal("&PREFIX.&TEMPTBL.&SUFFIX.");
	  done();
	});

})
    
    
    
    