const ReactRouter = require('react-router');

const urlFnMaker = urlFrag => {
  return doc => `/${urlFrag}/${doc.id}`
}

const constructorToEndpoint = new Map();
constructorToEndpoint.set(
  require('./models/problem'),
  urlFnMaker('problems')
);

constructorToEndpoint.set(
  require('./models/user'),
  urlFnMaker('users')
);

module.exports = {
  go(path) {
    ReactRouter.browserHistory.push('#' + path);
  },
  urlFor(model) {
    const urlBuilder = constructorToEndpoint
      .get(model.constructor)
    if(urlBuilder) {
      return urlBuilder(model);
    }
  },
  goTo(model) {
    const url = this.urlFor(model);
    if(url) {
      this.go(url);
    }
  }
};