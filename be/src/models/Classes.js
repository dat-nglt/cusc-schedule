import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connectDB';

const Classes = sequelize.define('Classes', {
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

// Định nghĩa mối quan hệ với bảng Course
Classes.associate = function (models) {
  Classes.belongsTo(models.Course, {
    foreignKey: 'course_id',
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });
};

export default Classes;
// import { DataTypes, Model } from 'sequelize';
// import { sequelize } from '../config/connectDB';

// class Classes extends Model {
//   static associate(models) {
//     // Định nghĩa mối quan hệ với bảng Course
//     Classes.belongsTo(models.Course, {
//       foreignKey: 'course_id',
//       onUpdate: 'CASCADE',
//       onDelete: 'SET NULL',
//     });
//   }
// }

// Classes.init(
//   {
//     class_id: {
//       type: DataTypes.STRING(30),
//       primaryKey: true,
//       allowNull: false,
//     },
//     class_name: {
//       type: DataTypes.STRING(50),
//       allowNull: true,
//     },
//     class_size: {
//       type: DataTypes.SMALLINT,
//       allowNull: true,
//     },
//     status: {
//       type: DataTypes.STRING(30),
//       allowNull: true,
//     },
//     course_id: {
//       type: DataTypes.STRING(30),
//       allowNull: true,
//     },
//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//       allowNull: false,
//     },
//     updated_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     modelName: 'Classes',
//     tableName: 'classes',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//   }
// );

// export default Classes;