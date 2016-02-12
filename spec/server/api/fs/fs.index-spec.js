var Store = require('../../../../server/components/store');
var helper = require('../../../../server/components/store/helper');
var validationComponent = require('../../../../server/components/validation');
var request = require('supertest');
var q = require('q');

var requestApp = function(app) {
    var appInstance = request(app);
    var requestResult = null;

    return {
        get: function(url) {
            requestResult = appInstance.get(url);
            return this;
        },
        post: function(url) {
            requestResult = appInstance.post(url);
            return this;
        },
        put: function(url) {
            requestResult = appInstance.put(url);
            return this;
        },
        expectStatusTypeAndAssertResponse: function(expectedStatus, type, responseAssertion, done) {
            requestResult.expect(expectedStatus)
                .expect('Content-Type', type)
                .end(function(err, res) {
                    if (err) {
                        done.fail(err);
                    } else {
                        responseAssertion(res);
                        done();
                    }
                });
            return this;
        }
    }
};

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

            requestApp(app)
                .get('/api/fs')
                .expectStatusTypeAndAssertResponse(200, /json/, function(res) {
                    expect(res.body.workspaces).toEqual(['a', 'b', 'c']);
                }, done);
        });

        it('should respond error message when getWorkspaces fails', function(done) {
            spyOn(Store, "getWorkspaces").and.callFake(function() {
                var deferred = q.defer();
                deferred.reject('failed message');
                return deferred.promise;
            });

            requestApp(app)
                .get('/api/fs')
                .expectStatusTypeAndAssertResponse(500, /json/, function(res) {
                    expect(res.body.error).toEqual('failed message');
                }, done);
        });
    });

    describe('GET /api/fs/workspace1 route', function() {
        it('should respond with JSON array containing files when getFiles succeeds', function(done) {
            spyOn(Store, "getFiles").and.callFake(function() {
                var deferred = q.defer();
                deferred.resolve(['file1','file2','file3']);
                return deferred.promise;
            });

            requestApp(app)
                .get('/api/fs/workspace1')
                .expectStatusTypeAndAssertResponse(200, /json/, function(res) {
                    expect(res.body.files).toEqual(['file1','file2','file3']);
                }, done);
        });

        it('should respond error message when getFiles fails', function(done) {
            spyOn(Store, "getFiles").and.callFake(function() {
                var deferred = q.defer();
                deferred.reject('failed message');
                return deferred.promise;
            });

            requestApp(app)
                .get('/api/fs/workspace1')
                .expectStatusTypeAndAssertResponse(500, /json/, function(res) {
                    expect(res.body.error).toEqual('failed message');
                }, done);
        });
    });

    describe('POST /api/fs/workspace1 route', function() {
        it('should respond with status 200 when createWorkspace succeeds', function(done) {
            spyOn(Store, "createWorkspace").and.callFake(function() {
                var deferred = q.defer();
                deferred.resolve(true);
                return deferred.promise;
            });

            requestApp(app)
                .post('/api/fs/workspace1')
                .expectStatusTypeAndAssertResponse(200, /json/, function(res) {
                    expect(res.body.message).toEqual('Workspace successfully created.');
                }, done);
        });

        it('should respond with status 500 when createWorkspace fails', function(done) {
            spyOn(Store, "createWorkspace").and.callFake(function() {
                var deferred = q.defer();
                deferred.reject('fail message');
                return deferred.promise;
            });

            requestApp(app)
                .post('/api/fs/workspace1')
                .expectStatusTypeAndAssertResponse(500, /json/, function(res) {
                    expect(res.body.error).toEqual('fail message');
                }, done);
        });
    });

    describe('GET /workspace/file route', function() {
        it('should respond with status 200 when getFile succeeds', function(done) {
            spyOn(Store, "getFile").and.callFake(function() {
                var deferred = q.defer();
                deferred.resolve({name: "fakeFile"});
                return deferred.promise;
            });

            requestApp(app)
                .get('/api/fs/workspace/file')
                .expectStatusTypeAndAssertResponse(200, /json/, function(res) {
                    expect(res.body.content).toEqual({name: "fakeFile"});
                }, done);
        });

        it('should respond with status 500 when getFile fails', function(done) {
            spyOn(Store, "getFile").and.callFake(function() {
                var deferred = q.defer();
                deferred.reject('error message');
                return deferred.promise;
            });

            requestApp(app)
                .get('/api/fs/workspace/file')
                .expectStatusTypeAndAssertResponse(500, /json/, function(res) {
                    expect(res.body.error).toEqual('error message');
                }, done);
        });
    });

    describe('POST /workspace/file route', function() {
        it('should respond with status 200 when createFile succeeds', function(done) {
            spyOn(Store, "createFile").and.callFake(function() {
                var deferred = q.defer();
                deferred.resolve({name: "fakeFile"});
                return deferred.promise;
            });

            requestApp(app)
                .post('/api/fs/workspace/file')
                .expectStatusTypeAndAssertResponse(200, /json/, function(res) {
                    expect(res.body.message).toEqual('File created successfully.')
                    expect(res.body.content).toEqual({name: "fakeFile"});
                }, done);
        });

        it('should respond with status 500 when createFile fails', function(done) {
            spyOn(Store, "createFile").and.callFake(function() {
                var deferred = q.defer();
                deferred.reject('error message');
                return deferred.promise;
            });

            requestApp(app)
                .post('/api/fs/workspace/file')
                .expectStatusTypeAndAssertResponse(500, /json/, function(res) {
                    expect(res.body.error).toEqual('error message');
                }, done);
        });
    });

    describe('PUT /workspace/file route', function() {
        it('should respond with status 200 when writeFile succeeds', function(done) {
            spyOn(Store, "writeFile").and.callFake(function() {
                var deferred = q.defer();
                deferred.resolve({name: "fakeFile"});
                return deferred.promise;
            });

            requestApp(app)
                .put('/api/fs/workspace/file')
                .expectStatusTypeAndAssertResponse(200, /json/, function(res) {
                    expect(res.body.message).toEqual('File updated successfully.')
                    expect(res.body.content).toEqual({name: "fakeFile"});
                }, done);
        });

        it('should respond with status 500 when createFile fails', function(done) {
            spyOn(Store, "writeFile").and.callFake(function() {
                var deferred = q.defer();
                deferred.reject('error message');
                return deferred.promise;
            });

            requestApp(app)
                .put('/api/fs/workspace/file')
                .expectStatusTypeAndAssertResponse(500, /json/, function(res) {
                    expect(res.body.error).toEqual('error message');
                }, done);
        });
    });
});

