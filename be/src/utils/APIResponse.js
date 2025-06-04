export const APIResponse = (res, statusCode, data, message) => {
  const response = {
    status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error'
  };

  if (typeof data === 'string') {
    response.message = data;
    if (message) response.data = message;
  } else {
    if (message) response.message = message;
    if (data) response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const successResponse = (res, data, message = 'Success') => {
  return res.status(200).json({
    status: 'success',
    message,
    data,
  });
};

export const errorResponse = (res, message = 'Error', statusCode = 400) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
  });
};

export const notFoundResponse = (res, message = 'Resource not found') => {
  return res.status(404).json({
    status: 'error',
    message,
  });
};

export const validationErrorResponse = (res, errors) => {
  return res.status(422).json({
    status: 'error',
    message: 'Validation Error',
    errors,
  });
};