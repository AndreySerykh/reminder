//load from local storedg saved rem_item
//... not relised

class Item {
  constructor(options) {
    this.id = options.id;
    this.name = options.name;
    this.list = options.list;
    if(options.list.length)
      for(let key in options.list){
        if(options.list.hasOwnProperty(key))
          this[key] = options.list[key]
      }
      
    console.log("create item " + options);
  }
}

class ReminderItem extends Item {
  constructor(options) {
    super(options);

    this.$remStore = document.querySelector(options.remStore);

    this.$li = document.createElement("li");
    this.$li.className = "li";
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
/*
{
  element: 'check-item',
  className: 'li',
  id: 'som_id',
  innerText: 'same text',
  content: [
    {
        element: 'input',
        className: 'li',
        id: 'som_id',
        checked: true
    },
    {

    }
  ]
}
*/
const newItem = new ReminderItem({
  id: "li_item1",
  name: "First item 12",
  list: {},
  remStore: "#rem_store",
}).addFirst();

class ModalWin {
  constructor(options) {
    this.body = `<div class="container m-win-body">  
                  ${options.body} 
                </div>`
    this.$dWin = document.createElement("div")
    this.$dWin.className = "m-win"  
  }

  create() {
    this.$dWin.insertAdjacentHTML("beforeend", this.body);
    document.body.append(this.$dWin);
  }

  remove() {
    this.$dWin.remove();
    this.$dWin.innerHTML = "";
  }

  insertHTML(selector, position, html){
    document.querySelector(selector).insertAdjacentHTML(position, html);
  }
}
const addRemWin = new ModalWin({
  body: `<div class="m-win-container">
          <input class="input-text" type="text" placeholder="Название">
          <div class="reminder-items">
            <div class="reminder-item">
              <input class="" type="checkbox" checked>
              <input aclass="" type="text" placeholder="Добавить список">
            </div>
            <div class="reminder-item">
              <input class="" type="checkbox" checked>
              <input aclass="" type="text" placeholder="Добавить список">
            </div>
            <div class="reminder-item">
              <input class="" type="checkbox" checked>
              <input aclass="" type="text" placeholder="Добавить список">
            </div>
          </div>
        </div>
        <div class="m-win-footer" style="vertical-align: bottom;">
          <button class="btn-footer btn" id="m-win-close" onclick="console.log('close ', this)">Отмена</button>
          <button class="btn-footer btn" id="save-new-reminder">Сохранить</button>
        </div>`
});

document.querySelector("#add-reminder").addEventListener("click", () => {
  console.log("click add-reminder");
  addRemWin.create();
});

for (const fbody of document.querySelectorAll("body")) {
  fbody.addEventListener("click", (e) => {
    if (!e.target.matches("#m-win-close")) return;
    console.log("click close din-win");
    addRemWin.remove();
  });
}
/*
addRemWin.addEventListener('#d-win-close', ()=>{
    console.log('click close din-win')
    addRemWin.remove()
})

document.querySelector('#save-reminder').addEventListener('click', ()=>{
    console.log('click save-reminder')
    //addRemWin.create()
})*/

/*
Window.prototype.on = function(){
    
    const li = document.createElement('div')
    console.log('prototype', typeof li)
    console.log('addRemWin', typeof addRemWin)
}

addRemWin.on()
*/

function addReminerItem(){
  const html = 
    `<div class="reminder-item">
      <input class="" type="checkbox">
      <input class="input imput-text-min" type="text" placeholder="Добавить список">
    </div>`
  addRemWin.insertHTML('#footer-reminder-item', 'beforebegin', html);
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

// Добавляем обработчик событий к еще не созданным элементам
document.body.on("click", "#save-new-reminder", () => {
  console.log(`click in btn save`);
});

document.body.on('click', '#head-reminder-item', () => {
  console.log(`head-reminder-item`);
  document.querySelector('#footer-reminder-item').style.display = 'block';
  document.querySelector('#head-reminder-item').style.display = 'none';
  addReminerItem();
});

document.body.on('click', '#footer-reminder-item', () => {
  addReminerItem();
});
//-----------
