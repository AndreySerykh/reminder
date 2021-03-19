import { ModalWin } from "./modalWindow.js";
import "./localStorage.js";

//// нужно перенести в оьътдельный модуль/файл class Item, class ReminderItem
class Element {
  createInput(options) {
    this.$check = document.createElement("input");
    this.$check.setAttribute("type", "checkbox");
    this.$check.setAttribute("readonly", "readonly");
    this.$check.className = "checkbox-item block-invisible";
    this.$check.id = `checkbox-item-${options.id}`;
    return this.$check;
  }

  createText(options) {
    this.$text = document.createElement("span");
    this.$text.innerText = options.text;
    this.$text.data = options.id; //  Attr
    return this.$text;
  }
}

class ReminderItem extends Element {
  constructor(options) {
    super();
    this.$reminderList = document.querySelector(options.reminderList);

    this.$item = document.createElement("div");
    this.$item.className = "li-item";
    this.$item.id = `li-item-${options.id}`;
    this.$item.data = options.id; //  Attr
    this.$item.insertAdjacentElement("beforeend", this.createInput(options));
    this.$item.insertAdjacentElement("beforeend", this.createText(options));

    this.eventSpy();
  }

  addLast() {
    this.$reminderList.append(this.$item);
  }

  addFirst() {
    this.$reminderList.prepend(this.$item);
  }

  remove() {
    this.$item.remove();
  }

  eventSpy() {
    //this.checkModeState = false;
    //this.mousePressTime = 0;

    this.$item.addEventListener("mousedown", function (e) {
      if (e.which == 1) {
        console.log("li left mouse down");
        e.preventDefault();

        this.mousePressTime = 0;
        this.interval = window.setInterval(() => {
          console.log("+500ms");
          this.mousePressTime += 500;

          if (this.mousePressTime >= 1000) {
            console.log("auto run long click!! CheckMode true");
            clearInterval(this.interval);
            if (!ReminderItem.checkModeState){
              ReminderItem.checkModeState = true;
              //this.displayAllCheckbox(true);
              this.checkMode(true);
            }
            this.checkCheckbox(e.target);
          }
        }, 500);
      }
    }.bind(this));

    this.$item.addEventListener("mouseup", function (e) {
      if (e.which == 1) {
        console.log("li left mouse up");
        e.preventDefault();

        clearInterval(this.interval);
        if (this.mousePressTime < 1000) {
          console.log(`this is fast click ${this.mousePressTime}`);
          if (!ReminderItem.checkModeState) {
            modalWin.create({
              windowName: "view",
              body: createReminderWindowContent(
                "view",
                reminderItems[e.target.data]
              ),
            });
          }
          else {
            this.checkCheckbox(e.target);
          }
        }/* else {
          console.log(`this is long click ${this.mousePressTime}`);
          if (!this.checkModeState) {
            this.displayAllCheckbox(true);
            this.checkCheckbox(e.target);
            this.checkMode();
          }
        }*/
        this.mousePressTime = 0;
      }
    }.bind(this));

    document.querySelector('#item-check-all').addEventListener("click", function (e) {
      e.currentTarget.checked
        ? this.checkAllCheckbox(true)
        : this.checkAllCheckbox(false)

      this.countChecked()
    }.bind(this))

    document.querySelector('#cancel-check-mode').addEventListener("click", function (e) {
      this.checkAllCheckbox(false)
      this.checkMode(false)
    }.bind(this))
  
///не помогло!
    document.querySelectorAll(".checkbox-item").forEach((element) => {
      element.addEventListener("click",  (e) => {
        e.preventDefault();
      })
    })  
  }
  displayAllCheckbox(show) {
    let allCheckbox = document.querySelectorAll(".checkbox-item");
    if (allCheckbox.length)
      allCheckbox.forEach((element) => {
        show
          ? element.classList.remove("block-invisible")
          : element.classList.add("block-invisible");
      
          //element.classList.toggle("block-invisible");
      });
  }
  
  static checkModeState = false;

  checkAllCheckbox(state) {
    let allCheckbox = document.querySelectorAll(".checkbox-item");
    if (allCheckbox.length)
      allCheckbox.forEach((element) => {
        state
          ? element.setAttribute("checked", "checked")
          : element.removeAttribute("checked")
      });
  }

  checkCheckbox(item) {
    ///Bug not fixset
    if (item.childNodes.length)
      item.querySelector("input").toggleAttribute("checked");

    this.countChecked()
  }

  checkMode(state) {
    this.displayAllCheckbox(state);
    ReminderItem.checkModeState = state
    document.querySelector("#main-footer").classList.toggle("block-invisible");

    let qq = document.querySelector(".menu-content").childNodes;
    qq.forEach((element) => {
      if (element.nodeName !== "#text")
        element.classList.toggle("block-invisible");
    });
  }

  countChecked(){
    const count = document.querySelectorAll(".checkbox-item:checked").length
    document.querySelector('#count-checked').innerText = count
  }
}

const modalWin = new ModalWin(); //initial modal window

const reminderItems = localStorage.get(); // load old save reminder from local storage
if (reminderItems) {
  reminderItems.forEach((item, i) => {
    new ReminderItem({
      reminderList: "#rem-store",
      id: i,
      text: item.name,
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
    body: createReminderWindowContent("add"),
  });
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
  modalWin.closeAll();
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
    footer = `<div class="m-win-footer">
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
  modalWin.close("add"); //close mWindow
}

function setFocusLastItem() {
  const nodeList = document.querySelectorAll(".item-text-reminder");
  nodeList[nodeList.length - 1].select();
}
//----------------------------------------------
