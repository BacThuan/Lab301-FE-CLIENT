// chuyen string thanh so
export const convert = (price) => {
  price =
    typeof price === "string"
      ? price.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : price;
  return price + " VND";
};

export const formatDate = (value) => {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  // Tạo chuỗi định dạng "dd/mm/yyyy"
  return `${day}/${month}/${year}`;
};

export const formatState = (state) => {
  var wordArray = String(state).split("_");

  wordArray.shift();

  return wordArray.join(" ");
};

export const vndToUsd = (vndAmount) => {
  const exchange = Number(process.env.REACT_APP_USD_EXCHANGE);
  return (vndAmount / exchange).toFixed(2);
};
