// models/user_notification.js
import { DataTypes } from 'sequelize';

const UserNotification = (sequelize) => {
  const UserNotificationModel = sequelize.define(
    'UserNotification',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'id',
        },
      },
      notificationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'notifications',
          key: 'id',
        },
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'user_notifications',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  UserNotificationModel.associate = (models) => {
    UserNotificationModel.belongsTo(models.Account, {
      foreignKey: 'accountId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: 'userInfo',
    });

    UserNotificationModel.belongsTo(models.Notification, {
      foreignKey: 'notificationId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: 'notificationInfo',
    });
  };

  return UserNotificationModel;
};

export default UserNotification;