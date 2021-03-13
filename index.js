import {ModalWin} from './modalWindow.js'
import './localStorage.js'

//load from local storedg saved rem_item
//... not relised
class Item {
  constructor(options) {
    this.id = options.id;
    this.name = options.name;
    this.list = options.list;
    if (options.list.length)
      for (let key in options.list) {
        if (options.list.hasOwnProperty(key)) this[key] = options.list[key];
      }

    console.log("create item " + options);
  }
}

class ReminderItem extends Item {
  constructor(options) {
    super(options);

    this.$remStore = document.querySelector(options.remStore);

    this.$li = document.createElement("li");
    this.$li.className = options.className;
    this.$li.id = this.id;
    this.$li.innerText = this.name;
  }
  addLast() {
    this.$remStore.append(this.$li);
  }

  addFirst() {
    this.$remStore.prepend(this.$li);
  }

  remove() {
    this.$li.remove();
  }
}

const reminderItems = localStorage.get()
if (reminderItems){
  reminderItems.forEach((item, i) => {
    new ReminderItem({
      remStore: "#rem-store",
      id: `li-item${i}`,
      name: item.name,
      className: 'li-item',
      list: item.items
    }).addFirst();
  });
}


// Описываем обработчик событий к еще не созданным элементам
document.body.on = function (event, element, callback) {
  for (const _body of document.querySelectorAll("body")) {
    _body.addEventListener(event, (e) => {
      console.log("Object.prototype.on");
      if (!e.target.matches(element)) return;
      console.log(`Object.prototype.on -> ${element} -> ${event}`);
      callback();
    });
  }
};
//-------------------------------------------


//----------modal window -----------------///
/*class ModalWin {
  constructor(options) {
    this.body = `<div class="container m-win-body">  
                  ${options.body} 
                </div>`;
    this.$mWin = document.createElement("div");
    this.$mWin.className = "m-win";
  }

  create() {
    this.$mWin.insertAdjacentHTML("beforeend", this.body);
    document.body.append(this.$mWin);
  }

  remove() {
    this.$mWin.remove();
    this.$mWin.innerHTML = "";
  }

  insertHTML(selector, position, html) {
    document.querySelector(selector).insertAdjacentHTML(position, html);
  }
}*/
const addRemWin = new ModalWin({
  body:
    `<div class="m-win">
      <div class="m-win-body">
          <div class="m-win-container">
              <input class="input input-text-header" id="reminder-name" type="text" placeholder="Название">
              <div class="reminder-items">
                  <div class="reminder-item" id="head-reminder-item">
                      <img class="img-min" src="img/check.png">
                      <span>Добавить список</span>
                  </div>
                  <div class="reminder-item" id="footer-reminder-item" style="display: none;">
                      <img class="img-min" src="img/arrow_1.png">
                      <span>Добавить элемент</span>
                  </div>
              </div>
          </div>
          <div class="m-win-footer" style="vertical-align: bottom;">
              <button class="btn-footer btn" id="m-win-close" onclick="console.log('close ', this)">Отмена</button>
              <button class="btn-footer btn" id="save-new-reminder">Сохранить</button>
          </div>
      </div>
    </div>`
});

document.querySelector("#add-reminder").addEventListener("click", () => {
  console.log("click add-reminder");
  addRemWin.create();
});

function addReminerItem() {
  const html = `<div class="add-reminder-item">
      <input class="checkbox-item" type="checkbox">
      <input class="input item-text-reminder" type="text" placeholder="Добавить список">
    </div>`;
  addRemWin.insertHTML("#footer-reminder-item", "beforebegin", html);
}



// Добавляем обработчик событий к еще не созданным элементам
document.body.on("click", "#m-win-close", () => {
  console.log("click btn close din-win");
  addRemWin.remove();
});

document.body.on("click", "#save-new-reminder", () => {
  console.log(`click in btn save`);
  saveReminderItems();
});

document.body.on("click", "#head-reminder-item span", () => {
  console.log(`head-reminder-item`);
  document.querySelector("#footer-reminder-item").style.display = "block";
  document.querySelector("#head-reminder-item").style.display = "none";
  addReminerItem();
  setFocusLastItem();
});

document.body.on("click", "#footer-reminder-item span", () => {
  addReminerItem();
  setFocusLastItem();
});
//-----------

function saveReminderItems() {
  console.log(`click in btn save inner`);
  const reminder = {
    name: document.querySelector("#reminder-name").value,
  };
  const itemsList = document.querySelectorAll(".add-reminder-item");

  if (itemsList.length) {
    // проверям, не пуст ли объект, есть ли у него дети
    //const allMasItem = Array.prototype.slice.call(items.childNodes);
    let items = [];
    for (let i = 0; i < itemsList.length; ++i) {
      // перебераем вссе кроме первого и поcледнего элемента
      let item = {
        checked: itemsList[i].querySelector(".checkbox-item").checked,
        value: itemsList[i].querySelector(".item-text-reminder").value,
      };
      items.push(item);
    }
    reminder.items = items;
  }

  localStorage.set(reminder); //save new reminder in local storage
  addRemWin.remove(); //close mWindow
}

function setFocusLastItem() {
  const nodeList = document.querySelectorAll(".item-text-reminder");
  nodeList[nodeList.length - 1].select();
}
//----------------------------------------------


//------------- Local storage----------------//
/*
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
  if (item) return JSON.parse(items);
  else return false;
};
*/
///------------------------------------------------
