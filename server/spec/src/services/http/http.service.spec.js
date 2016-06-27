var HttpService = require('../../../../src/services/http/http.service');
const Http = require('http');
const Reload = require('require-reload');

const internals = {
    reload: Reload(require),
    payload: '{"mock": "response"}',
    socket: __dirname + '/server.sock',
    emitSymbol: Symbol.for('wreck')
};

describe('httpService', function() {

    describe('getRequest', function() {

        const server = Http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(internals.payload);
        });

        it("should return the body as a JSON object",() => {
            
            server.listen(0, () => {
                HttpService.getRequest('http://localhost:' + server.address().port).then((res) => {
                    expect(res).toEqual(JSON.parse(internals.payload));
                });
            });
        });

    });

});