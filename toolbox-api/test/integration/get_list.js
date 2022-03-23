// test/integration/get_list.js
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../app');

chai.use(chaiHttp);

const expect = chai.expect;

describe('API REST controller', () => {
    it('should get the list of files', (done) => {
        chai.request(app)
            .get('/files/data')
            .end((err, res) => {
                let data = res.body
                expect(data).to.be.an('array')
                done()
            })
    }).timeout(10000)
});