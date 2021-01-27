const RPC = require('discord-rpc');
const rpcModules = require('./rpcModules');

var fs = require('fs');

const {ipcRenderer} = require('electron');

var isRPCon = false;
var isInReady = false;
var destroyRPC = false;

userData = require ('./userData.json');


function closeApp() {
    ipcRenderer.send('close-me');
};

function minimizeApp() {
    ipcRenderer.send('minimize-me');
}

function maximizeApp() {
    ipcRenderer.send('maximize-me');
}

function loadData() {
    var clientIdInputS = document.getElementById('client-id-input');
    var detailTextS = document.getElementById('client-id-detail');
    var stateTextS = document.getElementById('client-id-state');
    var LImageKeyS = document.getElementById('client-id-LImageKey');
    var SImageKeyS = document.getElementById('client-id-SImageKey');
    var LImageTextS = document.getElementById('client-id-LImageText');
    var SImageTextS = document.getElementById('client-id-SImageText');

    clientIdInputS.value = userData.ClientID
    detailTextS.value = userData.DetailText
    stateTextS.value = userData.StateText
    LImageTextS.value = userData.LargeImageText
    SImageTextS.value = userData.SmallImageText
    LImageKeyS.value = userData.LargeImageKey
    SImageKeyS.value = userData.SmallImageKey
}

function startRPC() {
    var startButton = document.getElementById('client-id-button');
    var reloadButton = document.getElementById('client-id-reload');
    var stopButton = document.getElementById('client-id-stop');
    var clientIdInput = document.getElementById('client-id-input');

    if (isRPCon == false) {
        startButton.style.visibility = 'hidden';
        reloadButton.style.visibility = 'visible';
        stopButton.style.visibility = 'visible';
        isRPCon = true;

        createRPC(clientIdInput.value);
    } else if (isRPCon == true) {
        startButton.style.visibility = 'visible';
        reloadButton.style.visibility = 'hidden';
        stopButton.style.visibility = 'hidden';
        isRPCon = false;

        destRPC();
    }
}

var rpc = null;

function createRPC(clientIdLogin) {
    var detailText = document.getElementById('client-id-detail').value;
    var stateText = document.getElementById('client-id-state').value;
    var LImageKey = document.getElementById('client-id-LImageKey').value;
    var SImageKey = document.getElementById('client-id-SImageKey').value;

    if (detailText) {
        var detailJson = {
            details: `${detailText}`
        }
    }

    if (stateText) {
        var stateJson = {
            state: `${stateText}`
        }
    }

    if (LImageKey) {
        var LImageKeyJson = {
            largeImageKey: `${LImageKey}`
        }
    }

    if (SImageKey) {
        var SImageKeyJson = {
            smallImageKey: `${SImageKey}`
        }
    }

    var extraJson = {
        startTimestamp: new Date(),
        largeImageText: "Thonking",
        smallImageText: "Using 2/5 brain cells"
    }

    var completeData = Object.assign({}, detailJson, stateJson, SImageKeyJson, LImageKeyJson, extraJson);

    rpc = new RPC.Client({
        transport: "ipc"
    });

    rpc.login({
        clientId: `${clientIdLogin}`
    });

    rpc.on("ready", () => {
        rpc.setActivity(completeData);
        return;
    })
}

function destRPC() {
    rpc.destroy();
}

function reloadRPC() {
    var detailText = document.getElementById('client-id-detail').value;
    var stateText = document.getElementById('client-id-state').value;
    var LImageKey = document.getElementById('client-id-LImageKey').value;
    var SImageKey = document.getElementById('client-id-SImageKey').value;
    var LImageText = document.getElementById('client-id-LImageText').value;
    var SImageText = document.getElementById('client-id-SImageText').value;

    if (detailText) {
        var detailJson = {
            details: `${detailText}`
        }
    }

    if (stateText) {
        var stateJson = {
            state: `${stateText}`
        }
    }

    if (LImageKey) {
        var LImageKeyJson = {
            largeImageKey: `${LImageKey}`
        }
    }

    if (SImageKey) {
        var SImageKeyJson = {
            smallImageKey: `${SImageKey}`
        }
    }

    if (LImageText) {
        var LImageTextJson = {
            largeImageText: `${LImageText}`
        }
    }

    if (SImageText) {
        var SImageTextJson = {
            smallImageText: `${SImageText}`
        }
    }

    var extraJson = {
        startTimestamp: new Date(),
        largeImageText: "Thonking",
        smallImageText: "Using 2/5 brain cells"
    }

    var completeData = Object.assign({}, detailJson, stateJson, SImageKeyJson, LImageKeyJson, LImageTextJson, SImageTextJson, extraJson);

    rpc.setActivity(completeData);
}

function saveCurrentFields () {
    var clientIdInput = document.getElementById('client-id-input').value;
    var detailText = document.getElementById('client-id-detail').value;
    var stateText = document.getElementById('client-id-state').value;
    var LImageKey = document.getElementById('client-id-LImageKey').value;
    var SImageKey = document.getElementById('client-id-SImageKey').value;
    var LImageText = document.getElementById('client-id-LImageText').value;
    var SImageText = document.getElementById('client-id-SImageText').value;

    if (!clientIdInput) {
        clientIdInput = '';
    }

    if (!detailText) {
        detailText = '';
    }

    if (!stateText) {
        stateText = '';
    }

    if (!LImageKey) {
        LImageKey = '';
    }

    if (!LImageText) {
        LImageText = '';
    }

    if (!SImageKey) {
        SImageKey = '';
    }

    if (!SImageText) {
        SImageText = '';
    }

    userData = {
        ClientID: clientIdInput,
        DetailText: detailText,
        StateText: stateText,
        LargeImageKey: LImageKey,
        SmallImageKey: SImageKey,
        LargeImageText: LImageText,
        SmallImageText: SImageText
    }
    fs.writeFile("./userData.json", JSON.stringify (userData, null, 4), err => {
        if (err) throw err;
        return;
    });

}