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

class RemItem extends Item{
    constructor(options) {
        super(options)

        this.$remStore = document.querySelector(options.remStore)
    }

    create(){
        const li = document.createElement('li')
        li.className = 'li'
        li.id = this.id
        li.innerText = this.name

        this.$remStore.appendChild(li)
    }

}

const newItem = new RemItem({
    id: 'li_item1',
    name: 'First item',
    list: {},
    remStore: '#rem_store'
})

newItem.create()
