// src/services/notificationService.js
import db from "../models/index.js";

const { Notification, Account, UserNotification, Lecturer } = db;

/**
 * Creates a new notification and associates it with the correct recipients.
 * @param {object} notificationData - The data for the new notification.
 * @returns {Promise<object>} The newly created notification object.
 */
export const createNotification = async (notificationData) => {
  const { recipients, recipientId, ...data } = notificationData; // Add recipientId

  const transaction = await db.sequelize.transaction();
  try {
    const newNotification = await Notification.create(data, { transaction });

    let accountsToNotify = [];
    if (recipientId) {
      const lecturer = await Lecturer.findByPk(recipientId, { include: [{ model: Account, as: 'account' }], transaction });
      if (lecturer && lecturer.account) {
        accountsToNotify.push(lecturer.account);
      }
    } else if (recipients === "all") {
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
        as: "notificationInfo",
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

// A simple service or utility function to send notifications
export const sendScheduleChangeNotification = async (request, status) => {
  const { lecturer_id, classSchedule } = request;
  const { subject_id, date, room_id } = classSchedule;

  let title = '';
  let content = '';

  if (status === 'APPROVED') {
    title = `Yêu cầu thay đổi lịch học được phê duyệt`;
    content = `Yêu cầu của bạn về lịch học môn ${subject_id} vào ngày ${date} đã được phê duyệt. Lịch học đã được cập nhật.`;
  } else if (status === 'REJECTED') {
    title = `Yêu cầu thay đổi lịch học bị từ chối`;
    content = `Yêu cầu của bạn về lịch học môn ${subject_id} vào ngày ${date} đã bị từ chối. Vui lòng kiểm tra lại.`;
  }

  // Call the createNotification function from the notification service
  await createNotification({
    title,
    content,
    type: 'scheduled', // Urgent notifications are good for immediate changes
    recipients: 'lecturers',
    recipientId: lecturer_id // The specific lecturer to notify
  });
};


