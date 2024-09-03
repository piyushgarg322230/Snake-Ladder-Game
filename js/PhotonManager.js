
class PhotonManager {
    constructor(appId, region) {
        this.appId = appId;
        this.region = region;
        this.client = null;
        this.isConnected = false;
    }

    // Connect to Photon
    connect() {
        if (this.client) {
            console.warn("Already connected.");
            return;
        }

        this.client = new Photon.LoadBalancing.LoadBalancingClient(this.region, this.appId);

        // Set up event handlers
        this.client.onStateChange = (state) => this.onStateChange(state);
        this.client.onJoinRoom = () => this.onJoinRoom();
        this.client.onJoinRandomRoomFailed = (errorCode, errorMessage) => this.onJoinRandomRoomFailed(errorCode, errorMessage);
        this.client.onRoomListUpdate = (rooms) => this.onRoomListUpdate(rooms);
        this.client.onEvent = (code, roll, actorNr) => this.onEvent(code, roll, actorNr);
        this.client.onError = (error) => this.onError(error);

        // Optional event handlers
        this.client.onLeaveRoom = () => this.onLeaveRoom();
        this.client.onPlayerEnterRoom = (event) => this.onPlayerEnterRoom(event);
        this.client.onPlayerLeaveRoom = (event) => this.onPlayerLeaveRoom(event);

        // Connect to Photon
        this.client.connect();
    }

    // Handle state changes
   onStateChange(state) {
        console.log("State:", state);

        switch (state) {
            case Photon.LoadBalancing.LoadBalancingClient.State.JoinedLobby:
                console.log("Joined the lobby, waiting for room list...");
                this.joinRandomRoom();
                break;

            case Photon.LoadBalancing.LoadBalancingClient.Events.Connect:
                console.log("Connected to Photon.");
                this.isConnected = true;
                break;

            case Photon.LoadBalancing.LoadBalancingClient.Events.Disconnect:
                console.log("Disconnected from Photon.");
                this.isConnected = false;
                this.client = null;
                break;

            case Photon.LoadBalancing.LoadBalancingClient.Events.JoinRoom:
                this.onJoinRoom();
                break;

            case Photon.LoadBalancing.LoadBalancingClient.Events.LeaveRoom:
                this.onLeaveRoom();
                break;

            case Photon.LoadBalancing.LoadBalancingClient.Events.PlayerEnterRoom:
                this.onPlayerEnterRoom();
                break;

            case Photon.LoadBalancing.LoadBalancingClient.Events.PlayerLeaveRoom:
                this.onPlayerLeaveRoom();
                break;

            case Photon.LoadBalancing.LoadBalancingClient.Events.RoomPropertiesChange:
                this.onRoomPropertiesChange();
                break;

            case Photon.LoadBalancing.LoadBalancingClient.Events.Error:
                this.onError();
                break;

            case Photon.LoadBalancing.LoadBalancingClient.Events.RoomListUpdate:
                this.onRoomListUpdate();
                break;

            case Photon.LoadBalancing.LoadBalancingClient.Events.Event:
                this.onEvent();
                break;

            default:
                console.warn("Unhandled state:", state);
                break;
        }
    }

    // Handle successful connection
    onConnect() {
        console.log("Connected to Photon.");
        this.isConnected = true;
    }

    // Handle disconnection
    onDisconnect() {
        console.log("Disconnected from Photon.");
        this.isConnected = false;
        this.client = null;
    }

    // Join a room
    joinRoom(roomName) {
        if (!this.isConnected) {
            console.error("Not connected to Photon.");
            return;
        }

        this.client.joinRoom(roomName);
    }

    // Handle room join
    onJoinRoom() {
        console.log("Joined room:", this.client.myRoom().name);
    }

    // Handle failure to join a random room
    onJoinRandomRoomFailed(errorCode, errorMessage) {
        console.log("Failed to join a random room:", errorCode, errorMessage);
        this.createRoom("NewRoom");
    }

    // Create a new room
    createRoom(roomName) {
        const roomOptions = { maxPlayers: 4 }; // Example options
        this.client.createRoom(roomName, roomOptions);
    }

    // Handle room list updates
    onRoomListUpdate(rooms) {
        console.log("Room list updated:", rooms);
        rooms.forEach(room => {
            console.log("Room name:", room.name, "Players:", room.playerCount, "/", room.maxPlayers);
        });
    }

    // Handle custom events
    onEvent(code, roll, actorNr) {
        console.log("Event received:", code, roll, actorNr);
        // Example custom event handling
        // diceRollSpan.textContent = roll;
        // updateDiceImage(roll);
        // sendMessageToRoom(roll);
        // const newPosition = movePlayer(currentPlayer, roll);
        // checkWin(newPosition);

        // currentPlayer = currentPlayer === 1 ? 2 : 1;
        // diceImage.addEventListener('click', clickOnDice);
    }

    // Handle player entering the room
    onPlayerEnterRoom(event) {
        console.log("Player entered room:", event.player);
    }

    // Handle player leaving the room
    onPlayerLeaveRoom(event) {
        console.log("Player left room:", event.player);
    }

    // Handle room properties change
    onRoomPropertiesChange(event) {
        console.log("Room properties changed:", event.properties);
    }

    // Handle errors
    onError(error) {
        console.error("Photon error:", error);
    }

    // Join a random room
    joinRandomRoom() {
        if (!this.isConnected) {
            console.error("Not connected to Photon.");
            return;
        }

        this.client.joinRandomRoom();
    }
}

const photonManager = new PhotonManager("62b32bc2-ed46-44a2-a67b-c7cb5ce59493","1.0");
photonManager.connect();

