import {modalWin, createReminderWindowContent, reminderItems} from "./index.js"


class Element {
    createInput(options) {
      this.$check = document.createElement("input");
      this.$check.setAttribute("type", "checkbox");
      this.$check.className = "checkbox-item block-invisible";
      this.$check.id = `checkbox-item-${options.id}`;
      return this.$check;
    }
  
    createText(options) {
      this.$text = document.createElement("span");
      this.$text.innerText = options.text;
      this.$text.data = options.id;
      return this.$text;
    }
  }
  
  export class ReminderItem extends Element {
    constructor(options) {
      super();
      this.$reminderList = document.querySelector(options.reminderList);
  
      this.$item = document.createElement("div");
      this.$item.className = "li-item";
      this.$item.id = `li-item-${options.id}`;
      this.$item.data = options.id;
      this.$item.insertAdjacentElement("beforeend", this.createInput(options));
      this.$item.insertAdjacentElement("beforeend", this.createText(options));
  
      this.eventSpy();
    }
  
    addLast(event) {
      this.$reminderList.append(this.$item);
      // addEventListner
      if (event !== undefined && typeof (event) === "function")
        event.call(this)
    }
  
    addFirst(event) {
      this.$reminderList.prepend(this.$item);
      // addEventListner
      if (event !== undefined && typeof (event) === "function")
        event.call(this)
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
        if (element.nodeName.includes('DIV'))
          element.classList.toggle("block-invisible");
      });
    }
  }