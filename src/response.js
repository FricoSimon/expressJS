const responseGet = (statusCode, message, page, size, data, res) => {
    res.status(statusCode).json({
        status: statusCode,
        message: message,
        page: page,
        size: size,
        data: data,
    })
}

const responsePost = (statusCode, message, data, res) => {
    res.status(statusCode).json({
        status: statusCode,
        message: message,
        data: data,
    })
}

const responseError = (statusCode, message, err, res) => {
    res.status(statusCode).json({
        status: statusCode,
        message: message,
        error: err,
    })
}

module.exports = { responseGet, responsePost, responseError };
