class GameBoard {
    constructor(appId, region) {
        this.appId = appId;
        this.region = region;
        this.diceImagePositions = [380, 318, 256, 195, 133, 71];
        this.players = {};
        this.playerPositions = {};
        this.currentPlayerTurn = 0;
        this.count = 0;
        this.waitCount = 0;
        this.numberOfPlayers = 4;
        this.isPlaying = false;
        this.playerNames = ["red", "green", "blue", "yellow", "computer"];
        this.isGameOver = true;
        this.podium = [];
        this.scale = 1;
        this.isRoomJoin = false;
        this.islobbyIsJoin = false;
        this.roomlist = [];
        this.PhotonRunning = false;
        this.isILeave = false;

    }

    getBoard = () => {
        return this.board;
    }

    setBoard = (board) => {
        this.board = board;
    }

    getPlayers = () => {
        return this.players;
    }

    setPlayers = (players) => {
        this.players = players;
    }

    getCurrentPlayerTurn = () => {
        return this.currentPlayerTurn;
    }

    setCurrentPlayerTurn = (currentPlayerTurn) => {
        this.currentPlayerTurn = currentPlayerTurn;
    }

    getNumberOfPlayers = () => {
        return this.numberOfPlayers;
    }

    setNumberOfPlayers = (numberOfPlayers) => {
        this.numberOfPlayers = numberOfPlayers;
    }

    getIsPlaying = () => {
        return this.isPlaying;
    }

    setIsPlaying = (isPlaying) => {
        this.isPlaying = isPlaying;
    }

    getDiceImagePositions = () => {
        return this.diceImagePositions;
    }

    rollDice = () => {
        let val = Math.floor(Math.random() * 6) + 1;
        // let val = 1;
        return val;
    }

    setPodium = (newPlayer) => {
    }

    updatePodium = () => {
        for (let playerName in this.playerPositions) {
            if (this.playerPositions[playerName] === 100) {
                this.isGameOver = true;
                this.showPopUp(playerName);
            }
        }

    }

    gameOver = async () => {
        alert("Winner is " + this.podium[0]);
        alert("PODIUM: " + this.podium);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        for (let playerName in this.playerPositions) {
            if (this.playerPositions[playerName] === 100) {
                let currentFinisher = this.players[playerName];
                currentFinisher.getPiece().classList.remove("podium");
                document.querySelector("#gamePodium").removeChild(currentFinisher.getPiece());
                document.querySelector("#gameBoard").appendChild(currentFinisher.getPiece());
            }
        }
        this.resetGame();
        this.updatePodium();
    }


    storeGameSnapshot = () => {
    }


    updatePlayers = () => {
        const playersPlayButton = document.getElementsByClassName("play");

        let i = 0;
        // Display only selected player play button
        Array.from(playersPlayButton).forEach((playerPlayButton, index) => {
            if (index + 1 > this.numberOfPlayers) {
                playerPlayButton.style.display = "none";
            } else {
                playerPlayButton.style.display = "block";
            }

            if (this.numberOfPlayers === 1) {
                document.querySelector("#computer").style.display = "block";
            } else {
                document.querySelector("#computer").style.display = "none";
            }
        });

        // Display only selected player piece
        for (let playerName in this.players) {
            let player = this.players[playerName];
            if (i + 1 > this.numberOfPlayers) {
                player.getPiece().style.display = "none";
            } else {
                player.getPiece().style.display = "block";
            }
            if (this.numberOfPlayers === 1) {
                this.players["computer"].getPiece().style.display = "block";
            } else {
                this.players["computer"].getPiece().style.display = "none";
            }
            i++;
        }
    }

    updateTurn = async () => {

        if (this.podium.includes(this.playerNames[this.currentPlayerTurn]) === false) {
            for (let playerName in this.players) {
                let player = this.players[playerName];
                player.getButton().disabled = true;
            }

            for (let playerName in this.players) {
                let player = this.players[playerName];
                player.getPiece().classList.remove("active");
            }

            if (this.numberOfPlayers === 1 && this.currentPlayerTurn === 1 && !this.isGameOver) {
                document.getElementById("dice2").disabled = false;
                this.players["computer"].getPiece().classList.add("active");
                let timeout = (Math.floor(Math.random() * 1.5) + 0.5) * 1000;
                setTimeout(() => {
                    let diceRoll = this.rollDice();
                    this.playGame(this.players["computer"], diceRoll);
                }, timeout);
            } else {
                this.players[this.playerNames[this.currentPlayerTurn]].getButton().disabled = false;
                this.players[this.playerNames[this.currentPlayerTurn]].getPiece().classList.add("active");


            }
        }
    }


    shuffleDice=function(diceElement, diceNumber) {
        const diceImagePositions = this.diceImagePositions;

        let count = 0;
        const interval = setInterval(() => {
            // Cycle through the dice positions
            diceElement.style.backgroundPositionX = `${diceImagePositions[count % diceImagePositions.length]}px`;
            count++;
            if (count >= 10) { // Shuffle 20 times over 1 second
                clearInterval(interval);
                // Set the final image based on diceNumber
                diceElement.style.backgroundPositionX = `${diceImagePositions[diceNumber - 1]}px`;
            }
        }, 50); // Change image every 50ms
    }

    playGame = async (player, diceRoll, isSend = false) => {
        player.getButton().disabled = true;
        player.getPiece().style.zIndex = "99";
        // this.superPlayButton.disabled = true;
        this.superPlayButton.style.pointerEvents = 'none';
        this.superPlayButton.style.opacity = '0.5';

        let logPara = document.getElementById("log");
        let isCaptured = false;
        if (this.PhotonRunning && isSend) {
            // this.superPlayButton.disabled = true;
            this.superPlayButton.style.pointerEvents = 'none';
            this.superPlayButton.style.opacity = '0.5';
            this.sendMessageToRoom(GAME_PLAYER_CODE, diceRoll);
        } else if (this.PhotonRunning && !isSend && diceRoll == 6) {
            this.sendMessageToRoom(GAME_EVENT_SIX, "yguygyu");
        }

        if (player.getName() == "red") {
            self.shuffleDice(document.getElementById("dice1"),diceRoll);
            // document.getElementById("dice1").style.backgroundPositionX = `${this.diceImagePositions[diceRoll - 1]}px`;
        } else {
            self.shuffleDice(document.getElementById("dice2"),diceRoll);
            // document.getElementById("dice2").style.backgroundPositionX = `${this.diceImagePositions[diceRoll - 1]}px`;
        }
        // Roll the dice
        this.playAudio("./audio/roll.mp3");
        // document.getElementById("dice").style.backgroundPositionX = `${this.diceImagePositions[diceRoll - 1]}px`;
        await new Promise(resolve => setTimeout(resolve, 500));
        let finalPosition = this.playerPositions[player.getName()] + diceRoll;

        if (diceRoll === 6) {
            this.playAudio("./audio/bonus.mp3");
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        if (finalPosition <= 100) {
            for (let i = this.playerPositions[player.getName()]; i <= finalPosition; i++) {
                this.playerPositions[player.getName()] = i;
                player.setPosition(this.playerPositions[player.getName()]);
                player.updatePosition();
                this.playAudio("./audio/move.mp3");
                await new Promise(resolve => setTimeout(resolve, 150));
            }
        }

        await new Promise(resolve => setTimeout(resolve, 250));

        if (this.playerPositions[player.getName()] < 100) {
            let initialPos = this.playerPositions[player.getName()];
            if (this.playerPositions[player.getName()] in this.board.getSnakeAndLadders()) {
                this.playerPositions[player.getName()] = this.board.getSnakeAndLadders()[this.playerPositions[player.getName()]];
                player.setPosition(this.playerPositions[player.getName()]);
                player.updatePosition();

                if (initialPos > this.playerPositions[player.getName()]) {
                    this.playAudio("./audio/fall.mp3");
                } else {
                    this.playAudio("./audio/rise.mp3");
                }

            }

            let msg = `[${new Date().toLocaleTimeString()}] Player rolled a ${diceRoll}. Current Position: ${this.playerPositions[player.getName()]} <br/>`;
            logPara.innerHTML += msg;

            // // CHECK IF current player has attacked others in same position and make them restart again!
            // for (let playerName in this.playerPositions) {

            //     if (playerName !== player.getName() && player.getPosition() !== 0) {
            //         if (this.playerPositions[player.getName()] === this.playerPositions[playerName]) {
            //             this.playerPositions[playerName] = 0;
            //             isCaptured = true;
            //             this.playAudio("./audio/fall.mp3");
            //             await new Promise(resolve => setTimeout(resolve, 150));
            //             this.players[playerName].setPosition(0);
            //             this.players[playerName].updatePosition();
            //         }
            //     }
            // }
            // if(isCaptured && diceRoll != 6 && isSend){
            //     this.sendMessageToRoom(GAME_EVENT_SIX, "yguygyu");
            // }


        } else {
            let msg = `[${new Date().toLocaleTimeString()}] Player reached the final square. Game over!`;
            logPara.innerHTML += msg;
            player.setPosition(100);
            player.updatePosition();

            //this.setPodium(player.getName());
            this.updatePodium();
            console.log(this.podium);
            // this.podium.push(player.getName());
            // alert(`You won!, ${player.getName()}`);
            // this.resetGame();
            // this.isGameOver = true;
        }


        if ((diceRoll !== 6 /*&& !isCaptured*/) || player.getPosition() >= 100) {
            let playerName = player.getName();
            do {
                // Check if game is over
                let calculatedPlayer = this.numberOfPlayers === 1 ? 2 : this.numberOfPlayers;
                if ((this.podium.length === calculatedPlayer) || this.isGameOver === true) {
                    // this.gameOver();
                    return;
                }

                // If already in podium
                if (this.numberOfPlayers === 1) {
                    if (this.currentPlayerTurn < this.numberOfPlayers) {
                        this.currentPlayerTurn++;
                    } else {
                        this.currentPlayerTurn = 0;
                    }
                } else {
                    if (this.currentPlayerTurn < (this.numberOfPlayers - 1)) {
                        this.currentPlayerTurn++;
                    } else {
                        this.currentPlayerTurn = 0;
                    }
                }

                playerName = this.playerNames[this.numberOfPlayers === 1 && this.currentPlayerTurn === 1 ? 4 : this.currentPlayerTurn];
            } while (this.podium.includes(playerName));

        }


        if (this.playerPositions[player.getName()] == 0) {
            player.getPiece().style.bottom = "-70px";
        }



        this.updatedice(player, diceRoll, isCaptured);
        player.getButton().disabled = false;
        player.getPiece().style.zIndex = "1";
        // this.superPlayButton.disabled = false;
        this.superPlayButton.style.pointerEvents = 'auto';
        this.superPlayButton.style.opacity = '1';
        


        // this.storeGameSnapshot(this.playerPositions, this.currentPlayerTurn, this.numberOfPlayers);
        player.setPosition(this.playerPositions[player.getName()]);
        player.updatePosition();
        this.updateTurn();

        if ((this.PhotonRunning && isSend) || (this.PhotonRunning && !isSend && diceRoll == 6)/*|| (isCaptured && diceRoll != 6 && !isSend)*/) {
            // this.superPlayButton.disabled = true;
            this.superPlayButton.style.pointerEvents = 'none';
            this.superPlayButton.style.opacity = '0.5';
            

        }



    }

    updatedice = (player, diceRoll, isCaptured) => {
        if (player.getName() != "red" && diceRoll != 6 && !isCaptured) {
            const dice1 = document.getElementById("dice1");
            dice1.style.pointerEvents = "none";
            dice1.style.opacity = "1";
            dice1.style.cursor = "not-allowed";

            const dice2 = document.getElementById("dice2");
            dice2.style.pointerEvents = "none";
            dice2.style.opacity = "0";
            dice2.style.cursor = "not-allowed";
        } else if (diceRoll != 6 && !isCaptured) {
            const dice1 = document.getElementById("dice1");
            dice1.style.pointerEvents = "none";
            dice1.style.opacity = "0";
            dice1.style.cursor = "not-allowed";

            const dice2 = document.getElementById("dice2");
            dice2.style.pointerEvents = "none";
            dice2.style.opacity = "1";
            dice2.style.cursor = "not-allowed";
        }
    }
    showMenu = () => {
        document.querySelector("#menu").style.display = "block";
        document.querySelector("#playground").style.display = "none";
        document.querySelector("#superplay").disabled = true;
        document.getElementById('resetBtn').style.display = 'none';

    }

    playGround = () => {
        document.querySelector("#menu").style.display = "none";
        document.querySelector("#playground").style.display = "block";
        document.querySelector("#superplay").disabled = false;
        document.getElementById('resetBtn').style.display = 'flex';


        //this.storeGameSnapshot();

        this.updatePlayers();
        this.updateTurn();
    }

    playAudio = (src) => {
        var audio = new Audio(src);

        if (src == "./audio/bg.mp3") {
            audio.volume = 0.1;
        } else {
            audio.volume = 1;
        }
        audio.play();
    }

    fetchGameState = () => {
        this.players["red"].updatePosition();
        this.players["green"].updatePosition();
        this.players["computer"].updatePosition();
    }


    resetGame = () => {
        this.isCreated = false;
        this.isRunning=false;

        this.superPlayButton.disabled = false;
        this.superPlayButton.style.pointerEvents = 'auto';
        this.superPlayButton.style.opacity = '1';
        const dice1 = document.getElementById("dice1");
        dice1.style.pointerEvents = "none";
        dice1.style.opacity = "1";
        dice1.style.cursor = "not-allowed";

        const dice2 = document.getElementById("dice2");
        dice2.style.pointerEvents = "none";
        dice2.style.opacity = "1";
        dice2.style.cursor = "not-allowed";
        if (this.PhotonRunning) {
            if (!this.isGameOver) {
                this.sendMessageToRoom(GAME_EVENT_LEAVE, "one player left room");
            }
            this.client.leaveRoom()
            
        }
        setTimeout(() => {
            this.isILeave=false; 
        }, 10000);
        const playComputerBtn = document.querySelector("#playComputerBtn");
        playComputerBtn.disabled = false;

        this.playerPositions = { red: 0, green: 0, blue: 0, yellow: 0, computer: 0 };
        //localStorage.removeItem("gameState");

        for (const playerName in this.players) {
            let player = this.players[playerName];
            player.setPosition(0);
            player.updatePosition();
        }

        this.currentPlayerTurn = 0;
        this.isGameOver = false;
        this.podium = [];
        this.updateTurn();
        this.updatePlayers();
        this.showMenu();
        this.fetchGameState();
    }


    playerRoll = () => {

        console.log("click in "+this.currentPlayerTurn +" nuber player :"+this.numberOfPlayers);
        
        if(!this.isRunning){
            this.isRunning = true;
            console.log("click in  isRunning "+this.currentPlayerTurn +" nuber player :"+this.numberOfPlayers);

            setTimeout(() => {
                this.isRunning=false;
            }, 1000);
            if (this.isPlaying === false) {
                this.playAudio("./audio/bg.mp3");
                this.isPlaying = true;
            }
            let diceRoll = this.rollDice();
            if (this.PhotonRunning) {
                this.playGame(this.players["red"], diceRoll, true);
            } else {
                if (this.currentPlayerTurn === 0) this.playGame(this.players["red"], diceRoll);
                if (this.numberOfPlayers !== 1 && this.currentPlayerTurn === 1) this.playGame(this.players["green"], diceRoll);
                if (this.currentPlayerTurn === 2) this.playGame(this.players["blue"], diceRoll);
                if (this.currentPlayerTurn === 3) this.playGame(this.players["yellow"], diceRoll);
               // if (this.numberOfPlayers === 1 && this.currentPlayerTurn === 1) this.playGame(this.players["computer"], diceRoll);
            }
        }

    }



    setPhoton = () => {
        this.client = new Photon.LoadBalancing.LoadBalancingClient(Photon.ConnectionProtocol.Wss, this.appId, this.region);

        var onStateChange = (state) => {
            console.log("State:", state);
            switch (state) {
                case Photon.LoadBalancing.LoadBalancingClient.State.JoinedLobby:
                    console.log("Joined the lobby, waiting for room list...");
                    self.islobbyIsJoin = true;
                    self.isConnected = true;
                    break;

                case Photon.LoadBalancing.LoadBalancingClient.State.ConnectingToNameServer:
                    console.log("Connected to Photon.");

                    break;

                case Photon.LoadBalancing.LoadBalancingClient.State.Disconnected:
                    console.log("Disconnected from Photon.");
                    self.isConnected = false;
                    self.islobbyIsJoin = false;
                    //self.client = null;
                    break;

                case Photon.LoadBalancing.LoadBalancingClient.State.ConnectedToNameServer:
                    console.log("ConnectedToNameServer from Photon.");
                    // this.onJoinRoom();
                    break;

                case Photon.LoadBalancing.LoadBalancingClient.State.ConnectedToMaster:
                    console.log("ConnectedToMaster from Photon.");
                    // this.onLeaveRoom();
                    break;

                case Photon.LoadBalancing.LoadBalancingClient.State.Joined:
                    console.log("Joined from Photon.");
                    // this.onPlayerLeaveRoom();
                    break;

                case Photon.LoadBalancing.LoadBalancingClient.State.Error:
                    console.log("Error from Photon.");
                    break;

                default:
                    console.log("Unhandled state:", state);
                    break;
            }
        }

        let joinRoon = function () {
            console.log("Joined random room:", self.client.myRoom().name);
            if (self.isCreated) self.startGame(false);
        };


        var PlayerEnteredRoom = (player) => {
            console.log("A new player has entered the room:", player.name);
            if (self.waitingForPlayer) {
                self.waitingForPlayer = false;
                console.log(`Player ${newPlayer.getName()} joined the room. Stopping the wait.`);
                // start game hare
                self.startGame(false);
            }
        }

        var Event = (code, roll, actorNr) => {
            console.log("Event received: ", code, roll, actorNr);
            if (code == GAME_PLAYER_CODE) {
                // update Player poss
                if (actorNr != self.client.myActor().actorNr) {
                    //move red Player
                    this.playGame(this.players["green"], roll.text);
                }
            } else if (code == GAME_SET_PLAYER) {
                // self.superPlayButton.disabled = true;
                this.superPlayButton.style.pointerEvents = 'none';
                this.superPlayButton.style.opacity = '0.5';
                const dice1 = document.getElementById("dice1");
                dice1.style.pointerEvents = "none";
                dice1.style.opacity = "0";
                dice1.style.cursor = "not-allowed";


            } else if (code == GAME_EVENT_SIX) {
                setTimeout(() => {
                    // self.superPlayButton.disabled = false;
                    this.superPlayButton.style.pointerEvents = 'auto';
                    this.superPlayButton.style.opacity = '1';

                }, 2000);
            } else if (code == GAME_EVENT_LEAVE) {
                self.showPopUp("red");
                self.client.myRoom().isVisible=false;
                self.client.myRoom().isOpen=false;
            }
        };

        var ActorLeave = (M, N)=>{
            //show alert or popup for leave room or end game what u want like this
            if(M.actorNr != self.client._myActor.actorNr && !self.isILeave){
                console.log("onActorLeave  "+ M+"   "+N );
                self.showPopUp("red");
            }
        };

        this.client.onActorLeave = ActorLeave;
        this.client.onJoinRoom = joinRoon;
        this.client.onStateChange = onStateChange;
        this.client.onPlayerEnteredRoom = PlayerEnteredRoom;
        this.client.onEvent = Event;

        this.joinRoomFromList = () => {

            if (self.client && self.client.isConnectedToMaster() && self.client.isInLobby()) {
                var roomlist=this.client.availableRooms();

                if (roomlist.length > 0) {

                    for (let i = roomlist.length - 1; i >= 0; i--) {
                        let room = roomlist[i];
                        console.log("Room name:", room.name, "Players:", room.playerCount, "/", room.maxPlayers);
                        console.log(`Room found: ${room.name}, Open: ${room.isOpen}, Players: ${room.playerCount}/${room.maxPlayers}`);
                        if (room.isOpen && room.playerCount < 2 
                            && room.playerCount != 0 && room.playerCount == 1) {
                            console.log(`Joining room: ${room.name}`);
                            self.isCreated = true;
                            self.client.joinRoom(room.name);
                            return;
                        }
                    }
                    
                }

                console.log("No joinable rooms found. Creating a new room...");
                self.createNewRoom();
            } else {
                if (self.client && self.client.isConnectedToMaster() && self.client.isInLobby()) {
                    self.count++;
                    setTimeout(() => {
                        if (self.count > 3) {
                            self.count = 0;
                            self.startGame(true);
                        } else {
                            self.joinRoomFromList();
                        }
                    }, 2000);
                } else {
                    this.setPhoton();
                    setTimeout(() => {
                        self.joinRoomFromList()
                    }, 5000);
                }

            }

        }
        this.RoomJoin = () => {
            self.isRoomJoin = true;
            self.joinRoomFromList();
        }
        // Handle the response
        this.client.onLobbyStats = function (lobbyStats) {
            console.log("Lobby Statistics:");
            lobbyStats.forEach(function (lobbyStat) {
                console.log("Lobby:", lobbyStat.lobbyName);
                console.log("Number of Rooms:", lobbyStat.numRooms);
                console.log("Number of Players:", lobbyStat.numPlayers);
            });
        };

        this.createNewRoom = () => {
            const roomName = "Room_" + Math.floor(Math.random() * 8999 + 1000);
            const roomOptions = {
                maxPlayers: 15,
                isVisible: true,
                isOpen: true
            };

            console.log(`Creating room: ${roomName}`);
            this.client.createRoom(roomName, roomOptions);
            this.waitingForPlayer = true;

            this.waitForPlayerToJoin();
        }

        this.waitForPlayerToJoin = () => {
            self.waitCount++;
            console.log("Waiting for another player to join...");
            setTimeout(() => {

                if (this.waitingForPlayer && this.client.myRoom() && (this.client.myRoom().playerCount === 1 || this.client.myRoom().playerCount === 0)) {
                    if (self.waitCount < 20) {
                        self.waitForPlayerToJoin();
                        return;
                    }
                    console.log("No other player joined. Closing and hiding the room.");
                    self.waitCount = 0;
                    this.client.myRoom().isVisible = false;
                    this.client.myRoom().isOpen = false;

                    // Redirect to offline mode or handle as necessary
                    var isComputer = true;
                    this.startGame(isComputer);
                    const dice2 = document.getElementById("dice2");
                    dice2.style.pointerEvents = "none";
                    dice2.style.opacity = "0";
                    dice2.style.cursor = "not-allowed";
                } else {
                    this.sendMessageToRoom(GAME_SET_PLAYER, "I_AM_FIRST");

                    const dice2 = document.getElementById("dice2");
                    dice2.style.pointerEvents = "none";
                    dice2.style.opacity = "0";
                    dice2.style.cursor = "not-allowed";
                    // start Game here
                    var isComputer = false;
                    this.startGame(isComputer);

                }
            }, 2000);
        }

        


        this.sendMessageToRoom = (eventCode, message) => {
            this.client.raiseEvent(eventCode, { text: message });
            console.log("Message sent to room:", message);
        }



        this.client.connectToRegionMaster("eu");
    }

    startGame = (isComputer) => {
        // document.body.classList.remove('loading');
        document.getElementById('loader-container').style.display = 'none'; // Hide the loader
        this.windowResize();
        if (isComputer) {
            this.numberOfPlayers = 1;
            document.body.classList.add('loaded'); // Optional: add 'loaded' class if you use it to manage visibility
            this.playGround();
        } else {
            this.PhotonRunning = true;
            this.numberOfPlayers = 2;
            this.playGround();
        }
    }



    initializeGame = () => {

        this.setPhoton();
        const boardElement = document.getElementById("gameBoard");

        const redPlayerPiece = document.getElementById("redPlayerPiece"); /* Red Piece */
        const greenPlayerPiece = document.getElementById("greenPlayerPiece"); /* Green Piece */
        // const bluePlayerPiece = document.getElementById("bluePlayerPiece"); /* Blue Piece */
        // const yellowPlayerPiece = document.getElementById("yellowPlayerPiece"); /* Yellow Piece */
        const computerPlayerPiece = document.getElementById("computerPlayerPiece"); /* Computer Piece */

        const redPlayerBtn = document.getElementById("red"); /* Red Play Button */
        const greenPlayerBtn = document.getElementById("green"); /* Green Play Button */
        // const playerBlueBtn = document.getElementById("blue"); /* Blue Play Button */
        // const playerYellowBtn = document.getElementById("yellow"); /* Yellow Play Button */
        const computerPlayerBtn = document.getElementById("computer"); /* Computer Play Button */

        const redPlayer = new Player(0, "red", redPlayerPiece, redPlayerBtn, 0);
        const greenPlayer = new Player(1, "green", greenPlayerPiece, greenPlayerBtn, 0);
        // const bluePlayer = new Player(2, "blue", bluePlayerPiece, playerBlueBtn, 0);
        // const yellowPlayer = new Player(3, "yellow", yellowPlayerPiece, playerYellowBtn, 0);
        const computerPlayer = new Player(1, "computer", computerPlayerPiece, computerPlayerBtn, 0);

        /* Menu Buttons */
        const playComputerBtn = document.querySelector("#playComputerBtn");
        const superPlayButton = document.getElementById("superplay");
        const resetBtn = document.querySelector("#resetBtn");
        let newGameStart = document.getElementById('closeBtn');
        let exitBtn = document.getElementById('exitBtn');
        let continueBtn = document.getElementById('continueBtn');



        let players = {
            red: redPlayer,
            green: greenPlayer,
            // blue: bluePlayer,
            // yellow: yellowPlayer,
            computer: computerPlayer
        };

        let playerPositions = {
            red: 0,
            green: 0,
            // blue: 0,
            // yellow: 0,
            computer: 0,
        };


        const board = new Board(boardElement, GAME_BOARD_BG_02, SNAKES_AND_LADDERS_02);

        this.board = board;
        this.players = players;
        this.playerPositions = playerPositions;
        this.currentPlayerTurn = 0;
        this.numberOfPlayers = 0;
        this.superPlayButton = superPlayButton;
        this.isGameOver = false;

        superPlayButton.addEventListener("click", this.playerRoll);

        resetBtn.addEventListener("click", () => {
            document.getElementById('popupBack').style.display = 'flex';
        });

        exitBtn.addEventListener('click', () => {
            console.log('Exit button clicked');
            this.isILeave=true;
            this.resetGame();
            document.getElementById('popupBack').style.display = 'none';

        });

        continueBtn.addEventListener('click', function () {
            console.log('Exit button clicked');
            document.getElementById('popupBack').style.display = 'none';
        });


        newGameStart.addEventListener('click', () => {
            this.resetGame();
            // this.showPopUp(1);
            document.getElementById('popup').style.display = 'none';
        });
        playComputerBtn.addEventListener("click", (event) => {
            playComputerBtn.disabled = true;
            this.startLoading();
            setTimeout(() => {
                this.joinRoomFromList();
            }, 2000)
        });

        this.fetchGameState();
        this.updatePodium();
        this.updateTurn();


        
        this.windowResize = () => {
            const boardWrapper = document.querySelector("#boardWrapper");
        
            if (boardWrapper && boardWrapper.offsetParent !== null) { // Check if the element is visible and rendered
                const boardWidth = boardWrapper.clientWidth;
        
                // Fallback to a default value if clientWidth is 0
                if (boardWidth > 0) {
                    this.scale = boardWidth / 500;
                } else {
                    console.warn("boardWrapper.clientWidth is 0, using fallback scale.");
                    this.scale = 1; // Fallback scale value, adjust as needed
                }
        
                if (this.scale < 0.5) this.scale = 0.5;
        
                console.log("Adjusted scale:", this.scale);
        
                for (let player in this.players) {
                    this.players[player].setScale(this.scale);
                }
            } else {
                console.warn("boardWrapper is not visible or not rendered yet.");
            }
        };
        
        // Ensure the function runs after the DOM is fully loaded
        window.addEventListener("load", this.windowResize);
        window.addEventListener("resize", this.windowResize);
        


        this.updateTurn();
    }

    startLoading = () => {
        // document.body.classList.add('loading');
        document.getElementById('loader-container').style.display = 'flex'; // Show the loader

    }

    stopLoading = () => {
        // document.body.classList.remove('loading');
        document.getElementById('loader-container').style.display = 'none'; // Hide the loader

    }

    showPopUp = (status) => {
        document.getElementById('popup').style.display = 'flex'

        const popup = document.getElementById('popup');
        const pElement = popup.querySelector('p');
        if (self.numberOfPlayers == 2) {
            if (status == "red") {
                pElement.textContent = "You Win"
            } else {
                pElement.textContent = "You Loss"
            }
        } else {
            if (status != "computer") {
                pElement.textContent = "You Win!";
            } else {
                pElement.textContent = "You Loss!";
            }

        }

        console.log(pElement.textContent);
    }
}

const gameBoard = new GameBoard("62b32bc2-ed46-44a2-a67b-c7cb5ce59493", "1.0");
gameBoard.initializeGame();
var self = gameBoard;