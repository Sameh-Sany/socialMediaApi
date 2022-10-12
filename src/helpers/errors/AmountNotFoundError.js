const BaseError = require("./BaseError");

class AmountNotFoundError extends BaseError {
  constructor() {
    super(` Amount was not found.`);
    this.statusCode = 404;
    this.errors = [
      {
        msg: `Your balance is currently not enough to this transaction`,
      },
    ];
  }
}

module.exports = AmountNotFoundError;
