var validationService = require('../../../../src/services/validation/validation.service');

describe('validationService', function () {

    describe('validateWorkingDir', function () {
        it('should throw an error when the path is empty string', function () {
            var validateWorkingDir = function() {
                validationService.validateWorkingDir('')
            };

            expect(validateWorkingDir).toThrowError('No path argument. You must set the workspace path as an argument.');
        });

        it('should throw an error when the path is undefined', function () {
            var validateWorkingDir = function() {
                validationService.validateWorkingDir(undefined)
            };

            expect(validateWorkingDir).toThrowError('No path argument. You must set the workspace path as an argument.');
        });

        it('should throw an error when the path is doesn\'t eixst', function () {
            var validateWorkingDir = function() {
                validationService.validateWorkingDir('/home/Abcd123')
            };

            expect(validateWorkingDir).toThrowError('ENOENT: no such file or directory, lstat \'/home/Abcd123\'');
        });
    });

});