export const successResponse = (res, data, message = 'Success') => {
  return res.json({
    success: true,
    message,
    data
  });
};

export const paginatedResponse = (res, data, meta, message = 'Success') => {
  return res.json({
    success: true,
    message,
    data,
    meta
  });
};