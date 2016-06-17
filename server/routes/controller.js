class Controller {

  constructor() {}

  regester(name, method) {
    this[name] = (req, res, next) => {
      method(req, res, next)
      .then(result => res.send(result))
      .catch(next);
    }
  }
}

module.exports = Controller;