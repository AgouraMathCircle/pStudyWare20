export const getNewsletterStatusClass = (message, isError) => {
  if (isError) return "newsletter-status-error";
  if (message?.toLowerCase().includes("already subscribed")) {
    return "newsletter-status-info";
  }
  return "newsletter-success";
};
