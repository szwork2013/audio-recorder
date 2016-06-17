const server = require('../server');
const catNap = require('cat-nap');
const DocumentEndpoint = require('./document');

class Problem extends catNap.Model {}

Problem.schema = new catNap.Schema({
  id: { type: Number, primary: true, validators: ['required'] },
  user_id: { type: Number, validators: ['required'] },
  parent_id: { type: Number },
  title: { type: String, validators: ['required'] },
  description: { type: String, validators: ['required'] }
});

class ProblemEndpoint extends catNap.Endpoint {
  getRelated() {
    return Promise.props({
      documents: DocumentEndpoint.find()
    });
  }
}

ProblemEndpoint.model = Problem;
ProblemEndpoint.server = server;
ProblemEndpoint.path = '/api/problems';

module.exports = ProblemEndpoint;