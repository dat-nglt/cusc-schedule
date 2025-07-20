/**
 * Chuẩn hóa cấu trúc phản hồi API cho tất cả các request.
 * Tùy thuộc vào statusCode, nó sẽ tự động đặt trạng thái là 'success' hoặc 'error'.
 *
 * @param {Object} res - Đối tượng Response của Express.
 * @param {number} statusCode - Mã trạng thái HTTP của phản hồi (ví dụ: 200, 201, 400, 404, 500).
 * @param {any} [data] - Dữ liệu trả về cho client. Có thể là một đối tượng, mảng, chuỗi, hoặc null.
 * @param {string} [message] - Tin nhắn mô tả kết quả của request.
 * @returns {Object} Đối tượng response của Express với cấu trúc JSON đã được chuẩn hóa.
 */
export const APIResponse = (res, statusCode, data = {}, message = null) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300 ? true : false,
    message: message,
    data: data,
  };
  return res.status(statusCode).json(response);
};

/**
 * Tạo một phản hồi thành công (HTTP 200 OK).
 *
 * @param {Object} res - Đối tượng Response của Express.
 * @param {any} data - Dữ liệu trả về cho client.
 * @param {string} [message='Thành công'] - Tin nhắn mô tả thành công.
 * @returns {Object} Đối tượng response của Express.
 */
export const successResponse = (res, data, message = "Thành công") => {
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};

/**
 * Tạo một phản hồi lỗi chung (mặc định HTTP 400 Bad Request).
 *
 * @param {Object} res - Đối tượng Response của Express.
 * @param {string} [message='Đã xảy ra lỗi'] - Tin nhắn mô tả lỗi.
 * @param {number} [statusCode=400] - Mã trạng thái HTTP của lỗi.
 * @returns {Object} Đối tượng response của Express.
 */
export const errorResponse = (
  res,
  message = "Đã xảy ra lỗi",
  statusCode = 400
) => {
  return res.status(statusCode).json({
    status: "error",
    message,
  });
};

/**
 * Tạo một phản hồi lỗi khi không tìm thấy tài nguyên (HTTP 404 Not Found).
 *
 * @param {Object} res - Đối tượng Response của Express.
 * @param {string} [message='Không tìm thấy tài nguyên'] - Tin nhắn mô tả lỗi không tìm thấy.
 * @returns {Object} Đối tượng response của Express.
 */
export const notFoundResponse = (
  res,
  message = "Không tìm thấy tài nguyên"
) => {
  return res.status(404).json({
    status: "error",
    message,
  });
};

/**
 * Tạo một phản hồi lỗi xác thực (HTTP 422 Unprocessable Entity).
 * Thường dùng khi dữ liệu đầu vào không hợp lệ (validation failed).
 *
 * @param {Object} res - Đối tượng Response của Express.
 * @param {Object|Array} errors - Chi tiết về các lỗi xác thực.
 * @returns {Object} Đối tượng response của Express.
 */
export const validationErrorResponse = (res, errors) => {
  return res.status(422).json({
    status: "error",
    message: "Lỗi xác thực dữ liệu đầu vào.",
    errors,
  });
};
