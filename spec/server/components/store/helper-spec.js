var storeHelper = require('../../../../server/components/store/helper.js');

describe('validationComponent', function () {

    describe('checkExsits', function () {

        it('should return a message (File doesn\'t exist.) if the file can\'t be found', function (done) {
            storeHelper.checkExsits('/home/Abcd123')
                .catch(function(result) {
                    expect(result.message).toBe('File doesn\'t exist.');
                })
                .finally(done);
        });

        it('should return (Path name must be a string) if argument is not a string', function (done) {
            storeHelper.checkExsits(12412313)
                .catch(function(result) {
                    expect(result).toBe('Path name must be a string');
                })
                .finally(done);

            storeHelper.checkExsits(undefined)
                .catch(function(result) {
                    expect(result).toBe('Path name must be a string');
                })
                .finally(done);

            storeHelper.checkExsits(null)
                .catch(function(result) {
                    expect(result).toBe('Path name must be a string');
                })
                .finally(done);
        });
    });

    describe('readFile', function () {

    });
});