import models from '../models/index';

const { TimeSlot } = models;
/**
 * Lấy tất cả các khung thời gian.
 * @returns {Promise<Array>} Danh sách tất cả các khung thời gianh.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllTimeslotService = async () => {
  try {
    const timeslots = await TimeSlot.findAll();
    return timeslots;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khung thời gian:', error);
    throw error;
  }
};

/**
 * Lấy thông tin một khung thời gian theo ID.
 * @param {string} id - ID của khung thời gian.
 * @returns {Promise<Object|null>} khung thời gian tìm thấy hoặc null nếu không tìm thấy.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getTimeslotByIdService = async (id) => {
  try {
    const timeslots = await TimeSlot.findByPk(id);
    return timeslots;
  } catch (error) {
    console.error(`Lỗi khi lấy khung thời gian với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo một khung thời gian mới.
 * @param {Object} timeslotData - Dữ liệu của khung thời gian mới.
 * @returns {Promise<Object>} khung thời gian đã được tạo.
 * @throws {Error} Nếu có lỗi khi tạo khung thời gian.
 */
export const createTimeslotService = async (timeslotData) => {
  try {
    const timeslots = await TimeSlot.create(timeslotData);
    return timeslots;
  } catch (error) {
    console.error('Lỗi khi tạo khung thời gian:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin một khung thời gian.
 * @param {string} id - ID của khung thời gian cần cập nhật.
 * @param {Object} timeslotData - Dữ liệu cập nhật cho khung thời gian.
 * @returns {Promise<Object>} khung thời gian đã được cập nhật.
 * @throws {Error} Nếu không tìm thấy khung thời gian hoặc có lỗi.
 */
export const updateTimeslotService = async (id, timeslotData) => {
  try {
    const timeslot = await TimeSlot.findByPk(id);
    if (!timeslot) throw new Error("Không tìm thấy khung thời gian");
    return await timeslot.update(timeslotData);
  } catch (error) {
    console.error(`Lỗi khi cập nhật khung thời gian với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa một khung thời gian.
 * @param {string} id - ID của khung thời gian cần xóa.
 * @returns {Promise<Object>} Thông báo xóa thành công.
 * @throws {Error} Nếu không tìm thấy khung thời gian hoặc có lỗi.
 */
export const deleteTimeslotService = async (id) => {
  try {
    const timeslot = await TimeSlot.findByPk(id);
    if (!timeslot) throw new Error("Không tìm thấy khung thời gian");
    await timeslot.destroy();
    return { message: "khung thời gian đã được xóa thành công" };
  } catch (error) {
    console.error(`Lỗi khi xóa khung thời gian với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Nhập dữ liệu khung thời gian từ JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} timeslotsData - Mảng các đối tượng khung thời gian.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importTimeslotsFromJsonService = async (timeslotsData) => {
  try {
    if (!timeslotsData || !Array.isArray(timeslotsData)) {
      throw new Error("Dữ liệu khung thời gian không hợp lệ");
    }
    const results = {
      success: [],
      errors: [],
      total: timeslotsData.length
    };

    // Validate và tạo khung thời gian cho từng item
    for (let i = 0; i < timeslotsData.length; i++) {
      const timeslotData = timeslotsData[i];
      const index = i + 1;

      try {
        // Validate các trường bắt buộc
        if (!timeslotData.slot_id) {
          results.errors.push({
            index: index,
            slot_id: timeslotData.slot_id || 'N/A',
            error: 'Mã khung thời gian là bắt buộc'
          });
          continue;
        }
        if (!timeslotData.start_time) {
          results.errors.push({
            index: index,
            slot_id: timeslotData.slot_id || 'N/A',
            error: 'Thời gian bắt đầu là bắt buộc'
          });
          continue;
        }
        if (!timeslotData.end_time) {
          results.errors.push({
            index: index,
            slot_id: timeslotData.slot_id || 'N/A',
            error: 'Thời gian kết thúc là bắt buộc'
          });
          continue;
        }

        // Clean và format data
        const cleanedData = {
          slot_id: timeslotData.slot_id.toString().trim(),
          slot_name: timeslotData.slot_name ? timeslotData.slot_name.toString().trim() : null,
          start_time: timeslotData.start_time.toString().trim(),
          end_time: timeslotData.end_time.toString().trim(),
          type: timeslotData.type ? timeslotData.type.toString().trim() : null,
          description: timeslotData.description ? timeslotData.description.toString().trim() : null,
          status: timeslotData.status || 'Hoạt động'
        };

        // Validate định dạng thời gian (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(cleanedData.start_time)) {
          results.errors.push({
            index: index,
            slot_id: cleanedData.slot_id,
            error: 'Thời gian bắt đầu phải có định dạng HH:MM'
          });
          continue;
        }
        if (!timeRegex.test(cleanedData.end_time)) {
          results.errors.push({
            index: index,
            slot_id: cleanedData.slot_id,
            error: 'Thời gian kết thúc phải có định dạng HH:MM'
          });
          continue;
        }

        // Validate thời gian bắt đầu phải nhỏ hơn thời gian kết thúc
        const startTime = new Date(`1970-01-01T${cleanedData.start_time}:00`);
        const endTime = new Date(`1970-01-01T${cleanedData.end_time}:00`);
        if (startTime >= endTime) {
          results.errors.push({
            index: index,
            slot_id: cleanedData.slot_id,
            error: 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc'
          });
          continue;
        }

        // Kiểm tra slot_id đã tồn tại chưa
        const existingTimeslot = await TimeSlot.findOne({
          where: { slot_id: cleanedData.slot_id }
        });
        if (existingTimeslot) {
          results.errors.push({
            index: index,
            slot_id: cleanedData.slot_id,
            error: 'Mã khung thời gian đã tồn tại'
          });
          continue;
        }

        // Kiểm tra trùng lặp thời gian
        const duplicateTime = await TimeSlot.findOne({
          where: {
            start_time: cleanedData.start_time,
            end_time: cleanedData.end_time
          }
        });
        if (duplicateTime) {
          results.errors.push({
            index: index,
            slot_id: cleanedData.slot_id,
            error: 'Khung thời gian này đã tồn tại'
          });
          continue;
        }

        // Tạo TimeSlot mới
        const newTimeslot = await TimeSlot.create(cleanedData);
        results.success.push(newTimeslot);

      } catch (error) {
        results.errors.push({
          index: index,
          slot_id: timeslotData.slot_id || 'N/A',
          error: error.message || 'Lỗi không xác định'
        });
      }
    }
    return results;
  } catch (error) {
    console.error('Lỗi khi nhập khung thời gian từ JSON:', error);
    throw error;
  }
};

