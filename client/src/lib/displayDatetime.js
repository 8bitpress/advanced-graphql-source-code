import moment from "moment";

export function displayRelativeDateOrTime(dateString) {
  const today = new Date();
  const previousDate = new Date(dateString);

  if (
    previousDate.getDate() === today.getDate() &&
    previousDate.getMonth() === today.getMonth() &&
    previousDate.getFullYear() === today.getFullYear()
  ) {
    return moment(previousDate).format("h:mm a");
  } else if (previousDate.getFullYear() === today.getFullYear()) {
    return moment(previousDate).format("MMMM D");
  } else {
    return moment(previousDate).format("MMMM D, YYYY");
  }
}
