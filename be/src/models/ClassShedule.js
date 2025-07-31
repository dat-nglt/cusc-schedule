import { DataTypes } from "sequelize";

// Định nghĩa model ClassSchedule - Đại diện cho lịch học của lớp
const ClassSchedule = (sequelize) => {
    const ClassScheduleModel = sequelize.define(
        "ClassSchedule",
        {
            // Mã lịch học (khóa chính)
            class_schedule_id: {
                type: DataTypes.STRING(30),
                primaryKey: true,
                allowNull: false,
            },
            // Tên lịch học
            class_schedule_name: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            // Thứ trong tuần
            weekday: {
                type: DataTypes.ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'),
                allowNull: false,
            },
            // Số tuần trong học kỳ
            week_number: {
                type: DataTypes.SMALLINT,
                allowNull: false,
                comment: 'Week number in the semester (1-16)'
            },
            // Ngày bắt đầu
            start_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            // Ngày kết thúc
            end_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            // Phương thức học (online, offline, hybrid)
            method: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            // Học kỳ
            semester: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            // Năm học
            academic_year: {
                type: DataTypes.SMALLINT,
                allowNull: true,
            },
            // Trạng thái lịch học
            status: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            // Khóa ngoại tham chiếu đến phòng học
            room_id: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            // Khóa ngoại tham chiếu đến lịch nghỉ
            break_id: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            // Khóa ngoại tham chiếu đến khung giờ
            time_slot_id: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            // Khóa ngoại tham chiếu đến lớp học
            class_id: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            // Khóa ngoại tham chiếu đến môn học
            subject_id: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            // Khóa ngoại tham chiếu đến giảng viên
            lecturer_id: {
                type: DataTypes.STRING(50),
                allowNull: false,
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
        // Quan hệ với Room
        ClassScheduleModel.belongsTo(models.Room, {
            foreignKey: "room_id",
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });

        // Quan hệ với BreakSchedule
        ClassScheduleModel.belongsTo(models.BreakSchedule, {
            foreignKey: "break_id",
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });

        // Quan hệ với TimeSlot
        ClassScheduleModel.belongsTo(models.TimeSlot, {
            foreignKey: "slot_id",
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });

        // Quan hệ với Class
        ClassScheduleModel.belongsTo(models.Class, {
            foreignKey: "class_id",
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });

        // Quan hệ với Lecturer
        ClassScheduleModel.belongsTo(models.Lecturer, {
            foreignKey: "lecturer_id",
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
        // Quan hệ với Subject
        ClassScheduleModel.belongsTo(models.Subject, {
            foreignKey: "subject_id",
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    };

    return ClassScheduleModel;
};

export default ClassSchedule;
