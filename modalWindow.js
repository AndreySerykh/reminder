export class ModalWin {
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
  }