import { ModalWin } from "./moduls/modalWindow.js";
import "./moduls/localStorage.js";
import { ReminderItem } from "./moduls/reminderItem.js";



export const modalWin = new ModalWin(); //initial modal window
export let reminderItems = loadReminder()


function loadReminder(isFinished = false){
  let remItems = localStorage.get();// load old save reminder from local storage
  if (remItems) 
    reminderFactory(remItems, isFinished);

  return remItems
}

function refreshReminderStory(){
  document.querySelector("#rem-store").innerHTML = ''
}
/*
* load seved reminder from local storage and add event lisner
*/
function reminderFactory(reminderList, isFinished) {
  reminderList.forEach((item, i) => {
    if (item.onfinished === isFinished)
      new ReminderItem({
        reminderList: "#rem-store",
        id: i,
        text: item.name
      }).addFirst();
  });

  setEventAfterRender();

  function setEventAfterRender() {
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

    document.querySelectorAll(".checkbox-item").forEach((element) => {
      element.addEventListener("click", (e) => {
        countChecked();
      });
    });

    document.querySelector("#delete-reminder")
      .addEventListener("click", function (e) {
        let del = confirm('Вы действительно хотите удалить напоминание?')
        document.querySelectorAll(".checkbox-item:checked").forEach((element, i) => {
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

  function checkAllCheckbox(state) {
    const allCheckbox = document.querySelectorAll(".checkbox-item");
    if (allCheckbox.length) {
      allCheckbox.forEach((element) => {
        element.checked = state;
      });
      countChecked();
    }
  };

  function countChecked(set) {
    const countChecked = document.querySelector("#count-checked");
    let count;
    if (set === undefined)
      count = document.querySelectorAll(".checkbox-item:checked").length;
    else count = set;

    count !== 0
      ? (countChecked.innerText = `Выбрано ${count}`)
      : (countChecked.innerText = "Выбор напоминаний");
  };


}



/*
 * Events from main frame
 */
document.querySelector("#add-reminder").addEventListener("click", () => {
  console.log("click add-reminder");
  modalWin
    .create({
      windowName: "add",
      body: createReminderWindowContent("add"),
      event: eventModWinAdd
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

document.querySelector("#finished-reminder-all").addEventListener("click", (e) => {
  console.log("finished-reminder-all");
  let finished = e.target.getAttribute("data-finished");
  if (finished === "false"){
    finished = true;
    e.target.setAttribute("data-finished", `${finished}`);
    e.target.title = 'Отобразить активные напоминания'
  }
  else {
    finished = false;
    e.target.setAttribute("data-finished", `${finished}`);
    e.target.title = 'Отобразить активные напоминания'
  }
  refreshReminderStory()
  reminderItems = loadReminder(finished)

});

/*
//
//   Общий обработчик событий к еще не созданным элементам
//
document.body.on = function (event, element, callback) {
  for (const _body of document.querySelectorAll("body")) {
    _body.addEventListener(event, (e) => {
      if (!e.target.matches(element)) return;
      console.log(`Object.prototype.on -> ${element} -> ${event}`);
      callback();
    });
  }
};
*/

/*
 *   create reminder window with type = "add" || "edit" || "view"
 */
export function createReminderWindowContent(type, options) {
  let header = "",
    content = "",
    footer = "";
  let name = options ? options.name : "";
  let styleHeadReminderItem = '', styleFooterReminderItem = 'display: none;'
  if (type === 'edit'){
    styleHeadReminderItem = 'display: none;'
    styleFooterReminderItem = ''
  }
  let reminderList = options ? loadReminderList(type, options) : "";
  if (type === "add" || type === "edit") {
    header = `
            <div class="m-win-header">
            </div>`;
    content = `
            <div class="m-win-content">
                <input class="input input-text-header" id="reminder-name" value="${name}" type="text" placeholder="Введите название">
                <div class="reminder-items">
                    <div class="reminder-item" id="head-reminder-item" style="${styleHeadReminderItem}">
                        <img class="img-min" src="img/check.png">
                        <span>Добавить список</span>
                    </div>
                    ${reminderList}
                    <div class="reminder-item" id="footer-reminder-item" style="${styleFooterReminderItem}">
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
                <button class="btn btn-header" id="view-m-win-close"><</button>
            </div>`;
    content = `<div class="m-win-content">
                    <input class="input input-text-header input-view" id="reminder-name" value="${name}" type="text" readonly >
                    <div class="reminder-items">
                        ${reminderList}
                    </div>
                </div>`;
    footer = `<div class="m-win-footer">
                    <button class="btn btn-footer" id="view-finished-reminder">Завершить</button>
                    <button class="btn btn-footer" id="view-edit-reminder">Изменить</button>
                    <button class="btn btn-footer" id="view-delete-reminder">Удалить</button>
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
// 
//


/*
 * Events from modal window 'Add'
 */
function eventModWinAdd() {
  document.querySelector('#m-win-close').addEventListener('click', () => {
    this.closeAll();
    //this.close('add')
  })
  
  document.querySelector('#save-new-reminder').addEventListener('click', () => {
    console.log(`click in btn save`);
    saveReminderItems();
    refreshReminderStory()
    reminderItems = loadReminder()
  });

  document.querySelector('#head-reminder-item span').addEventListener('click', () => {
    console.log(`head-reminder-item`);
    document.querySelector("#footer-reminder-item").style.display = "block";
    document.querySelector("#head-reminder-item").style.display = "none";
    addReminerItem();
    setFocusLastItem();
  });

  document.querySelector('#footer-reminder-item span').addEventListener('click', () => {
    addReminerItem();
    setFocusLastItem();
  });


/*
* save remindser in local storage
*/
  let selectedReminderId = undefined;
  if(typeof this.windows['edit'] !== 'undefined')
  selectedReminderId = this.windows['edit'].selectedReminderId;

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
        let item = {
          checked: itemsList[i].querySelector(".checkbox-item").checked,
          value: itemsList[i].querySelector(".item-text-reminder").value,
        };
        items.push(item);
      }
      reminder.items = items;
    } else
      reminder.items = []

    localStorage.set(reminder, selectedReminderId); //save new reminder in local storage
    modalWin.closeAll(); //close mWindow
  }

  function setFocusLastItem() {
    const nodeList = document.querySelectorAll(".item-text-reminder");
    nodeList[nodeList.length - 1].select();
  }
}
//
//

/*
 * Events from modal window 'Edit'
 */
export function eventModWinView() {
  const id = this.windows['view'].selectedReminderId

  document.querySelector('#view-m-win-close').addEventListener('click', () => {
    //this.closeAll();
    this.close('view')
  })
  
  document.querySelector('#view-finished-reminder').addEventListener('click', () => {
    reminderItems[id].onfinished = true
    localStorage.reSet(reminderItems)
    this.close('view')
    refreshReminderStory()
    reminderItems = loadReminder()
  })

  document.querySelector('#view-edit-reminder').addEventListener('click', () => {

    this.close('view')
    modalWin.create({
      windowName: "edit",
      body: createReminderWindowContent("edit", reminderItems[id]),
      selectedReminderId: id,
      event: eventModWinAdd,
    });
  })

  document.querySelector("#view-delete-reminder").addEventListener("click", (e)  => {
    let del = confirm('Вы действительно хотите удалить напоминание?')
    if (del){
      reminderItems.splice(id, 1)
      localStorage.reSet(reminderItems)
      this.close('view')
      refreshReminderStory()
      reminderItems = loadReminder()
    }        
  })
}
