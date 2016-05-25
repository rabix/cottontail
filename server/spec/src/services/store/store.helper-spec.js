var storeService = require('../../../../src/services/store/store.service');

describe('storeService', function() {

    describe('checkExsits', function() {

        it('should return a message (File doesn\'t exist.) if the file can\'t be found', function(done) {
            storeService.checkExsits('/home/Abcd123')
                .catch(function(result) {
                    expect(result.status).toBe(404);
                    expect(result.message).toBe('File doesn\'t exist.');
                })
                .finally(done);
        });

        it('should return (Path name must be a string) if argument is a number', function(done) {
            storeService.checkExsits(12412313)
                .catch(function(error) {
                    expect(error).toBeDefined();
                    expect(error.message).toBe('Path name must be a string');
                })
                .finally(done);
        });

        it('should return (Path name must be a string) if argument is null', function(done) {
            storeService.checkExsits(null)
                .catch(function(error) {
                    expect(error).toBeDefined();
                    expect(error.message).toBe('Path name must be a string');
                })
                .finally(done);
        });

        it('should return (Path name must be a string) if argument is undefined', function(done) {
            storeService.checkExsits(undefined)
                .catch(function(error) {
                    expect(error).toBeDefined();
                    expect(error.message).toBe('Path name must be a string');
                })
                .finally(done);
        });
    });

    describe('readFile', function() {

        it('should return a bad request error if argument is falsy', function(done) {
            storeService.readFile('')
                .catch(function(error) {
                    expect(error.status).toBe(400);
                    expect(error.message).toBe('File path not specified');
                })
                .finally(done);
        });

        it('should return an error for nonexistent file', function(done) {
            storeService.readFile('does-not-exist.txt')
                .catch(function(error) {
                    expect(error.status).toBe(404);
                    expect(error.message).toBe('File doesn\'t exist.');
                })
                .finally(done);
        });

        it('should read file contents and return properly formatted answer', function(done) {
            storeService.readFile('spec/test-data/test.txt')
                .then(function(result) {
                    expect(result).toBeDefined();
                    expect(result.type).toBe('.txt');
                    expect(result.content).toBe('these are some file contents');
                    expect(result.relativePath).toBe('spec/test-data/test.txt');
                })
                .catch(function(error) {
                    expect(error).toBeUndefined();
                })
                .finally(done);
        });

    });

    describe('readDir', function() {

        it('should read directory contents', function(done) {
            storeService.readDir('spec/test-data')
                .then(function(result) {
                    expect(result).toBeDefined();
                    expect(result.length).toBeGreaterThan(0);
                })
                .catch(function(error) {
                    expect(error).toBeUndefined();
                })
                .finally(done);
        });
    });

    describe('createFile', function() {

        it('should not create a file over an existing one', function(done) {
            storeService.createFile('spec/test-data/test.txt')
                .then(function(result) {
                    expect(result).toBeUndefined();
                })
                .catch(function(error) {
                    expect(error).toBeDefined();
                    expect(error.status).toBe(403);
                    expect(error.message).toBe('Cannot overwrite existing file');
                })
                .finally(done);
        });

        it('should return a bad request error if argument is falsy', function(done) {
            storeService.overwrite('')
                .then(function(result) {
                    expect(result).toBeUndefined();
                })
                .catch(function(error) {
                    expect(error.status).toBe(400);
                    expect(error.message).toBe('File path not specified');
                })
                .finally(done);
        });
    });

    describe('overwrite', function() {
        it('should return a bad request error if argument is falsy', function(done) {
            storeService.overwrite('')
                .then(function(result) {
                    expect(result).toBeUndefined();
                })
                .catch(function(error) {
                    expect(error.status).toBe(400);
                    expect(error.message).toBe('File path not specified');
                })
                .finally(done);
        });
    });

    describe('readDir', function() {
        it('should read contents of root if not provided argument', function(done) {
            storeService.readDir()
                .then(function(result) {
                    expect(result).toBeDefined();
                    expect(result.length).toBeGreaterThan(0);
                })
                .catch(function(error) {
                    expect(error).toBeUndefined();
                })
                .finally(done);
        });

        it('should read contents of subdirectory', function(done) {
            storeService.readDir('spec/test-data/directory-with-two-files')
                .then(function(result) {
                    expect(result).toBeDefined();
                    expect(result.length).toBe(2);
                })
                .catch(function(error) {
                    expect(error).toBeUndefined();
                })
                .finally(done);
        })
    })
});