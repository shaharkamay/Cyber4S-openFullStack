const fs = require('fs')

class Database {
  #dir = './'
  #fs = {}

  constructor(dir) {
    this.#dir = dir
    if(!fs.existsSync(`./src/database/${dir}`)) {
      fs.mkdirSync(`./src/database/${dir}`)
    }
  }

  get(key) {
    const path = `./src/database/${this.#dir}/${key}.json`
    let content
    try {
      content = fs.readFileSync(path, 'utf-8')
    } catch (error) {
      throw 'Cannot find this key'
    }
    const {data, readOnly, timestamp} = JSON.parse(content)
    if(readOnly) {
      const readOnlyEntry = new ReadOnlyEntry(data, timestamp)
      return readOnlyEntry
    } 
    const entry = new Entry(data, timestamp, (newData) => this.#updateEntry(key, newData))
    return entry
  }

  store(key, data, readOnly = false) {
    const timestamp = new Date().toLocaleString()
    const path = `./src/database/${this.#dir}/${key}.json`
    const content = JSON.stringify({data, readOnly, timestamp})
    try {
      fs.writeFileSync(path, content)

      this.#fs[key] = content
    } catch (error) {
      throw 'Cannot store in this path'
    }
  }

  #updateEntry(key, data, readOnly = false) {
    const timestamp = new Date().toLocaleString()
    const path = `./src/database/${this.#dir}/${key}.json`
    const content = JSON.stringify({data, readOnly, timestamp})
    try {
      fs.writeFileSync(path, content)
      this.#fs[key] = content
    } catch (error) {
      throw 'Cannot store in this path'
    }
  }

  isKeyExists(key) {
    return fs.existsSync(`./src/database/${this.#dir}/${key}.json`)
  }

}

class Entry {
  #data
  #timestamp
  #updaterCb

  constructor(data, timestamp, updaterCb) {
    this.#data = data
    this.#timestamp = timestamp
    this.#updaterCb = updaterCb
  }

  get value() {
    return this.#data
  }

  set value(data) {
    this.#updaterCb(data)
    this.#data = data
  }

  get timestamp() {
    return this.#timestamp
  }

  remove() {
    //remove from database
  }

  toString() {
    return JSON.stringify(this.value)
  }
}

class ReadOnlyEntry extends Entry {
  constructor(data, timestamp) {
    super(data, timestamp, () => {throw 'Cannot update read-only entries'})
  }

  set value(data) {
    throw 'Cannot update read-only entries'
  }
}



module.exports =  Database