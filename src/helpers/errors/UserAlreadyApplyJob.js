const BaseError = require("./BaseError");

class UserAlreadyApplyJob extends BaseError {
  constructor() {
    super(`you already applied to this job `);
    this.statusCode = 422;
  }
}

module.exports = UserAlreadyApplyJob;
