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
        this.$remStore.appendChild(this.$li) 
    }

    addFirst(){
        this.$remStore.insertBefore(this.$li, this.$remStore.firstChild) 
    }

    delete(){
        this.$remStore.removeChild(this.$li)
    }

}

const newItem = new ReminderItem({
    id: 'li_item1',
    name: 'First item 12',
    list: {},
    remStore: '#rem_store'
}).addFirst()




class Window {
    constructor(optioins){
        this.body = options.body
        this.footer = options.footer
    }

    create(){
        const dinWin = `
        <div class="din-win">
            <div class="din-win-body">
                ${this.body}
            </div>
            <div class="din-win-footer">
                ${this.footer}
            </div>
        </div>`
        document.body.appendChild(dinWin)
    }
}