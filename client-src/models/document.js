const server = require('../server');
const catNap = require('cat-nap');

class Document extends catNap.Model {}

Document.schema = new catNap.Schema({
  id: { type: Number, primary: true, validators: ['required'] },
  problem_id: { type: Number, validators: ['required'] },
  role: { type: String, validators: ['required'] },
  finalResult: { type: String }
});

class DocumentEndpoint extends catNap.Endpoint {}

DocumentEndpoint.model = Document;
DocumentEndpoint.server = server;
DocumentEndpoint.path = '/api/documents';

module.exports = DocumentEndpoint;