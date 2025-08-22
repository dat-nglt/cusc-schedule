import { DataTypes } from "sequelize";

// Định nghĩa model ClassSchedule - Đại diện cho lịch học của lớp
const ClassSchedule = (sequelize) => {
    const ClassScheduleModel = sequelize.define(
        "ClassSchedule",
        {
            // Mã lịch học (khóa chính)
            class_schedule_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            // Khóa ngoại tham chiếu đến học kỳ
            semester_id: {
                type: DataTypes.STRING(30),
                allowNull: false, // đồng bộ với migration
            },
            // Khóa ngoại tham chiếu đến lớp học
            class_id: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            // Khóa ngoại tham chiếu đến chương trình học
            program_id: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            // Tuần học trong học kỳ
            week: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: 'Week number in the semester'
            },
            // Sĩ số lớp
            size: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: 'Number of students attending this class schedule'
            },
            // Mã nhóm (nếu có)
            group_id: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: 'Group identifier if applicable'
            },
            // Loại buổi học (Lý thuyết, Thực hành, ...)
            lesson_type: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: 'Type of lesson (e.g., Lecture, Lab, Tutorial)'
            },
            // Ngày học cụ thể
            date: {
                type: DataTypes.DATEONLY,
                allowNull: true, // Changed to match migration
                comment: 'Date in YYYY-MM-DD format'
            },
            // Thứ trong tuần
            day: {
                type: DataTypes.ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'),
                allowNull: true, // Changed to match migration
            },
            // Khung giờ học
            slot_id: {
                type: DataTypes.STRING(30),
                allowNull: true,
                comment: "C1 C2"
            },
            // Khóa ngoại tham chiếu đến môn học
            subject_id: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            // Khóa ngoại tham chiếu đến giảng viên
            lecturer_id: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            // Khóa ngoại tham chiếu đến phòng học
            room_id: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            // Trạng thái lịch học
            status: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            // Ghi chú
            notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: "class_schedules", // Tên bảng trong CSDL
            timestamps: true, // Tự động thêm created_at và updated_at
            createdAt: "created_at", // Đặt tên cột createdAt
            updatedAt: "updated_at", // Đặt tên cột updatedAt
        }
    );

    // Khai báo mối quan hệ (association)
    ClassScheduleModel.associate = (models) => {
        // Quan hệ với ProgramSemesters
        if (models.ProgramSemesters) {
            ClassScheduleModel.belongsTo(models.ProgramSemesters, {
                foreignKey: "semester_id", // đổi từ program_semester_id sang semester_id
                as: "program_semester",
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            });
        }

        // Quan hệ với Class
        if (models.Classes) {
            ClassScheduleModel.belongsTo(models.Classes, {
                foreignKey: "class_id",
                as: "class",
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            });
        }

        // Quan hệ với Program
        if (models.Program) {
            ClassScheduleModel.belongsTo(models.Program, {
                foreignKey: "program_id",
                as: "program",
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            });
        }

        // Quan hệ với Subject
        if (models.Subject) {
            ClassScheduleModel.belongsTo(models.Subject, {
                foreignKey: "subject_id",
                as: "subject",
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            });
        }

        // Quan hệ với Lecturer
        if (models.Lecturer) {
            ClassScheduleModel.belongsTo(models.Lecturer, {
                foreignKey: "lecturer_id",
                as: "lecturer",
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            });
        }

        // Quan hệ với Room
        if (models.Room) {
            ClassScheduleModel.belongsTo(models.Room, {
                foreignKey: "room_id",
                as: "room",
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            });
        }

        // Quan hệ với ScheduleChangeRequest
        if (models.ScheduleChangeRequest) {
            ClassScheduleModel.hasMany(models.ScheduleChangeRequest, {
                foreignKey: "class_schedule_id",
                as: "scheduleChangeRequests"
            });
        }
    };

    return ClassScheduleModel;
};

export default ClassSchedule;

