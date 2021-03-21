const keyStor = "reminderStorege";
Storage.prototype.set = (value) => {
  
  let data;
  let item = localStorage.getItem(keyStor);
  if (item) {
    let parseItem = JSON.parse(item);
    parseItem.push(value);
    data = JSON.stringify(parseItem);
  } else {
    data = JSON.stringify([value]);
  }
  localStorage.setItem(keyStor, data);
};

Storage.prototype.get = () => {
  let items = localStorage.getItem(keyStor);
  if (items) return JSON.parse(items);
  else return false;
};

Storage.prototype.reSet = (data) => {
  localStorage.setItem(keyStor, JSON.stringify(data));
}
