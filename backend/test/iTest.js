'use strict';
var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Integration Test', function() {
    var host = "https://skiwheredb.herokuapp.com";
    var path = "/resort";

    it('should send parameters to : /resort POST with full params', function(done) {
        chai
            .request(host)
            .post(path)
            .send({StartDate: "05/12/2019",
                   EndDate: "05/20/2019",
                   price: 1,
                   state: "CO" })
            .end(function(error, response, body) {
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });
    it('should send parameters to : /resort POST with null params', function(done) {
        chai
            .request(host)
            .post(path)
            .send({})
            .end(function(error, response, body) {
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });
    it('should send parameters to : /resort POST with missing params', function(done) {
        chai
            .request(host)
            .post(path)
            .send({StartDate: "05/12/2019",
                   EndDate: "05/20/2019",
                   state: "CO" })
            .end(function(error, response, body) {
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });



    var path = "/hotel";

    it('should send parameters to : /hotel POST with full params', function(done) {
        chai
            .request(host)
            .post(path)
            .send({	checkin: "5/09/2019",
            checkout:"5/12/2019",
            location:"Silverton",
            price: 1})
            .end(function(error, response, body) {
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });
    it('should send parameters to : /hotel POST with null params', function(done) {
        chai
            .request(host)
            .post(path)
            .send({})
            .end(function(error, response, body) {
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });
    it('should send parameters to : /hotel POST with missing params', function(done) {
        chai
            .request(host)
            .post(path)
            .send({price: 1})
            .end(function(error, response, body) {
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });
    var path = "/flight";

    it('should send parameters to : /flight POST with full params', function(done) {
        chai
            .request(host)
            .post(path)
            .send({"date":"05/15/2019","retdate":"05/20/2019","orig":"AUS","dest":"DEN"})
            .end(function(error, response, body) {
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });
    it('should send parameters to : /resort POST with null params', function(done) {
        chai
            .request(host)
            .post(path)
            .send({})
            .end(function(error, response, body) {
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });
    it('should send parameters to : /resort POST with missing params', function(done) {
        chai
            .request(host)
            .post(path)
            .send({"retdate":"05/20/2019","orig":"AUS","dest":"DEN"})
            .end(function(error, response, body) {
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });
});