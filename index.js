//load from local storedg saved rem_item
//... not relised

class Item {
    constructor(options){
        this.id = options.id
        this.name = options.name
        this.list = options.list

        console.log('create item ' + options)
    }

}

class ReminderItem extends Item{
    constructor(options) {
        super(options)

        this.$remStore = document.querySelector(options.remStore)
        
        this.$li = document.createElement('li')
        this.$li.className = 'li'
        this.$li.id = this.id
        this.$li.innerText = this.name

        //this.$remStore.appendChild(this.$li)
    }
    addLast(){
        this.$remStore.append(this.$li) 
    }

    addFirst(){
        this.$remStore.prepend(this.$li) 
    }

    remove(){
        this.$li.remove()
    }

}


const newItem = new ReminderItem({
    id: 'li_item1',
    name: 'First item 12',
    list: {},
    remStore: '#rem_store'
}).addFirst()



class Window {
    constructor(options){
        this.body = options.body
        this.footer = options.footer  
        this.$dWin =  document.createElement('div')
        this.$dWin.className = 'd-win'     
        this.content =`
        <div class="container d-win-body">
            <div class="d-win-container">
                ${options.body}
            </div>
            <div class="d-win-footer" style="vertical-align: bottom;">
                ${options.footer}   
            </div>
        </div>`
    }

    create(){
        this.$dWin.insertAdjacentHTML('beforeend', this.content)
        document.body.append(this.$dWin)
    }

    remove(){
        this.$dWin.remove()
        this.$dWin.innerHTML = ''
    }


}
const addRemWin = new Window({
    body: `<input class="input-text" type="text" placeholder="Название">
            <div class="check-item">
                <input class="" type="checkbox" checked>
                <input class="" type="text" placeholder="Добавить список">
            </div> `,
    footer: `<button class="btn-footer btn" id="d-win-close" onclick="console.log('close ', this)">Отмена</button>
            <button class="btn-footer btn">Сохранить</button>`
})

document.querySelector('#add-reminder').addEventListener('click', ()=>{
    console.log('click add-reminder')
    addRemWin.create()
})

for (const fbody of document.querySelectorAll('body')) {
    fbody.addEventListener('click', e => {
      if (!e.target.matches('#d-win-close')) return; 
      console.log('click close din-win') 
      addRemWin.remove()
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