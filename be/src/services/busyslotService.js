import models from "../models/index.js";

const { sequelize, BusySlot, Lecturer } = models;

/**
 * Lấy tất cả các khe thời gian bận.
 * @returns {Promise<Array>} Danh sách tất cả các khe thời gian bận.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllBusySlotsService = async () => {
  try {
    const busySlots = await BusySlot.findAll();
    return busySlots;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khe thời gian bận:", error);
    throw error;
  }
};

/**
 * Lấy thông tin một khe thời gian bận theo ID.
 * @param {string} id - ID của khe thời gian bận.
 * @returns {Promise<Object|null>} Khe thời gian bận tìm thấy hoặc null nếu không tìm thấy.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getBusySlotByIdService = async (id) => {
  try {
    const busySlot = await BusySlot.findByPk(id);
    return busySlot;
  } catch (error) {
    console.error(`Lỗi khi lấy khe thời gian bận với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo một khe thời gian bận mới.
 * @param {Object} busySlotData - Dữ liệu của khe thời gian bận mới.
 * @returns {Promise<Object>} Khe thời gian bận đã được tạo.
 * @throws {Error} Nếu có lỗi khi tạo khe thời gian bận.
 */
export const createBusySlotService = async (busySlotData) => {
  try {
    const busySlot = await BusySlot.create(busySlotData);
    return busySlot;
  } catch (error) {
    console.error("Lỗi khi tạo khe thời gian bận:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin một khe thời gian bận.
 * @param {string} id - ID của khe thời gian bận cần cập nhật.
 * @param {Object} busySlotData - Dữ liệu cập nhật cho khe thời gian bận.
 * @returns {Promise<Object>} Khe thời gian bận đã được cập nhật.
 * @throws {Error} Nếu không tìm thấy khe thời gian bận hoặc có lỗi.
 */
export const updateBusySlotService = async (id, busySlotData) => {
  try {
    const busySlot = await BusySlot.findByPk(id);
    if (!busySlot) throw new Error("Không tìm thấy khe thời gian bận");
    return await busySlot.update(busySlotData);
  } catch (error) {
    console.error(`Lỗi khi cập nhật khe thời gian bận với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa một khe thời gian bận.
 * @param {string} id - ID của khe thời gian bận cần xóa.
 * @returns {Promise<Object>} Thông báo xóa thành công.
 * @throws {Error} Nếu không tìm thấy khe thời gian bận hoặc có lỗi.
 */
export const deleteBusySlotService = async (id) => {
  try {
    const busySlot = await BusySlot.findByPk(id);
    if (!busySlot) throw new Error("Không tìm thấy khe thời gian bận");
    await busySlot.destroy();
    return { message: "Khe thời gian bận đã được xóa thành công" };
  } catch (error) {
    console.error(`Lỗi khi xóa khe thời gian bận với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Nhập dữ liệu khe thời gian bận từ JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} busySlotsData - Mảng các đối tượng khe thời gian bận.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importBusySlotsFromJSONService = async (busySlotsData) => {
  try {
    if (!busySlotsData || !Array.isArray(busySlotsData)) {
      throw new Error("Dữ liệu khe thời gian bận không hợp lệ");
    }

    const results = {
      success: [],
      errors: [],
      total: busySlotsData.length,
    };

    // Duyệt qua từng item để validate và tạo khe thời gian bận
    for (let i = 0; i < busySlotsData.length; i++) {
      const busySlotData = busySlotsData[i];
      const index = i + 1;

      try {
        // Validate các trường bắt buộc
        if (!busySlotData.lecturer_id) {
          results.errors.push({
            index: index,
            lecturer_id: busySlotData.lecturer_id || "N/A",
            error: "Mã giảng viên là bắt buộc",
          });
          continue;
        }

        if (!busySlotData.day) {
          results.errors.push({
            index: index,
            lecturer_id: busySlotData.lecturer_id || "N/A",
            error: "Ngày trong tuần là bắt buộc",
          });
          continue;
        }

        // Làm sạch và định dạng dữ liệu
        const cleanedData = {
          lecturer_id: busySlotData.lecturer_id.toString().trim(),
          slot_id: busySlotData.slot_id
            ? busySlotData.slot_id.toString().trim()
            : null,
          day: busySlotData.day.toString().trim(),
        };

        // Validate ngày trong tuần
        const validDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        if (!validDays.includes(cleanedData.day)) {
          results.errors.push({
            index: index,
            lecturer_id: cleanedData.lecturer_id,
            error:
              "Ngày trong tuần không hợp lệ (phải là Mon, Tue, Wed, Thu, Fri, Sat, Sun)",
          });
          continue;
        }

        // Kiểm tra giảng viên có tồn tại không
        const lecturer = await Lecturer.findByPk(cleanedData.lecturer_id);
        if (!lecturer) {
          results.errors.push({
            index: index,
            lecturer_id: cleanedData.lecturer_id,
            error: "Giảng viên không tồn tại",
          });
          continue;
        }

        // Kiểm tra trùng lặp khe thời gian bận
        const existingBusySlot = await BusySlot.findOne({
          where: {
            lecturer_id: cleanedData.lecturer_id,
            slot_id: cleanedData.slot_id,
            day: cleanedData.day,
          },
        });
        if (existingBusySlot) {
          results.errors.push({
            index: index,
            lecturer_id: cleanedData.lecturer_id,
            error: "Khe thời gian bận đã tồn tại cho giảng viên này",
          });
          continue;
        }

        // Tạo BusySlot mới
        const newBusySlot = await BusySlot.create(cleanedData);
        results.success.push(newBusySlot);
      } catch (error) {
        results.errors.push({
          index: index,
          lecturer_id: busySlotData.lecturer_id || "N/A",
          error: error.message || "Lỗi không xác định",
        });
      }
    }
    return results;
  } catch (error) {
    console.error("Lỗi khi nhập khe thời gian bận từ JSON:", error);
    throw error;
  }
};
