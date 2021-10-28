const PokerTable = require('./PokerTable')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

class PokerPlayer {
  constructor(socketio, gemeSocket) {
    this.socketio = socketio
    this.gameSocket = gameSocket
    this.currentTable = null
    this.currentSit = null
    this.user = null

    gameSocket.on('disconnect', this.disconnectFromTable)
    gameSocket.on('leaveTable', this.disconnectFromTable)


    gameSocket.on('createTable', this.createTable)
    gameSocket.on('joinTable', this.joinActiveTable)
    gameSocket.on('sitTable', this.sitTable)
    gameSocket.on('foldTable', this.foldTable)
    gameSocket.on('checkTable', this.checkTable)
    gameSocket.on('raiseTable', this.raiseTable)
    gameSocket.on('betTable', this.betTable)
    gameSocket.on('callTable', this.callTable)

    this.setupVideoChat()
    //  gameSocket.on('Table', this.Table)
  }
}

setupVideoChat = () => {
  this.gameSocket.on('videoCallTable', data => {
    console.log('[call]: create chat')

    this.socketio.to(data.userToCall).emit('callIncoming', {
      signal: data.signalData,
      from: data.from
    })
  })


  this.gameSocket.on('acceptCall', data => {
    console.log('[call]: accepted')

    this.socketio.to(data.to).emit('callAccepted', data.signal)
  })
}


joinActiveTable = ({ tableID }) => {
  this.disconnectFromTable()

  let tableRoom = this.socketio.sockets.adapter.roms.get(tableID)

  let table = activeTables[tableID]

  if (!tableRoom || !table ) {
    this.gameSocket.emit('status', 'This table not exist')
    return
  }

  if (table.joinTable(this)) {
  }
}
