const connection = require('../connection');
const Document = require('./Document');
const Row = require('../row');

class Problem extends Row{

  findDocuments() {
    return Document.find({
      problem_id: this.id
    });
  }

  async fork(user_id) {
    let newProblem = Object.assign({}, this, { user_id });

    newProblem.parentId = newProblem.id;
    delete newProblem.id;
 
    newProblem = this.constructor.insert(newProblem);

    const documents = await this.findDocuments();
    await Promise.all(documents.map(d => d.fork(newProblem.id)));

    return new this(newProblem);
  }

  static create(obj) {
    return super.create(obj)
      .then(problem => {
        return Promise.all([
          Document.create({ problem_id: problem.id, role: 'test' }),
          Document.create({ problem_id: problem.id, role: 'code' })
        ])
      });
  }
}

module.exports = Problem;