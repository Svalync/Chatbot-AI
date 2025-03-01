import resendInstance from "@/lib/resend";
import { EmailTemplateType } from "../emailTemplates";

// Test data
const testData = [
  {
    userId: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    purchases: [
      {
        invoiceId: 101,
        amount: 50,
        status: "completed",
        isRefundable: true,
      },
    ],
  },
  {
    userId: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    purchases: [
      {
        invoiceId: 102,
        amount: 75,
        status: "completed",
        isRefundable: false,
      },
    ],
  },
];

// Helper functions
const getUserByEmail = (email) => testData.find((user) => user.email === email);

const isEligibleForRefund = (email) => {
  const user = getUserByEmail(email);
  if (!user) return { error: "User not found" };
  return user.purchases;
};

const processRefund = (email) => {
  const user = getUserByEmail(email);
  if (!user) return { error: "User not found" };
  return user.purchases.map((purchase) => ({
    ...purchase,
    isRefunded: purchase.isRefundable && purchase.status === "completed",
  }));
};

const getInvoicesByUserEmail = (email) => {
  const user = getUserByEmail(email);
  if (!user) return { error: "User not found" };
  return user.purchases.map(({ invoiceId, amount, status }) => ({
    invoiceId,
    amount,
    status,
  }));
};

const sendBugInfoAndFeedback = async (email, feedback) => {
  const user = getUserByEmail(email);
  if (!user) return { error: "User not found" };

  const resendHandler = new resendInstance();
  const result: any = await resendHandler.sendMail(
    "workflowai.buildfast@gmail.com",
    EmailTemplateType.Feedback,
    "Uday",
    { feedback, email }
  );
  return "Mail Sent";
};

export {
  testData,
  getUserByEmail,
  isEligibleForRefund,
  getInvoicesByUserEmail,
  processRefund,
  sendBugInfoAndFeedback,
};
