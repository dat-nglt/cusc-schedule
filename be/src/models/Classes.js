import { DataTypes } from 'sequelize';

const Classes = (sequelize) => {
  const ClassesModel = sequelize.define('Classes', {
    class_id: {
      type: DataTypes.STRING(30),
      primaryKey: true,
      allowNull: false,
    },
    class_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    class_size: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    course_id: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  }, {
    tableName: 'classes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  // Define associations within the factory function or in a separate file
  // For simplicity, I'm including it here.
  ClassesModel.associate = (models) => {
    ClassesModel.belongsTo(models.Course, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  };

  return ClassesModel;
};

export default Classes;