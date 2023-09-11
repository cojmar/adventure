import './style.css'
import adventure from 'adventurejs'
import res1 from './node_modules/adventurejs/src/vars/dialogue.json'
import res2 from './node_modules/adventurejs/src/vars/longCave.json'
import res3 from './node_modules/adventurejs/src/vars/items.json'



const res = {
  dialogue: res1.dialogue.map(v => v.join('<br>')),
  locations: res2.longDescriptions.map(v => v.join('<br>')),
  items: res3.items,
}

//console.log(res)

new class {
  constructor() {
    this.init_dom()
    this.init_game()
  }

  init_game() {
    this.game = adventure.makeState()
    this.game.advance()
    let ret = this.game.advance("yes")
    for (let i = 0; i <= 5; i++)  this.game.advance('look')
    ret.pop()
    this.game_data = {
      location: {
        id: -1,
        description: '',
        items: []
      },
      dialogue: {
        id: -1,
        description: ret.join('<br>')
      }
    }
    this.render()
  }

  do_dialogue(dialogue) {
    let tmp = this.game.advance(dialogue)
    tmp.pop()
    this.game_data.dialogue.description = tmp.join('<br>')
    this.render()
  }

  get_game_data() {
    let tmp_data = this.game.advance('look')
    let r = []
    let ret = []
    tmp_data.map(l => {
      if (l !== '') r.push(l)
      else {
        ret.push(r.join('<br>'))
        r = []
      }
    })
    this.game_data.location.description = ret.shift()
    this.game_data.location.items = ret.map(i => {
      return {
        id: res.items.findIndex(ii => ii.indexOf(i) !== -1),
        description: i
      }
    })
    this.game_data.dialogue.id = res.dialogue.indexOf(this.game_data.dialogue.description)
    this.game_data.location.id = res.locations.indexOf(this.game_data.location.description)
  }

  init_dom() {
    this.dom = {
      message_top: document.querySelector('.message_top'),
      message_bottom: document.querySelector('.message_bottom'),
      input: document.querySelector('input[type=text]'),
      button: document.querySelector('button')
    }
    this.dom.input.addEventListener('keyup', k => {
      if (k.key === 'Enter') {
        this.do_dialogue(this.dom.input.value)
        this.dom.input.value = ''
      }
    })
    this.dom.button.addEventListener('click', e => {
      this.do_dialogue(this.dom.input.value)
      this.dom.input.value = ''
    })
  }

  render() {
    this.get_game_data()
    this.dom.message_bottom.innerHTML = ''
    if (this.game.isDone()) {
      this.dom.message_top.innerHTML = 'Game Over'
    }
    else if (this.game_data.dialogue.id === -1) {
      this.dom.message_top.innerHTML = this.game_data.dialogue.description
    }
    else {
      this.dom.message_top.innerHTML = [this.game_data.location.description, this.game_data.location.items.map(i => i.description).join('<br><br>')].join('<br><br>')
      this.dom.message_bottom.innerHTML = this.game_data.dialogue.description
    }

    console.log(JSON.stringify(this.game_data, null, 2))
  }
}



