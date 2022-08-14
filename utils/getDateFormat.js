const getDateString = () => {
  const date = new Date();

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  const dateString =
    date.getFullYear() +
    '-' +
    month +
    '-' +
    day +
    '_' +
    hour +
    '-' +
    min +
    '-' +
    sec;

  return dateString;
};

module.exports = getDateString;
