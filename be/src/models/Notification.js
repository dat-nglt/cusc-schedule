// models/notification.js
import { DataTypes } from 'sequelize';

const Notification = (sequelize) => {
  const NotificationModel = sequelize.define(
    'Notification',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('general', 'urgent', 'scheduled'),
        allowNull: false,
        defaultValue: 'general',
      },
      recipients: {
        type: DataTypes.ENUM(
          'all',
          'students',
          'lecturers',
          'training_officers',
          'admins'
        ),
        allowNull: false,
        defaultValue: 'all',
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'notifications',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  NotificationModel.associate = (models) => {
    NotificationModel.belongsToMany(models.Account, {
      through: 'user_notifications',
      as: 'users',
      foreignKey: 'notification_id',
    });
  };

  return NotificationModel;
};

export default Notification;