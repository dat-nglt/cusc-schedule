// models/RefreshToken.js
import { DataTypes } from 'sequelize';

const RefreshToken = (sequelize) => {
  const RefreshTokenModel = sequelize.define(
    'RefreshToken',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      account_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true, // Đảm bảo mỗi tài khoản chỉ có một RefreshToken đang hoạt động tại một thời điểm
        references: {
          model: 'accounts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ip_address: { // Thông tin IP lúc tạo token
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      user_agent: { // Thông tin User-Agent lúc tạo token
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'revoked'),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      tableName: 'refresh_tokens',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  RefreshTokenModel.associate = (models) => {
    RefreshTokenModel.belongsTo(models.Account, {
      foreignKey: 'account_id',
      as: 'account',
    });
    // Một RefreshToken có thể liên kết với một LoginSession (1-1)
    RefreshTokenModel.hasOne(models.LoginSession, {
      foreignKey: 'refresh_token_id', // Đổi thành refresh_token_id
      as: 'loginSession',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return RefreshTokenModel;
};

export default RefreshToken;