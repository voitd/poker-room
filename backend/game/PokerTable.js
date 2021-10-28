const poker = require('poker')
const PokerPlayer = require('./PokerPlayer')

const MAX_SEAT = 2

class PokerTable {
  constructor(socketio, tableID) {
    this.socketio = socketio
    this.tableID = tableID
    this.players = []

    this.table = PokerTable({
      ante: 0,
      smallBlind: 10,
      bigBlind: 20
    })
  }
}

joinTable = PokerPlayer => {
  if (this.players.length < MAX_SEAT) {
    this.players.push(PokerPlayer)
    return true
  }
  return false
}

updatePlayers = () => {
  let {table, socketio} = this

  let tableData = {
    seats: table.seats()
  }

  this.players.forEach(player => {
    if (!palayer.currentSeat && player.user) {
      tableData.seats[player.currentSeat].name = player.user.name
      tableData.seats[player.currentSeat].image = player.user.image
      tableData.seats[player.currentSeat].socketio = player.user.socketio
    } 
  });

  if(table.isHandInProgress()) {
    tableData['cards'] = table.holeCards()
    tableData['round'] = table.roundOfBetting()
    tableData['community'] = table.communityCards()
    tableData['pot'] = table.pots()[0].size

    if (table.isBettingRoundInProgress()) {
      tableData['active'] = true
    }
  }
}
