
export default function formatFee(amount) {
  if (isNaN(amount)) return "";
  return amount.toLocaleString("vi-VN", {
	style: "currency",
	currency: "VND",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
  });
}