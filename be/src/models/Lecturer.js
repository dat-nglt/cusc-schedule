import { DataTypes } from "sequelize";

// Định nghĩa model Lecturer - Đại diện cho giảng viên
const Lecturer = (sequelize) => {
  const LecturerModel = sequelize.define(
    "Lecturer",
    {
      lecturer_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      degree: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      academic_rank: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      day_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      tableName: "lecturers",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );

  // Associations
  LecturerModel.associate = (models) => {
    LecturerModel.belongsTo(models.Account, {
      foreignKey: "account_id",
      as: "account",
    });

    LecturerModel.belongsToMany(models.Subject, {
      through: models.LecturerAssignment,
      foreignKey: "lecturer_id",
      otherKey: "subject_id",
      as: "subjects",
    });

    LecturerModel.hasMany(models.LecturerAssignment, {
      foreignKey: "lecturer_id",
      as: "lecturerAssignments",
    });

    LecturerModel.hasMany(models.BusySlot, {
      foreignKey: "lecturer_id",
      as: "busy_slots",
    });

    LecturerModel.hasMany(models.SemesterBusySlot, {
      foreignKey: "lecturer_id",
      as: "semester_busy_slots",
    });

    if (models.ClassSchedule) {
      LecturerModel.hasMany(models.ClassSchedule, {
        foreignKey: "lecturer_id",
        as: "classSchedules",
      });
    }

    if (models.ScheduleChangeRequest) {
      LecturerModel.hasMany(models.ScheduleChangeRequest, {
        foreignKey: "lecturer_id",
        as: "scheduleChangeRequests",
      });
    }
  };

  return LecturerModel;
};

export default Lecturer;
