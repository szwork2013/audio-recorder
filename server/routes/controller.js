class Controller {

  constructor() {}

  regester(name, method) {
    this[name] = (req, res, next) => {
      method(req, res, next)
      .then(result => res.json(result))
      .catch(next);
    }
  }
}

module.exports = Controller;