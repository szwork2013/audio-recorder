const connection = require('../connection');
const Row = require('../row');
const DocumentEvent = require('./documentEvent');
class Document extends Row {

  findEvents() {
    return DocumentEvent.find({
      document_id: this.id
    });
  }

  async fork(problem_id) {
    let newDocument = Object.assign({},this, { problem_id });
    delete newDocument.id;
    newDocument = await this.insert(newDocument);

    const events = await this.findEvents();
    await Promise.all(events.map(e => e.fork()));

    return new this(newDocument);
  }

 
}

module.exports = Document;