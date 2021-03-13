Storage.prototype.set = (value) => {
  const key = "reminderStorege";
  let data;
  let item = localStorage.getItem(key);
  if (item) {
    let parseItem = JSON.parse(item);
    parseItem.push(value);
    data = JSON.stringify(parseItem);
  } else {
    data = JSON.stringify([value]);
  }
  localStorage.setItem(key, data);
};

Storage.prototype.get = () => {
  let items = localStorage.getItem("reminderStorege");
  if (items) return JSON.parse(items);
  else return false;
};
