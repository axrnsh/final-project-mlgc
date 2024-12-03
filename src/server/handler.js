const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const { storeData } = require('../services/storeData');
const { getHistories } = require('../services/storeData');

async function postPredictHandler(request, h) {
    const { image } = request.payload;

    if (image.length > 1000000) {
        const errorResponse = {
            status: 'fail',
            message: 'Payload content length greater than maximum allowed: 1000000'
        };
        return h.response(errorResponse).code(413);
    }

    const { model } = request.server.app;
    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        "id": id,
        "result": label,
        "suggestion": suggestion,
        "createdAt": createdAt
    };

    await storeData(id, data);

    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data
    });
    response.code(201);
    return response;
}

async function getHistoriesHandler(request, h) {
    const result = await getHistories();

    if (result.status === 'fail') {
        const response = h.response({
            status: result.status,
            message: result.message,
        });
        response.code(500);
        return response;
    }

    const response = h.response({
        status: result.status,
        data: result.data,
    });
    response.code(200);
    return response;
}

module.exports = { postPredictHandler, getHistoriesHandler };