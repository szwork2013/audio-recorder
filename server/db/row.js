const connection = require('./connection');
const _ = require('lodash');

const symbols = {
  original: Symbol('original')
}

class Row {
  constructor(obj) {
    this[symbols.original] = obj;
    Object.assign(this, obj);
  }

  update() {
    if(!this.validate()) {
      return Promise.reject(new Error('Validation error'));
    }
    return connection
      .update(this.diff)
      .where(this.indentityQuery)
      .return(Object.keys(this));
  }

  validate() {
    return this.constructor.validate(this.diff, this);
  }

  remove() {
    return connection(this.tableName)
      .delete(this.indentityQuery);
  }

  hasChanged(path) {
    return !!this.diff[path];
  }

  toObject(exceptions) {
    const blacklist = _.difference(this.blacklist, exceptions);
    return _.omit(this, blacklist);
  }

  toJSON() {
    return JSON.stringify(this.toObject());
  }

  get blacklist() {
    return [];
  }

  get indentityQuery() {
    return { id: this.id };
  }

  get tableName() {
    return this.constructor.name
  }

  get diff() {
    return this.dirtyPaths.reduce((acc, current) => {
      acc[current] = this[current];
      return acc;
    }, {});
  }

  get dirtyPaths() {
    return this.newPaths.concat(this.changedPaths);
  }

  get newPaths() {
    return _.difference(
      Object.keys(this),
      Object.keys(this[symbols.original])
    );
  }

  get changedPaths() {
    return Object.keys(this)
      .map(key => {
        return { key, val: this[key] };
      })
      .filter(keyVal => { return this[symbols.original][valTuple.key] !== this[valTuple.key]})
      .map(keyVal => keyVal.key);
  }

  static get tableName() {
    return this.name.toLowerCase();
  }

  static async find(query, modifySql) {
    let docs = connection
      .select('*')
      .from(this.tableName)
      .where(query);

    if(modifySql) {
      docs = modifySql(docs)
    }

    return docs.map(d => new this(d));
  }

  static findOne(query) {
    return this.find(query, (chain) => {
      return chain.limit(1);
    })
    .then(users => users[0]);
  }

  static async findById(id) {
    const docs = await this.find({ id });
    return docs[0];

  }

  static async insert(obj) {
    const docs = await connection
      .insert(obj)
      .into(this.tableName)
      .returning(Object.keys(obj).concat(['id']));

    return docs[0];
  }

  static validate(diff, obj, checks=[]) {
    return checks.filter(check => !check.check).length
  }

  static async create(obj) {
    if(this.validate(obj, obj)) {
      return Promise.reject(new Error('validation error'));
    }
    const doc = await this.insert(obj);
    return new this(doc);
  }
}

module.exports = Row;