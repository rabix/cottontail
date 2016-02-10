var Store = require('../../../../server/components/store');
var helper = require('../../../../server/components/store/helper');
var validationComponent = require('../../../../server/components/validation');
var request = require('supertest');
var q = require('q');

describe('fs api', function () {

    var app;

    beforeEach(function() {
        spyOn(validationComponent, "validateWorkingDir");

        spyOn(helper, "mkdir").and.callFake(function() {
            var deferred = q.defer();
            deferred.resolve();
            return deferred.promise;
        });

        app = require('../../../../server/app');
    });

    describe('GET /api/fs route', function() {

        it('should respond with JSON array containing workspaces when getWorkspaces succeeds', function(done) {
            spyOn(Store, "getWorkspaces").and.callFake(function() {
                var deferred = q.defer();
                deferred.resolve(['a','b','c']);
                return deferred.promise;
            });

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

        it('should respond error message when getWorkspaces fails', function(done) {
            spyOn(Store, "getWorkspaces").and.callFake(function() {
                var deferred = q.defer();
                deferred.reject('failed message');
                return deferred.promise;
            });

            request(app)
                .get('/api/fs')
                .expect(500)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) {
                        done.fail(err);
                    } else {
                        expect(res.body.error).toEqual('failed message');
                        done();
                    }
                });
        });
    });

    describe('GET /api/fs/workspace1 route', function() {

        it('should respond with JSON array containing files when getFiles succeeds', function(done) {
            spyOn(Store, "getFiles").and.callFake(function() {
                var deferred = q.defer();
                deferred.resolve(['file1','file2','file3']);
                return deferred.promise;
            });

            request(app)
                .get('/api/fs/workspace1')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) {
                        done.fail(err);
                    } else {
                        expect(res.body.files).toEqual(['file1','file2','file3']);
                        done();
                    }
                });
        });

        it('should respond error message when getFiles fails', function(done) {
            spyOn(Store, "getFiles").and.callFake(function() {
                var deferred = q.defer();
                deferred.reject('failed message');
                return deferred.promise;
            });

            request(app)
                .get('/api/fs/workspace1')
                .expect(500)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) {
                        done.fail(err);
                    } else {
                        expect(res.body.error).toEqual('failed message');
                        done();
                    }
                });
        });
    });

    describe('POST /api/fs/workspace1 route', function() {

        it('should respond with status 200 when createWorkspace succeeds', function(done) {
            spyOn(Store, "createWorkspace").and.callFake(function() {
                var deferred = q.defer();
                deferred.resolve(true);
                return deferred.promise;
            });

            request(app)
                .post('/api/fs/workspace1')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) {
                        done.fail(err);
                    } else {
                        expect(res.body.message).toEqual('Workspace successfully created.');
                        done();
                    }
                });
        });

        it('should respond with status 500 when createWorkspace fails', function(done) {
            spyOn(Store, "createWorkspace").and.callFake(function() {
                var deferred = q.defer();
                deferred.reject('fail message');
                return deferred.promise;
            });

            request(app)
                .post('/api/fs/workspace1')
                .expect(500)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) {
                        done.fail(err);
                    } else {
                        expect(res.body.error).toEqual('fail message');
                        done();
                    }
                });
        });
    });
});

