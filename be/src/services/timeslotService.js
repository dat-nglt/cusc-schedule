import models from '../models/index';

const { TimeSlot } = models;
/**
 * Lấy tất cả các khung thời gian.
 * @returns {Promise<Array>} Danh sách tất cả các khung thời gianh.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllTimeslot = async () => {
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
export const getTimeslotById = async (id) => {
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
export const createTimeslot = async (timeslotData) => {
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
export const updateTimeslot = async (id, timeslotData) => {
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
export const deleteTimeslot = async (id) => {
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
