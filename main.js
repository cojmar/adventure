import './style.css'
import adventure from 'adventurejs'
import res1 from './node_modules/adventurejs/src/vars/dialogue.json'
import res2 from './node_modules/adventurejs/src/vars/longCave.json'
import res3 from './node_modules/adventurejs/src/vars/items.json'
import res4 from './node_modules/adventurejs/src/vars/shortCave.json'



const res = {
  dialogue: res1.dialogue.map(v => v.join('<br>')),
  locations: res2.longDescriptions.map(v => v.join('<br>')),
  short_desc: res4.shortDescriptions.map(v => v.join('<br>')),
  items: res3.items,
}

//console.log(res3.items.map((v, k) => v.map((vv, kk) => `${k}${kk}.mp3\t\t${vv}`).join("\n")).join("\n"))
//console.log(res)

new class {
  constructor() {

    this.init_dom()
    //this.init_game()

  }
  advance(txt) {
    let old_data = {
      loc: this.game.loc,
      visited: Object.assign([], this.game.visited)
    }
    let ret = this.game.advance(txt)
    if (old_data.loc !== this.game.loc) this.game_data.location.visited = old_data.visited[this.game.loc]
    this.game_data.location.id = this.game.loc
    this.game_data.location.description = (this.game_data.location.visited) ? res.short_desc[this.game.loc] : res.locations[this.game.loc]


    return ret
  }
  init_game() {
    this.game_data = {
      location: {
        id: -1,
        visited: 0,
        description: '',
        items: []
      },
      dialogue: {
        id: -1,
        description: ''
      },
      inventory: [
      ]
    }
    this.game = adventure.makeState()
    this.advance()
    let ret = this.advance("yes")
    for (let i = 0; i <= 5; i++)  this.advance('look')
    ret.pop()
    this.game_data.dialogue.description = ret.join('<br>')
    document.querySelector('#loader').style.display = 'none'
    document.querySelector('#app').style.display = 'block'
    this.dom.input.focus()
    this.render()
  }

  do_dialogue(dialogue) {
    if (!dialogue) dialogue = 'look'
    let tmp = this.advance(dialogue)
    tmp.pop()
    this.game_data.dialogue.description = tmp.join('<br>')
    this.dom.input.value = ''
    this.dom.input.focus()
    this.render()
  }

  get_game_data() {

    let tmp_data = this.advance('look')
    let r = []
    let ret = []
    tmp_data.map(l => {
      if (l !== '') r.push(l)
      else {
        ret.push(r.join('<br>'))
        r = []
      }
    })
    ret.shift()
    this.game_data.location.items = ret.map(i => {
      return {
        id: res.items.findIndex(ii => ii.indexOf(i) !== -1),
        name: res.items.find(ii => ii.indexOf(i) !== -1)[0],
        description: i
      }
    })
    this.game_data.dialogue.id = res.dialogue.indexOf(this.game_data.dialogue.description)
    this.game_data.location.id = res.locations.indexOf(this.game_data.location.description)

    tmp_data = this.advance('inventory').splice(2)
    r = []
    ret = []
    tmp_data.map(l => {
      if (l !== '') r.push(l)
      else {
        ret.push(r.join('<br>'))
        r = []
      }
    })

    this.game_data.inventory = ret.map(i => {
      return {
        id: res.items.findIndex(ii => ii.indexOf(i) !== -1),
        name: i
      }
    })

  }

  init_dom() {
    window.speechSynthesis.cancel()
    this.dom = {
      message_top: document.querySelector('.message_top'),
      message_bottom: document.querySelector('.message_bottom'),
      input: document.querySelector('input[type=text]'),
      send_button: document.querySelector('.send_button')
    }
    this.dom.input.addEventListener('keyup', k => {
      if (k.key === 'Enter') this.do_dialogue(this.dom.input.value)
    })
    this.dom.send_button.addEventListener('click', e => this.do_dialogue(this.dom.input.value))
    document.querySelectorAll('.action-button').forEach(e => e.addEventListener('click', _ => this.do_dialogue(e.getAttribute(`data-action`))))

    document.querySelector('.new_game').addEventListener('click', _ => this.init_game())
  }


  text_to_speatch(text) {
    // Create a new SpeechSynthesisUtterance object
    let utterance = new SpeechSynthesisUtterance()
    // Set the text and voice of the utterance
    utterance.text = text.split('.').join(', , ,').split('<br>').join('')
    utterance.voice = window.speechSynthesis.getVoices()[0]
    // Speak the utterance
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  render() {
    this.get_game_data()
    this.dom.message_bottom.innerHTML = ''

    if (!this.game_data.location.description && !this.game_data.dialogue.description) {
      this.dom.message_top.innerHTML = 'Refresh to restart'
      this.dom.message_bottom.innerHTML = 'Game Over'
    }
    else if (this.game_data.dialogue.id === -1) {
      this.dom.message_top.innerHTML = this.game_data.dialogue.description
    }
    else {
      this.dom.message_top.innerHTML = [this.game_data.location.description, this.game_data.location.items.map(i => i.description).join('<br><br>')].join('<br><br>')
      this.dom.message_bottom.innerHTML = this.game_data.dialogue.description
    }

    let text = (this.last_location !== this.game_data.location.id) ? this.dom.message_top.innerHTML + this.dom.message_bottom.innerHTML : this.dom.message_bottom.innerHTML
    this.text_to_speatch(text)
    document.body.style.backgroundImage = `url('assets/locations/${this.game_data.location.id}.png')`;
    console.log(JSON.stringify(this.game_data, null, 2))
    this.last_location = this.game_data.location.id
  }
}



