import { DataTypes } from 'sequelize';

const Account = (sequelize) => {
  const AccountModel = sequelize.define(
    'Account',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(70),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      role: {
        type: DataTypes.ENUM(
          'student',
          'lecturer',
          'admin',
          'training_officer'
        ),
        allowNull: false,
        defaultValue: 'student',
      },
      google_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      tableName: 'accounts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',  // 👈 thêm cột deleted_at
      paranoid: true,           // 👈 bật xoá mềm
      underscored: true,
    }
  );

  AccountModel.associate = (models) => {
    AccountModel.hasOne(models.Admin, {
      foreignKey: 'admin_id',
      as: 'adminInfo',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    AccountModel.hasOne(models.Student, {
      foreignKey: 'student_id',
      as: 'studentInfo',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    AccountModel.hasOne(models.Lecturer, {
      foreignKey: 'lecturer_id',
      as: 'lecturerInfo',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    AccountModel.hasOne(models.TrainingOfficer, {
      foreignKey: 'staff_id',
      as: 'trainingOfficerInfo',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return AccountModel;
};

export default Account;
