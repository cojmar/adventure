import './style.css'
import adventure from 'adventurejs'
import res1 from './node_modules/adventurejs/src/vars/dialogue.json'
import res2 from './node_modules/adventurejs/src/vars/longCave.json'



const res = {
  dialogue: res1.dialogue.map(v => v.join('<br>')),
  locations: res2.longDescriptions.map(v => v.join('<br>')),
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
      action: {
        id: -1,
        description: ret.join('<br>')
      }
    }
    this.render()
  }
  do_action(action) {
    let tmp = this.game.advance(action)
    tmp.pop()
    this.game_data.action.description = tmp.join('<br>')
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
    this.game_data.location.items = ret
    this.game_data.action.id = res.dialogue.indexOf(this.game_data.action.description)
    this.game_data.location.id = res.locations.indexOf(this.game_data.location.description)
  }
  init_dom() {
    this.dom = {
      message_top: document.querySelector('.message_top'),
      message_bottom: document.querySelector('.message_bottom'),
      input: document.querySelector('input[type=text]')
    }
    this.dom.input.addEventListener('keyup', k => {
      if (k.key === 'Enter') {
        this.do_action(this.dom.input.value)
        this.dom.input.value = ''
      }
    })
  }

  render() {
    this.get_game_data()
    this.dom.message_bottom.innerHTML = ''
    if (this.game.isDone()) {
      this.dom.message_top.innerHTML = 'Game Over'
    }
    else if (this.game_data.action.id === -1) {
      this.dom.message_top.innerHTML = this.game_data.action.description
    }
    else {
      this.dom.message_top.innerHTML = [this.game_data.location.description, this.game_data.location.items.join('<br><br>')].join('<br><br>')
      this.dom.message_bottom.innerHTML = this.game_data.action.description
    }

    console.log(JSON.stringify(this.game_data, null, 2))
  }
}



