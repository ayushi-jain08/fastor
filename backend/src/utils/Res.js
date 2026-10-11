const { StatusCodes } = require('./statusCodes');


class Res {
  static success(res, data = null, message = 'Success', status = StatusCodes.OK) {
    return res.status(status).json({ success: true, message, ...(data !== null && { data }) });
  }

  static created(res, data = null, message = 'Created') {
    return Res.success(res, data, message, StatusCodes.CREATED);
  }

  static error(res, status = StatusCodes.INTERNAL_SERVER_ERROR, message = 'Internal server error', errors) {
    return res.status(status).json({ success: false, message, ...(errors && { errors }) });
  }
}

module.exports = Res;
