import {ModalWin} from './modalWindow.js'
import './localStorage.js'


//// нужно перенести в оьътдельный модуль/файл class Item, class ReminderItem
class Item {
  constructor(options) {
    this.id = options.id;
    this.name = options.name;
    /*this.list = options.list;
    if (options.list.length)
      for (let key in options.list) {
        if (options.list.hasOwnProperty(key)) this[key] = options.list[key];
      }
*/
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
    this.$li.data = options.dataId;

    this.$li.onclick = () => {

      modalWin.create({
        windowName: "view",
        body: createReminderWindowContent('view', reminderItems[this.$li.data])
      })
    }


    this.mousePressTime = 0
    this.$li.addEventListener('mousedown', function(e){
      console.log('li mouse down');

      this.interval = window.setInterval(()=>{
        console.log('+500ms');
        this.mousePressTime += 500
      },500)
    })

    this.$li.addEventListener('mouseup', function(e){
      console.log('li mouse up');

      clearInterval(this.interval)
      if (this.mousePressTime >= 1500)
        console.log(`this is long click ${this.mousePressTime}`);
      else
        console.log(`this is fast click ${this.mousePressTime}`);
      
        this.mousePressTime = 0 
    })

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



const modalWin = new ModalWin(); //initial modal window 

const reminderItems = localStorage.get()
if (reminderItems){
  reminderItems.forEach((item, i) => {
    new ReminderItem({
      remStore: "#rem-store",
      id: `li-item-${i}`,
      name: item.name,
      className: 'li-item',
      dataId: i
    }).addFirst();
  });
}




/*
*   Общий обработчик событий к еще не созданным элементам
*/
document.body.on = function (event, element, callback) {
  for (const _body of document.querySelectorAll("body")) {
    _body.addEventListener(event, (e) => {
      if (!e.target.matches(element)) return;
      console.log(`Object.prototype.on -> ${element} -> ${event}`);
      callback();
    });
  }
};


/*
* Add new reminder
*/
document.querySelector("#add-reminder").addEventListener("click", () => {
  console.log("click add-reminder");
  modalWin.create({
    windowName: "add",
    body: createReminderWindowContent('add')
  })
});

function addReminerItem() {
  const html = `<div class="add-reminder-item">
                  <input class="checkbox-item" type="checkbox">
                  <input class="input item-text-reminder" type="text" placeholder="Добавить список">
                </div>`;

  document
    .querySelector("#footer-reminder-item")
    .insertAdjacentHTML("beforebegin", html);
}


/*
* Добавляем обработчик событий к еще не созданным элементам
*/

// общее закрытие модальных окон
document.body.on("click", "#m-win-close", () => {
  console.log("click btn close modal-win");
  modalWin.closeAll()
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

/*
*   create reminder window with type = "add" || "edit" || "view"
*/
function createReminderWindowContent(type, options) {
  let header = "",
    content = "",
    footer = "";
  let name = options ? options.name : "";
  let reminderList = options ? loadReminderList(type, options) : "";
  if (type === "add" || type === "edit") {
    header = `
            <div class="m-win-header">
            </div>`;
    content = `
            <div class="m-win-content">
                <input class="input input-text-header" id="reminder-name" value="${name}" type="text" placeholder="Введите название">
                <div class="reminder-items">
                    <div class="reminder-item" id="head-reminder-item">
                        <img class="img-min" src="img/check.png">
                        <span>Добавить список</span>
                    </div>
                    ${reminderList}
                    <div class="reminder-item" id="footer-reminder-item" style="display: none;">
                        <img class="img-min" src="img/arrow_1.png">
                        <span>Добавить элемент</span>
                    </div>
                </div>
            </div>`;
    footer = `
            <div class="m-win-footer" style="vertical-align: bottom;">
                <button class="btn btn-footer" id="m-win-close">Отмена</button>
                <button class="btn btn-footer" id="save-new-reminder">Сохранить</button>
            </div>`;
  } else {
    header = `
            <div class="m-win-header">
                <button class="btn btn-header" id="m-win-close"><</button>
            </div>`;
    content = `<div class="m-win-content">
                    <input class="input input-text-header input-view" id="reminder-name" value="${name}" type="text" readonly >
                    <div class="reminder-items">
                        ${reminderList}
                    </div>
                </div>`;
    footer = `<div class="m-win-footer" style="vertical-align: bottom;">
                    <button class="btn btn-footer" id="finished-reminder">Завершить</button>
                    <button class="btn btn-footer" id="edit-reminder">Изменить</button>
                    <button class="btn btn-footer" id="delete-reminder">Удалить</button>
                </div>`;
  }

  return header + content + footer;
}

function loadReminderList(type, options) {
  /*    options = {
   **        name: "some name string",
   **        items: [
   **            {
   **                checked: true/false,
   **                value: "some value string"
   **            }
   **        ]
   **    }
   */

  let readonly = "",
    placeholder = "Добавить список",
    inputView = "";
  if (type === "view") {
    readonly = "readonly";
    placeholder = "";
    inputView = "input-view-item";
  }

  let html = "";
  options.items.forEach((item, i) => {
    const checked = item.checked ? "checked" : "";
    const inputChecked = item.checked ? "input-checked" : "";
    html += `<div class="add-reminder-item">
                <input class="checkbox-item" type="checkbox" ${checked}>
                <input class="input item-text-reminder ${inputView} ${inputChecked}" ${readonly} value="${item.value}" type="text"  ${placeholder}>
            </div>`;
  });

  return html;
}

/*
* save remindser in local storage
*/
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

