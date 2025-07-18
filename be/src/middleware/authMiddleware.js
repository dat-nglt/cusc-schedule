import jwt from "jsonwebtoken";
import { APIResponse } from "../utils/APIResponse.js";
import { findExistsUserByIdService } from "../services/userService.js"; // Đảm bảo đường dẫn này đúng
import logger from "../utils/logger.js";

/**
 * Middleware xác thực người dùng dựa trên JWT trong HTTP-Only Cookie.
 * Kiểm tra sự tồn tại và tính hợp lệ của token trong cookie 'jwt'.
 * Gán `req.userId`, `req.userRole`, và `req.userInfo` nếu xác thực thành công.
 *
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @param {Function} next - Hàm middleware tiếp theo.
 */
const authMiddleware = async (req, res, next) => {
  logger.info("-----------------------------------------------------");

  logger.info(req.cookies.accessToken);

  logger.info("-----------------------------------------------------");

  const accessToken = req.cookies.accessToken;

  // Kiểm tra nếu token không tồn tại trong cookie
  if (!accessToken) {
    return APIResponse(
      res,
      401,
      "Truy cập bị từ chối. Không tìm thấy token xác thực."
    );
  }

  try {
    // Xác minh token sử dụng JWT_SECRET từ biến môi trường
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Xác minh người dùng vẫn còn tồn tại trong cơ sở dữ liệu
    // decoded.id được lấy từ payload của JWT (thường là ID người dùng)
    const userInfo = await findExistsUserByIdService(decoded.id);
    if (!userInfo) {
      // Nếu người dùng không được tìm thấy (ví dụ: đã bị xóa)
      return APIResponse(res, 401, "Người dùng không tồn tại hoặc đã bị xóa.");
    }

    // Gán thông tin người dùng vào đối tượng request để các middleware/route tiếp theo có thể sử dụng
    req.user = userInfo; // Chứa toàn bộ thông tin người dùng (user object và role, model)

    logger.info("-----------------------------------------------------");

    logger.info(
      `Người dùng đã xác thực: ID=${req.userId}, Vai trò=${req.userRole}`
    );

    logger.info("-----------------------------------------------------");
    next(); // Chuyển sang middleware/route tiếp theo
  } catch (error) {
    // Xử lý các lỗi liên quan đến xác minh token
    console.error("Lỗi xác minh token:", error);

    if (error.name === "TokenExpiredError") {
      // Xóa cookie nếu nó đã hết hạn để yêu cầu đăng nhập lại
      res.clearCookie("accessToken", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
      return APIResponse(
        res,
        401,
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
      );
    } else if (error.name === "JsonWebTokenError") {
      // Lỗi khi token không hợp lệ (ví dụ: sai định dạng, sai chữ ký)
      res.clearCookie("accessToken", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
      return APIResponse(res, 401, "Token không hợp lệ.");
    } else if (error.name === "NotBeforeError") {
      // Lỗi khi token chưa có hiệu lực
      return APIResponse(res, 401, "Token chưa có hiệu lực.");
    } else {
      // Các lỗi xác thực khác
      return APIResponse(res, 401, "Xác thực thất bại.");
    }
  }
};

/**
 * Middleware kết hợp cả xác thực (authentication) và phân quyền (authorization) trong một bước.
 * Tiện lợi khi bạn muốn thực hiện cả hai kiểm tra cùng lúc.
 *
 * @param {Array<string>} allowedRoles - Mảng các vai trò được phép truy cập.
 * @returns {Function} Hàm middleware Express.
 */
export const authenticateAndAuthorize = (allowedRoles) => {
  return async (req, res, next) => {
    // Bước 1: Xác thực (Authentication) - Lấy token từ cookie
    const accessToken = req.cookies.accessToken; // Thay đổi từ header sang cookie

    if (!accessToken) {
      return APIResponse(
        res,
        401,
        "Truy cập bị từ chối. Không tìm thấy accessToken xác thực."
      );
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

      const userInfo = await findExistsUserByIdService(decoded.id);
      if (!userInfo) {
        return APIResponse(
          res,
          401,
          "Người dùng không tồn tại hoặc đã bị xóa."
        );
      }

      req.userId = decoded.id;
      req.userRole = decoded.role || userInfo.role;
      req.userInfo = userInfo;

      // Bước 2: Phân quyền (Authorization)
      const rolesArray = Array.isArray(allowedRoles)
        ? allowedRoles
        : [allowedRoles];

      if (!rolesArray.includes(req.userRole)) {
        return APIResponse(
          res,
          403,
          `Truy cập bị từ chối. Yêu cầu vai trò: ${rolesArray.join(
            " hoặc "
          )}, nhưng người dùng có vai trò: ${req.userRole}`
        );
      }

      next(); // Xác thực và phân quyền thành công, chuyển sang middleware/route tiếp theo
    } catch (error) {
      // Xử lý lỗi xác thực và phân quyền
      console.error("Lỗi xác thực hoặc phân quyền:", error);
      if (error.name === "TokenExpiredError") {
        res.clearCookie("accessToken", {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
        });
        return APIResponse(res, 401, "Token đã hết hạn.");
      } else if (error.name === "JsonWebTokenError") {
        res.clearCookie("accessToken", {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
        });
        return APIResponse(res, 401, "Token không hợp lệ.");
      } else {
        return APIResponse(res, 401, "Xác thực thất bại.");
      }
    }
  };
};

export default authMiddleware;
