var storeHelper = require('../../../../server/components/store/helper.js');

describe('validationComponent', function () {

    describe('checkExsits', function () {

        it('should return File doesn\'t exist. if the file can\'t be found', function (done) {

            storeHelper.checkExsits('/home/Abcd123')
                .catch(function(result) {
                    expect(result.message).toBe('File doesn\'t exist.');
                })
                .finally(done);
        });
    });
});