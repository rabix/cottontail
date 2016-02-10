var Store = require('../../../../server/components/store');
var helper = require('../../../../server/components/store/helper');
var validationComponent = require('../../../../server/components/validation');
var request = require('supertest');
var q = require('q');

describe('fs api', function () {

    describe('GET /api/fs route', function() {


        it('should respond with JSON array', function(done) {

            spyOn(validationComponent, "validateWorkingDir");

            spyOn(helper, "mkdir").and.callFake(function() {
                var deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            });

            spyOn(Store, "getWorkspaces").and.callFake(function() {
                var deferred = q.defer();
                deferred.resolve(['a','b','c']);
                return deferred.promise;
            });

            var app = require('../../../../server/app');

            request(app)
                .get('/api/fs')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) {
                        done.fail(err);
                    } else {
                        expect(res.body.workspaces).toEqual(['a', 'b', 'c']);
                        done();
                    }
                });
        });
    });
});

