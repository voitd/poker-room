import React, { useState } from 'react'
import socket from '../socket'
import { UserContext } from '../UserContext';

const Game = ({history, match}) => {
  const gameID = match.params.gameID

  const { user } = useContext(UserContext);

  const [players, setPlayers] = useState([])
  const [amount, setAmount] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState([])
  const [modal, setModal] = useState(false)
  const [tableCards, setTableCards] = useState([])
  const [activePlayer, setActivePlayer] = useState([])
  const [winners, setWinners] = useState([])
  const [winners, setWinners] = useState([])
  const [gameFinished, setGameFinished] = useState(initialState)

  useEffect(() => {
		if (!user) {
			history.push('/');
		}
	}, [user, history]);

  useEffect(() => {
		socket.emit('joinTable', { tableId: gameId });
		socket.emit('sitTable', { token: user.token });
	}, [gameId, user.token]);

  useEffect(() => {
    socket.removeEventListener('currentSeat');
		socket.on('currentSeat', (data) => {
			if (data.currentSeat === undefined) {
				history.push('/play');
			} else {
				console.log(data);
				setCurrentPlayer(data.currentSeat);
				setForcedBets(data.forced);
			}
		});

    socket.removeEventListener('tableData');
    socket.on('tableData', data => {
      const seats = data.seats.filter((seat) => seat)

      if (!seats.length) {
        setModal(true)
      } else {
        setModal(false)
      }

      if(data.cards) {
        const players = [];
        for (let i = 0; i < seats.length; i++) {
					players.push({ ...data?.seats[i], ...data?.cards[i] });
        }
        setWinners([]);
				setPlayers(players);
				setTableCards(data.community);
				setActivePlayer(data.active);
				setPot(data.pot);
      }

      const mappedPlayers = [...players]
      const gainedPlayers = []

      for (let i = 0; i < data.seats.length; i++) {
					if (data.seats[i] !== null) {
						if (mappedPlayers[i]) {
							gainedPlayers.push(
								mappedPlayers[i].totalChips < data.seats[i].totalChips
							);
						} else {
							gainedPlayers.push(false);
						}
						mappedPlayers[i] = data.seats[i];
					} else {
						gainedPlayers.push(false);
						delete mappedPlayers[i];
					}
      }
      setPot(0);
		  setWinners(gainedPlayers);
		  setPlayers(mappedPlayers);
			setTableCards([]);
			setActivePlayer(null);    })
  }, [history, players, modal, tableCards, winners, gameID])

  const handleLeave = () => {
    socket.emit('leaveTable')
  }

  const handleFold = () => {
    socket.emit('foldTable')
  }

  const handleCheck = () => {
    if (canCheck()) {
      socket.emit('callTable') 
    }
  }

  const handleRaise = () => {
    if (canRaise(amount)) {
      socket.emit('raiseTable', {raise: parseInt(amount)})
      setAmount(0);
    }
  }

  const handleBet = () => {
    if (canBet(amount)) {
			socket.emit('betTable', { bet: parseInt(amount) });
			setAmount(0);
		} 
  }

  const getMaxBet = () => {
		return Math.max.apply(
			Math,
			players.filter((seat) => seat !== null).map((seat) => seat?.betSize)
		);
	};

	const getMinRaise = () => {
		return getMaxBet() + forcedBets.bigBlind;
	};

	const canCall = () => {
		if (players[currentPlayer] === undefined) {
			return false;
		}
		let { betSize } = players[currentPlayer];
		let maxBetSize = getMaxBet();
		return betSize !== maxBetSize;
	};

	const canCheck = () => {
		if (players[currentPlayer] === undefined) {
			return false;
		}
		let { betSize } = players[currentPlayer];
		let maxBetSize = getMaxBet();
		return betSize === maxBetSize;
	};

	const canRaise = (amount) => {
		if (amount < 0 || players[currentPlayer] === undefined) {
			return false;
		}

		let maxBetSize = getMaxBet();
		if (maxBetSize === 0) {
			return false;
		}

		let { totalChips } = players[currentPlayer];
		let minBet = maxBetSize + forcedBets.bigBlind;
		if (amount < minBet || amount > totalChips) {
			return false;
		}

		return amount >= minBet;
	};

	const canBet = (amount) => {
		if (amount < 0 || players[currentPlayer] === undefined) {
			return false;
		}

		let maxBet = getMaxBet();
		if (maxBet > 0) {
			return false;
		}

		let { totalChips } = players[currentPlayer];
		let minBet = forcedBets.bigBlind;
		if (amount < minBet || amount > totalChips) {
			return false;
		}

		return totalChips >= minBet;
	};



return (
		<div style={backgroundStyle}>
			<Modal show={modal} onHide={() => {}}>
				<Modal.Header>
					<Modal.Title>Invite players</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{ fontSize: '1rem', textAlign: 'center' }}>
					<div>
						Share this id:
						<div className="d-flex align-items-center justify-content-center">
							<strong>{gameId}</strong>
							<img
								onClick={() => {
									window.navigator.clipboard.writeText(gameId);
								}}
								style={{ cursor: 'pointer' }}
								src="../img/clipboard.png"
								id="clipboard"
								alt="clipboard"
							/>
						</div>
						with your friends to play.
					</div>
					<hr />
					<FacebookShareButton url={window.location.href} quote={'Play poker now!'}>
						<FacebookIcon size={32} round />
					</FacebookShareButton>
					<TwitterShareButton
						className="mx-2"
						url={window.location.href}
						title={'Play poker now!'}
					>
						<TwitterIcon size={32} round />
					</TwitterShareButton>
					<WhatsappShareButton url={window.location.href} title={'Play poker now!'}>
						<WhatsappIcon size={32} round />
					</WhatsappShareButton>
				</Modal.Body>
			</Modal>
			<Row className="d-flex mt-auto justify-content-around fixed-bottom">
				{players.map((player, index) => (
					<div key={index}>
						<div className="d-flex justify-content-center">
							{player.first && (
								<>
									<img
										className="playingCard"
										alt="card"
										// src="../img/cards/BLUE_BACK.svg"
										src={
											currentPlayer === index
												? getCardImgUrl(player.first)
												: '../img/cards/BLUE_BACK.svg'
										}
									/>
									<img
										className="playingCard"
										alt="card"
										// src="../img/cards/BLUE_BACK.svg"
										src={
											currentPlayer === index
												? getCardImgUrl(player.second)
												: '../img/cards/BLUE_BACK.svg'
										}
									/>
								</>
							)}
						</div>
						<Card
							style={
								activePlayer === index
									? activeCard
									: winners[index]
									? { backgroundColor: '#7FFF00', width: '12rem' }
									: { width: '12rem' }
							}
						>
							<Card.Img style={imgStyle} variant="top" src={'.' + player.image} />
							<Card.Body>
								<Card.Title style={textStyle}>{player.name}</Card.Title>
								<Card.Text style={textStyle}>
									Stack:
									<img
										className="chipsImage"
										src="../img/chips.svg"
										alt="stack"
									/>
									{player.stackSize}
									<br />
									Bet Size:
									<img className="chipsImage" src="../img/bet.svg" alt="stack" />
									{player.betSize}
								</Card.Text>
							</Card.Body>
						</Card>
					</div>
				))}
			</Row>
			<Row>
				<Col
					md={2}
					className="d-flex justify-content-center mt-5 flex-column"
					style={{ zIndex: 1031 }}
				>
					<Button onClick={handleLeave} className="ml-5 mt-5 " variant="danger">
						Leave
					</Button>
					{activePlayer !== null ? (
						<>
							<Button
								onClick={handleFold}
								disabled={currentPlayer !== activePlayer}
								className="ml-5  my-3"
								variant="primary"
							>
								Fold
							</Button>
							<Button
								onClick={handleCheck}
								disabled={currentPlayer !== activePlayer || !canCheck()}
								className="ml-5"
								variant="primary"
							>
								Check
							</Button>
							<Button
								onClick={handleCall}
								disabled={currentPlayer !== activePlayer || !canCall()}
								className="ml-5 my-3"
								variant="primary"
							>
								Call
							</Button>
							{currentPlayer === activePlayer &&
								(canRaise(getMinRaise()) ? (
									<>
										<Button
											onClick={handleRaise}
											disabled={
												currentPlayer !== activePlayer || !canRaise(amount)
											}
											className="ml-5"
											variant="primary"
										>
											{amount < getMinRaise()
												? `Raise min ${getMinRaise()}`
												: 'Raise'}
										</Button>
										<InputGroup>
											<FormControl
												type="number"
												placeholder="Amount"
												aria-label="Username"
												className="ml-5 my-3"
												onChange={(e) => setAmount(e.target.value)}
												value={amount}
											/>
										</InputGroup>
									</>
								) : (
									canBet(forcedBets.bigBlind) && (
										<>
											<Button
												onClick={handleBet}
												disabled={
													currentPlayer !== activePlayer ||
													!canBet(amount)
												}
												className="ml-5"
												variant="primary"
											>
												{amount < forcedBets.bigBlind
													? `Bet min ${forcedBets.bigBlind}`
													: 'Bet'}
											</Button>
											<InputGroup>
												<FormControl
													type="number"
													placeholder="Amount"
													aria-label="Username"
													className="ml-5 my-3"
													onChange={(e) => setAmount(e.target.value)}
													value={amount}
												/>
											</InputGroup>
										</>
									)
								))}
						</>
					) : (
						!modal && (
							<div className="ml-5 mt-5">
								<CountdownCircleTimer
									isPlaying
									duration={15}
									colors={[
										['#004777', 0.33],
										['#F7B801', 0.33],
										['#A30000', 0.33],
									]}
								>
									{({ remainingTime }) => remainingTime}
								</CountdownCircleTimer>
							</div>
						)
					)}
				</Col>

				<Col
					md={8}
					className="d-flex align-items-center flex-column justify-content-start mt-5"
					style={{ minHeight: '50vh' }}
				>
					<div className="mt-3 mb-5 d-flex flex-column align-items-center">
						<img
							src="../img/pot.svg"
							style={{ height: '40px', width: '40px' }}
							alt="pot"
						/>
						<strong
							style={{
								color: 'white',
								backgroundColor: 'rgba(0,0,0,0.5)',
								borderRadius: '5px',
								width: 'auto',
								marginTop: '5px',
							}}
						>
							Pot: {pot} {'  '}{' '}
						</strong>
					</div>
					<div className="d-flex justify-content-around w-75 mt-3">
						<img className="playingCard" alt="card" src="../img/cards/BLUE_BACK.svg" />

						<div className="d-flex justify-content-around w-75">
							{tableCards.map((card, index) => (
								<img
									key={index}
									className="playingCard"
									alt="card"
									src={getCardImgUrl(card)}
								/>
							))}
						</div>
					</div>
				</Col>
			</Row>
		</div>
	);
}

export default Game

