const RPC = require('discord-rpc');
const { ipcRenderer } = require('electron');
var fs = require('fs');

// Custom Dependencies
const { appendArgsToJSON } = require('./js/argsToJSON');

var isRPCon = false;
var userData;
var userFL;

ipcRenderer.send('userDataFolder');
ipcRenderer.on('userDataFolder', (event, arg) => {
    var UDExist = fs.existsSync(arg + '\\userData.json')

    createUserData(UDExist, arg);
})

function createUserData (UDExist, arg) {
    if (UDExist == true) {
        userFL = arg + '\\userData.json';
        userData = require(userFL);
    } else if (UDExist == false) {
        let newData = {};

        fs.writeFile(arg + '\\userData.json', JSON.stringify (newData, null, 4), err => {
            if (err) throw err;
            userFL = arg + '\\userData.json';
            userData = require(userFL);
        });
    }
}

/* Window Menu Functions */
function closeApp() {
    ipcRenderer.send('close-me');
};

function minimizeApp() {
    ipcRenderer.send('minimize-me');
}

function minimizeTrayApp() {
    ipcRenderer.send('minimizeTray-me');
}

/* RPC Load Functions */
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
    var LImageText = document.getElementById('client-id-LImageText').value;
    var SImageText = document.getElementById('client-id-SImageText').value;

    if(!clientIdLogin) {
        startRPC();
        return;
    }

    if (detailText.length <= 2) { detailText = null }
    if (stateText.length <= 2) { stateText = null }

    const completeData = appendArgsToJSON([
        {details: detailText}, 
        {state: stateText}, 
        {smallImageKey: SImageKey}, 
        {largeImageKey: LImageKey}, 
        {largeImageText: LImageText}, 
        {smallImageText: SImageText}, 
        {startTimestamp: new Date()}
    ]);

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
    var clientIdLogin = document.getElementById('client-id-input').value;
    var detailText = document.getElementById('client-id-detail').value;
    var stateText = document.getElementById('client-id-state').value;
    var LImageKey = document.getElementById('client-id-LImageKey').value;
    var SImageKey = document.getElementById('client-id-SImageKey').value;
    var LImageText = document.getElementById('client-id-LImageText').value;
    var SImageText = document.getElementById('client-id-SImageText').value;

    if(!clientIdLogin) {
        startRPC();
        return;
    }

    if (detailText.length <= 2) { detailText = null }
    if (stateText.length <= 2) { stateText = null }

    const completeData = appendArgsToJSON([
        {details: detailText}, 
        {state: stateText}, 
        {smallImageKey: SImageKey}, 
        {largeImageKey: LImageKey}, 
        {largeImageText: LImageText}, 
        {smallImageText: SImageText}, 
        {startTimestamp: new Date()}
    ]);

    rpc.setActivity(completeData);
}


/* Profile data management */

function createNewProfile() {
    var savename = document.getElementById('profile-savename-input').value;
    var clientIdInput = document.getElementById('client-id-input').value;
    var detailText = document.getElementById('client-id-detail').value;
    var stateText = document.getElementById('client-id-state').value;
    var LImageKey = document.getElementById('client-id-LImageKey').value;
    var SImageKey = document.getElementById('client-id-SImageKey').value;
    var LImageText = document.getElementById('client-id-LImageText').value;
    var SImageText = document.getElementById('client-id-SImageText').value;

    var dateMonth = new Date().getMonth();
    var dateYear = new Date().getFullYear();
    var dateTime = new Date().getMilliseconds();

    if (savename == '') {
        savename = `Save - ${dateMonth + 1}/${dateYear} (${dateTime})`;
    }

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

    userData [savename] = {
        ClientID: clientIdInput,
        DetailText: detailText,
        StateText: stateText,
        LargeImageKey: LImageKey,
        SmallImageKey: SImageKey,
        LargeImageText: LImageText,
        SmallImageText: SImageText
    }
    fs.writeFile(userFL, JSON.stringify (userData, null, 4), err => {
        if (err) throw err;
        reloadProfiles(true);
        closeMenu('CreateProfileMenu', 'ProfileMenu');
        return;
    });
}

/* Loads profile data into fields */
function loadProfile() {
    var loadProfilebar = document.getElementById('profile-loadname-input').value;

    var profile = loadProfilebar;

    var clientIdInputS = document.getElementById('client-id-input');
    var detailTextS = document.getElementById('client-id-detail');
    var stateTextS = document.getElementById('client-id-state');
    var LImageKeyS = document.getElementById('client-id-LImageKey');
    var SImageKeyS = document.getElementById('client-id-SImageKey');
    var LImageTextS = document.getElementById('client-id-LImageText');
    var SImageTextS = document.getElementById('client-id-SImageText');

    clientIdInputS.value = userData[profile].ClientID
    detailTextS.value = userData[profile].DetailText
    stateTextS.value = userData[profile].StateText
    LImageTextS.value = userData[profile].LargeImageText
    SImageTextS.value = userData[profile].SmallImageText
    LImageKeyS.value = userData[profile].LargeImageKey
    SImageKeyS.value = userData[profile].SmallImageKey

    closeMenu('LoadProfileMenu', 'ProfileMenu');
}

/* Reloads Profile Cards */
function reloadProfiles () {
    let profileList = document.getElementById('profileList');

    profileCache.forEach(function (arrayItem) {
        var profiles = document.getElementById(`profile ${arrayItem}`);

        profiles.remove();
    });

    profileCache = [];

    for (var i in userData)
        profileCache.push(i);

    console.log(profileCache);

    profileCache.forEach(function (arrayItem) {
        let profile = document.createElement('li');

        profile.className = `profile ${arrayItem}`;
        profile.id = `profile ${arrayItem}`;

        profile.addEventListener('click', (onmouseup) => {
            var loadProfilebar = document.getElementById('profile-loadname-input');

            loadProfilebar.value = `${arrayItem}`;
            openMenu('ProfileMenu','ProfileSettingsMenu', `${arrayItem}`);
        });

        profile.textContent = `${arrayItem}`

        profileList.appendChild(profile);
    });
}

function deleteProfile () {
    var profileSettingsDeleteMenuInput = document.getElementById('profile-deletename-input').value;

    delete userData[profileSettingsDeleteMenuInput]

    fs.writeFile(userFL, JSON.stringify (userData, null, 4), err => {
        if (err) throw err;
        reloadProfiles();
        closeMenu('DeleteProfileMenu', 'ProfileMenu');
    });
}

function overwriteProfile () {
    var savename = document.getElementById('profile-overwritename-input').value;
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

    userData [savename] = {
        ClientID: clientIdInput,
        DetailText: detailText,
        StateText: stateText,
        LargeImageKey: LImageKey,
        SmallImageKey: SImageKey,
        LargeImageText: LImageText,
        SmallImageText: SImageText
    }
    fs.writeFile(userFL, JSON.stringify (userData, null, 4), err => {
        if (err) throw err;
        reloadProfiles(true);
        closeMenu('OverwriteProfileMenu', 'ProfileMenu');
        return;
    });
}

/* Menu Functions */

function openMenu (currentMenu, goingTo, profile) {
    var profileMenu = document.getElementById('profile-menu');
    let profileList = document.getElementById('profileList');
    var profileSelector = document.getElementById('profile-selector');
    var profileBackButton = document.getElementById('profile-back-button');
    var createNewProfileConfirm = document.getElementById('create-new-profile-confirm');
    var profileEditor = document.getElementById('profile-editor');
    var profileSettingsDiv = document.getElementById('profile-settings');
    var profileSettingsProfileName = document.getElementById('profile-settings-profile-name');
    var profileSettingsLoadMenuInput = document.getElementById('profile-loadname-input');
    var profileSettingsLoadMenu = document.getElementById('load-profile-confirm');
    var profileSettingsDeleteMenuInput = document.getElementById('profile-deletename-input');
    var profileSettingsDeleteMenu = document.getElementById('delete-profile-confirm');
    var profileSettingsOverwriteMenuInput = document.getElementById('profile-overwritename-input');
    var profileSettingsOverwriteMenu = document.getElementById('overwrite-profile-confirm');

    // Entering Profile Menu
    if (currentMenu == 'MainMenu' && goingTo == 'ProfileMenu') {    
        profileMenu.style.visibility = 'visible';
        profileSelector.style.visibility = 'visible';
        profileBackButton.style.visibility = 'visible';
    
        profileCache = [];
        reloadProfiles();
        return;
    }

    // Entering Create Profile Menu
    if (currentMenu == 'ProfileMenu' && goingTo == 'CreateProfileMenu') {
        profileSelector.style.visibility = 'hidden';
        profileBackButton.style.visibility = 'hidden';
        profileEditor.style.visibility = 'visible';
        createNewProfileConfirm.style.visibility = 'visible';
    }

    // Entering Profile Settings Menu
    if (currentMenu == 'ProfileMenu' && goingTo == 'ProfileSettingsMenu') {
        profileSettingsProfileName.textContent = `${profile}`;
        profileEditor.style.visibility = 'visible';
        profileSettingsDiv.style.visibility = 'visible';
        profileSelector.style.visibility = 'hidden';
        profileBackButton.style.visibility = 'hidden';
    }

    // Entering Load Profile Menu
    if (currentMenu == 'ProfileSettingsMenu' && goingTo == 'LoadProfileMenu') {
        profileSettingsLoadMenuInput.value = profileSettingsProfileName.textContent;
        profileSettingsDiv.style.visibility = 'hidden';
        profileSettingsLoadMenu.style.visibility = 'visible';
    }

    // Entering Delete Profile Menu
    if (currentMenu == 'ProfileSettingsMenu' && goingTo == 'DeleteProfileMenu') {
        profileSettingsDeleteMenuInput.value = profileSettingsProfileName.textContent;
        profileSettingsDiv.style.visibility = 'hidden';
        profileSettingsDeleteMenu.style.visibility = 'visible';
    }

    // Entering Overwrite Profile Menu
    if (currentMenu == 'ProfileSettingsMenu' && goingTo == 'OverwriteProfileMenu') {
        profileSettingsOverwriteMenuInput.value = profileSettingsProfileName.textContent;
        profileSettingsDiv.style.visibility = 'hidden';
        profileSettingsOverwriteMenu.style.visibility = 'visible';
    }
}

function closeMenu (currentMenu, goingTo) {
    var profilesMenu = document.getElementById('profile-menu');
    var profileSelector = document.getElementById('profile-selector');
    var profileBackButton = document.getElementById('profile-back-button');
    var createProfileButton = document.getElementById('create-profile-button');
    var savename = document.getElementById('profile-savename-input');
    var profileEditor = document.getElementById('profile-editor');
    var createNewProfileConfirm = document.getElementById('create-new-profile-confirm');
    var loadProfileConfirmDiv = document.getElementById('load-profile-confirm');
    var profileSettingsDiv = document.getElementById('profile-settings');
    var profileSettingsDeleteMenu = document.getElementById('delete-profile-confirm');
    var profileSettingsOverwriteMenu = document.getElementById('overwrite-profile-confirm');
    var profileSelector = document.getElementById('profile-selector');

    // Leaving Profile Menu
    if (currentMenu == 'ProfileMenu' && goingTo == 'MainMenu') {
        profilesMenu.style.visibility = 'hidden';
        profileSelector.style.visibility = 'hidden';
        profileBackButton.style.visibility = 'hidden';
    
        profileCache.forEach(function (arrayItem) {
            var profiles = document.getElementById(`profile ${arrayItem}`);
    
            profiles.remove();
        });

        return;
    }

    // Leaving Create Profile Menu
    if (currentMenu == 'CreateProfileMenu' && goingTo == 'ProfileMenu') {
        savename.value = '';

        createNewProfileConfirm.style.visibility = 'hidden';
        profileEditor.style.visibility = 'hidden';
        profileSelector.style.visibility = 'visible';
        profileBackButton.style.visibility = 'visible';

        return;
    }

    // Leaving Load Profile Menu
    if (currentMenu == 'LoadProfileMenu' && goingTo == 'ProfileMenu') {
        profileEditor.style.visibility = 'hidden';
        loadProfileConfirmDiv.style.visibility = 'hidden';
        profileSelector.style.visibility = 'visible';
        profileBackButton.style.visibility = 'visible';
    }

    // Leaving Profile Settings Menu
    if (currentMenu == 'ProfileSettingsMenu' && goingTo == 'ProfileMenu') {
        profileEditor.style.visibility = 'hidden';
        profileSettingsDiv.style.visibility = 'hidden';
        profileSelector.style.visibility = 'visible';
        profileBackButton.style.visibility = 'visible';
    }

    //Leaving Delete Profile Menu
    if (currentMenu == 'DeleteProfileMenu' && goingTo == 'ProfileMenu') {
        profileSettingsDeleteMenu.style.visibility = 'hidden';
        profileEditor.style.visibility = 'hidden';
        profileSelector.style.visibility = 'visible';
        profileBackButton.style.visibility = 'visible';
    }

    //Leaving Overwrite Profile Menu
    if (currentMenu == 'OverwriteProfileMenu' && goingTo == 'ProfileMenu') {
        profileSettingsOverwriteMenu.style.visibility = 'hidden';
        profileEditor.style.visibility = 'hidden';
        profileSelector.style.visibility = 'visible';
        profileBackButton.style.visibility = 'visible';
    }
}