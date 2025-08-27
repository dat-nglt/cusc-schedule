// src/services/notificationService.js
import db from "../models";

const { Notification, Account, UserNotification } = db;

/**
 * Creates a new notification and associates it with the correct recipients.
 * @param {object} notificationData - The data for the new notification.
 * @returns {Promise<object>} The newly created notification object.
 */
export const createNotification = async (notificationData) => {
  const { recipients, ...data } = notificationData;

  const transaction = await db.sequelize.transaction();
  try {
    const newNotification = await Notification.create(data, { transaction });

    let accountsToNotify = [];
    if (recipients === "all") {
      accountsToNotify = await Account.findAll({ transaction });
    } else {
      accountsToNotify = await Account.findAll({
        where: { role: recipients },
        transaction,
      });
    }

    const userNotificationsData = accountsToNotify.map((account) => ({
      accountId: account.id,
      notificationId: newNotification.id,
    }));

    if (userNotificationsData.length > 0) {
      await UserNotification.bulkCreate(userNotificationsData, { transaction });
    }

    await transaction.commit();
    return newNotification;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Retrieves notifications for a specific user, including unread status.
 * @param {string} accountId - The ID of the user.
 * @param {object} queryOptions - Pagination and filter options.
 * @returns {Promise<object[]>} An array of notifications for the user.
 */
export const getUserNotifications = async (accountId, queryOptions = {}) => {
  const { page = 1, limit = 10, isRead = null } = queryOptions;
  const offset = (page - 1) * limit;

  const whereClause = { accountId };
  if (isRead !== null) {
    whereClause.isRead = isRead;
  }

  return await UserNotification.findAll({
    where: whereClause,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    include: [
      {
        model: Notification,
        as: "notification",
        attributes: ["title", "content", "type", "recipients", "created_at"],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

/**
 * Marks a notification as read for a specific user.
 * @param {string} accountId - The ID of the user.
 * @param {string[]} notificationIds - An array of notification IDs to mark as read.
 * @returns {Promise<number>} The number of updated records.
 */
export const markNotificationsAsRead = async (accountId, notificationIds) => {
  return await UserNotification.update(
    { isRead: true, readAt: new Date() },
    {
      where: {
        accountId,
        notificationId: notificationIds,
        isRead: false,
      },
    }
  );
};
