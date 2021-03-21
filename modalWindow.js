export class ModalWin{
  constructor(){
    this.windows = {}  
  }

  create(options){
    this.windows[options.windowName] = new Window(options.body)
    this.windows[options.windowName].$mWin.insertAdjacentHTML("beforeend", this.windows[options.windowName].body);
    document.body.append(this.windows[options.windowName].$mWin);
    // addEventListner
    if (options.event !== undefined && typeof (options.event) === "function")
      options.event.call(this)
  }

  close(windowName) {
    this.windows[windowName].$mWin.remove();
    delete this.windows[windowName];
  }

  closeAll() {
    if (this.windows)
      for(let key in this.windows){
        this.windows[key].$mWin.remove();
        delete this.windows[key];
      }
  }

  addEvent(callback){
    //callback.bind(this)()
    callback.call(this)
  }
}

class Window{
  constructor(body) {
    this.body = `<div class="container m-win-body">  
                  ${body} 
                </div>`;
    this.$mWin = document.createElement("div");
    this.$mWin.className = "m-win";
  }
}
/*
export class ModalWin {
    constructor(options) {
      this.windowName = options.windowName
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
  }


export let modalWindowList = {}
class Window {
  constructor(body) {
    this.body = `<div class="container m-win-body">  
                  ${body} 
                </div>`;
    this.$mWin = document.createElement("div");
    this.$mWin.className = "m-win";
  }
}

export class ModalWindows extends Window{
  constructor(options){
    super(options.body)

    this.windowName = options.windowName
  }

  create() {
    modalWindowList[this.windowName] = this
    this.$mWin.insertAdjacentHTML("beforeend", this.body);
    document.body.append(this.$mWin);
  }

  remove(name) {
    this.$mWin.innerHTML = "";
    //this.$mWin.remove();
    for (key in modalWindowList){
      if(key === name)
        modalWindowList[key] = undefined
    }
  }
}
*/