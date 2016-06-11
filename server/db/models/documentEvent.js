const connection = require('../connection');
const Row = require('../row');

class DocumentEvent extends Row {
  async fork(document_id) {
    let newEvent = Object.assign({},this, { document_id });
    delete newEvent.id;
    newEvent = await this.insert(newEvent);
    return new this(newDocument);
  }
}

module.exports = DocumentEvent;