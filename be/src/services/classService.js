import db from "../models";
import { Op } from 'sequelize';
import ExcelUtils from "../utils/ExcelUtils.js";

// Get all classes
export const getAllClasses = async () => {
  try {
    const classes = await db.Classes.findAll({
      include: [{ model: db.Course, attributes: ['course_id', 'course_name'] }],
    });
    return classes;
  } catch (error) {
    throw new Error('Error fetching classes: ' + error.message);
  }
};

// Get one class by ID
export const getClassById = async (class_id) => {
  return await db.Classes.findByPk(class_id, {
    include: [{ model: db.Course, attributes: ['course_id', 'course_name'] }],
  });
};

// Create a new class
export const createClass = async (data) => {
  const { course_id, class_name } = data;
  if (course_id) {
    const course = await db.Course.findByPk(course_id);
    if (!course) throw new Error('Course not found');
  }
  if (class_name && class_name.length > 50) {
    throw new Error('Tên lớp học không được vượt quá 50 ký tự');
  }
  return await db.Classes.create(data);
};

// Update a class
export const updateClass = async (class_id, data) => {
  const classInstance = await db.Classes.findByPk(class_id);
  if (!classInstance) throw new Error("Class not found");
  if (data.course_id) {
    const course = await db.Course.findByPk(data.course_id);
    if (!course) throw new Error('Course not found');
  }
  if (data.class_name && data.class_name.length > 50) {
    throw new Error('Tên lớp học không được vượt quá 50 ký tự');
  }
  return await classInstance.update(data);
};

// Delete a class
export const deleteClass = async (class_id) => {
  const classInstance = await db.Classes.findOne({ where: { class_id } });
  if (!classInstance) throw new Error("Class not found");
  return await classInstance.destroy();
};

// List classes with filters
export const listClasses = async (filters) => {
  try {
    const whereClause = {};

    // Filter by class_id
    if (filters.class_id) {
      whereClause.class_id = { [Op.iLike]: `%${filters.class_id}%` };
    }

    // Filter by class_name
    if (filters.class_name) {
      whereClause.class_name = { [Op.iLike]: `%${filters.class_name}%` };
    }

    // Filter by status
    if (filters.status) {
      whereClause.status = { [Op.iLike]: `%${filters.status}%` };
    }

    // Filter by course_id
    if (filters.course_id) {
      whereClause.course_id = { [Op.iLike]: `%${filters.course_id}%` };
    }

    const classes = await db.Classes.findAll({
      where: whereClause,
      attributes: ['class_id', 'class_name', 'class_size', 'status', 'course_id', 'created_at', 'updated_at'],
      include: [{ model: db.Course, attributes: ['course_id', 'course_name'] }],
      order: [['created_at', 'DESC']],
    });

    return classes;
  } catch (error) {
    throw new Error('Error listing classes: ' + error.message);
  }
};

// Import classes from Excel
export const importClassesFromExcel = async (fileBuffer) => {
  try {
    const rawData = ExcelUtils.readExcelToJSON(fileBuffer);

    if (!rawData || rawData.length === 0) {
      throw new Error("File Excel không có dữ liệu hoặc định dạng không đúng");
    }

    const classesData = ExcelUtils.convertVietnameseColumnsToEnglish(rawData);

    const results = { success: [], errors: [], total: classesData.length };

    for (let i = 0; i < classesData.length; i++) {
      const row = classesData[i];
      const rowIndex = i + 2;

      try {
        if (!row.class_id) {
          results.errors.push({ row: rowIndex, class_id: row.class_id || 'N/A', error: 'Mã lớp học là bắt buộc' });
          continue;
        }

        const classData = {
          class_id: ExcelUtils.cleanString(row.class_id),
          class_name: ExcelUtils.cleanString(row.class_name) || null,
          class_size: row.class_size ? parseInt(row.class_size) : null,
          status: ExcelUtils.cleanString(row.status) || 'Hoạt động',
          course_id: ExcelUtils.cleanString(row.course_id) || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (classData.class_name && classData.class_name.length > 50) {
          results.errors.push({ row: rowIndex, class_id: classData.class_id, error: 'Tên lớp học không được vượt quá 50 ký tự' });
          continue;
        }

        if (classData.course_id) {
          const course = await db.Course.findByPk(classData.course_id);
          if (!course) {
            results.errors.push({ row: rowIndex, class_id: classData.class_id, error: 'Mã khóa học không tồn tại' });
            continue;
          }
        }

        if (classData.class_size && (isNaN(classData.class_size) || classData.class_size < 0)) {
          results.errors.push({ row: rowIndex, class_id: classData.class_id, error: 'Sĩ số lớp học không hợp lệ' });
          continue;
        }

        const existingClass = await db.Classes.findByPk(classData.class_id);
        if (existingClass) {
          results.errors.push({ row: rowIndex, class_id: classData.class_id, error: 'Mã lớp học đã tồn tại' });
          continue;
        }

        const newClass = await db.Classes.create(classData);
        results.success.push({ row: rowIndex, class_id: newClass.class_id, class_name: newClass.class_name, course_id: newClass.course_id });
      } catch (error) {
        results.errors.push({ row: rowIndex, class_id: row.class_id || 'N/A', error: error.message || 'Lỗi không xác định' });
      }
    }

    return results;
  } catch (error) {
    console.error("Error importing classes from Excel:", error);
    throw error;
  }
};

// Import classes from JSON data
export const importClassesFromJson = async (classesData) => {
  try {
    if (!classesData || !Array.isArray(classesData)) {
      throw new Error("Dữ liệu lớp học không hợp lệ");
    }

    const results = { success: [], errors: [], total: classesData.length };

    for (let i = 0; i < classesData.length; i++) {
      const classData = classesData[i];
      const index = i + 1;

      try {
        if (!classData.class_id) {
          results.errors.push({ index, class_id: classData.class_id || 'N/A', error: 'Mã lớp học là bắt buộc' });
          continue;
        }

        const cleanedData = {
          class_id: classData.class_id.toString().trim(),
          class_name: classData.class_name ? classData.class_name.toString().trim() : null,
          class_size: classData.class_size ? parseInt(classData.class_size) : null,
          status: classData.status ? classData.status.toString().trim() : 'Hoạt động',
          course_id: classData.course_id ? classData.course_id.toString().trim() : null,
        };

        if (cleanedData.class_name && cleanedData.class_name.length > 50) {
          results.errors.push({ index, class_id: cleanedData.class_id, error: 'Tên lớp học không được vượt quá 50 ký tự' });
          continue;
        }

        if (cleanedData.course_id) {
          const course = await db.Course.findByPk(cleanedData.course_id);
          if (!course) {
            results.errors.push({ index, class_id: cleanedData.class_id, error: 'Mã khóa học không tồn tại' });
            continue;
          }
        }

        if (cleanedData.class_size && (isNaN(cleanedData.class_size) || cleanedData.class_size < 0)) {
          results.errors.push({ index, class_id: cleanedData.class_id, error: 'Sĩ số lớp học không hợp lệ' });
          continue;
        }

        const existingClass = await db.Classes.findOne({ where: { class_id: cleanedData.class_id } });
        if (existingClass) {
          results.errors.push({ index, class_id: cleanedData.class_id, error: 'Mã lớp học đã tồn tại' });
          continue;
        }

        const newClass = await db.Classes.create(cleanedData);
        results.success.push(newClass);
      } catch (error) {
        results.errors.push({ index, class_id: classData.class_id || 'N/A', error: error.message || 'Lỗi không xác định' });
      }
    }

    return results;
  } catch (error) {
    console.error("Error importing classes from JSON:", error);
    throw error;
  }
};

// Validate Excel template structure
export const validateExcelTemplate = (fileBuffer) => {
  const requiredColumns = ['Mã lớp học'];
  const optionalColumns = ['Tên lớp học', 'Sĩ số', 'Trạng thái', 'Mã khóa học'];
  const validation = ExcelUtils.validateTemplate(fileBuffer, requiredColumns, optionalColumns);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return validation;
};