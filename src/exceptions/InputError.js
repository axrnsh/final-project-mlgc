const ClientError = require("../exceptions/ClientError");

class InputError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 400;
    }
}

module.exports = InputError;