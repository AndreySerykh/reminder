import { ModalWin } from "./modalWindow.js";
import "./localStorage.js";

//// нужно перенести в оьътдельный модуль/файл class Item, class ReminderItem
class Element {
  createInput(options) {
    this.$check = document.createElement("input");
    this.$check.setAttribute("type", "checkbox");
    //this.$check.setAttribute("disabled", "");
    this.$check.className = "checkbox-item block-invisible";
    this.$check.id = `checkbox-item-${options.id}`;
    return this.$check;
  }

  createText(options) {
    this.$text = document.createElement("span");
    this.$text.innerText = options.text;
    this.$text.setAttribute("readonly", "");
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
    this.$item.addEventListener("mousedown", function (e) {
      if (e.which == 1) {
        this.mousePressTime = 0;
        this.interval = window.setInterval(() => {
          this.mousePressTime += 500;
          if (this.mousePressTime >= 1000) {
            console.log("auto run long click!! CheckMode true");
            clearInterval(this.interval);
            if (!ReminderItem.checkModeState) {
              ReminderItem.checkModeState = true;
              ReminderItem.checkMode(true);
            }
          }
        }, 500);
      }
    }.bind(this));

    this.$item.addEventListener("mouseup", function (e) {
      if (e.which == 1) {
        clearInterval(this.interval);
        if (this.mousePressTime < 1000) {
          console.log(`this is fast click`);
          if (!ReminderItem.checkModeState) {
            modalWin.create({
              windowName: "view",
              body: createReminderWindowContent(
                "view",
                reminderItems[e.target.data]
              ),
            });
          }
        }
        this.mousePressTime = 0;
      }
    }.bind(this));
  }

  static checkModeState = false;

  static checkMode(state) {
    const displayAllCheckbox = function (show) {
      let allCheckbox = document.querySelectorAll(".checkbox-item");
      if (allCheckbox.length)
        allCheckbox.forEach((element) => {
          show
            ? element.classList.remove("block-invisible")
            : element.classList.add("block-invisible");
        });
    };

    displayAllCheckbox(state);
    ReminderItem.checkModeState = state;
    document.querySelector("#main-footer").classList.toggle("block-invisible");
    if (!state) document.querySelector("#item-check-all").checked = false;

    let qq = document.querySelector(".menu-content").childNodes;
    qq.forEach((element) => {
      if (element.nodeName !== "#text")
        element.classList.toggle("block-invisible");
    });
  }
}

function reminderFactory(reminderList) {
  const setEvent = function () {
    document
      .querySelector("#item-check-all")
      .addEventListener("click", function (e) {
        e.currentTarget.checked
          ? checkAllCheckbox(true)
          : checkAllCheckbox(false);
      });

    document
      .querySelector("#cancel-check-mode")
      .addEventListener("click", function (e) {
        checkAllCheckbox(false);
        ReminderItem.checkMode(false);
      });

    //const checkedCount = document.querySelector("#count-checked");
    document.querySelectorAll(".checkbox-item").forEach((element) => {
      element.addEventListener("click", (e) => {
        countChecked();
      });
    });

    document.querySelector("#delete-reminder")
      .addEventListener("click", function (e) {
        document.querySelectorAll(".checkbox-item:checked").forEach((element, i) => {
          let del = confirm('Вы действительно хотите удалить напоминание?')
          if (del){
            reminderItems.splice(element.parentNode.data, 1)
            element.parentNode.remove()
            localStorage.reSet(reminderItems)
            document.querySelector("#cancel-check-mode").click()
          }
        })        
      })

    document.querySelector("#finished-reminder")
    .addEventListener("click", function (e) {
      document.querySelectorAll(".checkbox-item:checked").forEach((element, i) => {
          reminderItems[element.parentNode.data].onfinished = true
          element.parentNode.remove()
          localStorage.reSet(reminderItems)
          document.querySelector("#cancel-check-mode").click()
      })        
    })

  };

  const checkAllCheckbox = function (state) {
    const allCheckbox = document.querySelectorAll(".checkbox-item");
    if (allCheckbox.length) {
      allCheckbox.forEach((element) => {
        element.checked = state;
      });
      countChecked();
    }
  };

  const countChecked = function (set) {
    const countChecked = document.querySelector("#count-checked");
    let count;
    if (set === undefined)
      count = document.querySelectorAll(".checkbox-item:checked").length;
    else count = set;

    count !== 0
      ? (countChecked.innerText = `Выбрано ${count}`)
      : (countChecked.innerText = "");
  };

   reminderList.forEach((item, i) => {
    if (!item.onfinished)
      new ReminderItem({
        reminderList: "#rem-store",
        id: i,
        text: item.name,
      }).addFirst();
  });

  setEvent();
}

const modalWin = new ModalWin(); //initial modal window

const reminderItems = localStorage.get(); // load old save reminder from local storage
if (reminderItems) reminderFactory(reminderItems);

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
 * Events from Add new reminder
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
  let reminder = {
    onfinished: false,
    name: document.querySelector("#reminder-name").value,
  };
  const itemsList = document.querySelectorAll(".add-reminder-item");

  if (itemsList.length) {
    // проверям не пуст ли объект
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
