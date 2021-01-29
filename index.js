const RPC = require('discord-rpc');
const {ipcRenderer} = require('electron');
var fs = require('fs');

var isRPCon = false;

userData = require ('./userData.json');

/* Window Menu Functions */
function closeApp() {
    ipcRenderer.send('close-me');
};

function minimizeApp() {
    ipcRenderer.send('minimize-me');
}

function maximizeApp() {
    ipcRenderer.send('maximize-me');
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

    if (detailText) {
        if (detailText.length >= 2) {
            var detailJson = {
                details: `${detailText}`
            }
        }
    }

    if (stateText) {
        if (stateText.length >= 2) {
            var stateJson = {
                state: `${stateText}`
            }
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
        startTimestamp: new Date()
    }

    var completeData = Object.assign({}, detailJson, stateJson, SImageKeyJson, LImageKeyJson, LImageTextJson, SImageTextJson, extraJson);

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

    if (detailText) {
        if (detailText.length >= 2) {
            var detailJson = {
                details: `${detailText}`
            }
        }
    }

    if (stateText) {
        if (stateText.length >= 2) {
            var stateJson = {
                state: `${stateText}`
            }
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
        startTimestamp: new Date()
    }

    var completeData = Object.assign({}, detailJson, stateJson, SImageKeyJson, LImageKeyJson, LImageTextJson, SImageTextJson, extraJson);

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
    fs.writeFile("./userData.json", JSON.stringify (userData, null, 4), err => {
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
        var fieldProfiles = document.getElementById(`fieldProfile ${arrayItem}`);

        fieldProfiles.remove();
    });

    profileCache = [];

    for (var i in userData)
        profileCache.push(i);

    console.log(profileCache);

    profileCache.forEach(function (arrayItem) {
        let fieldProfile = document.createElement('li');

        fieldProfile.className = `fieldProfile ${arrayItem}`;
        fieldProfile.id = `fieldProfile ${arrayItem}`;

        fieldProfile.addEventListener('click', (onmousedown) => {
            var loadProfilebar = document.getElementById('profile-loadname-input');

            loadProfilebar.value = `${arrayItem}`;
            openMenu('ProfileMenu','ProfileSettingsMenu', `${arrayItem}`);
        });

        fieldProfile.textContent = `${arrayItem}`

        profileList.appendChild(fieldProfile);
    });
}

function deleteProfile () {
    var profileSettingsDeleteMenuInput = document.getElementById('profile-deletename-input').value;

    delete userData[profileSettingsDeleteMenuInput]

    fs.writeFile("./userData.json", JSON.stringify (userData, null, 4), err => {
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
    fs.writeFile("./userData.json", JSON.stringify (userData, null, 4), err => {
        if (err) throw err;
        reloadProfiles(true);
        closeMenu('OverwriteProfileMenu', 'ProfileMenu');
        return;
    });
}

/* Menu Functions */

function openMenu (currentMenu, goingTo, profile) {

    // Entering Profile Menu
    if (currentMenu == 'MainMenu' && goingTo == 'ProfileMenu') {
        var fieldProfilesMenu = document.getElementById('field-profiles');
        let profileList = document.getElementById('profileList');
        var fieldSelectorDiv = document.getElementById('field-selector-div');
        var fieldProfileBackButton = document.getElementById('field-back-button');
    
        fieldProfilesMenu.style.visibility = 'visible';
        fieldSelectorDiv.style.visibility = 'visible';
        fieldProfileBackButton.style.visibility = 'visible';
    
        profileCache = [];
    
        for (var i in userData)
            profileCache.push(i);
    
        console.log(profileCache);
    
        profileCache.forEach(function (arrayItem) {
            let fieldProfile = document.createElement('li');
    
            fieldProfile.className = `fieldProfile ${arrayItem}`;
            fieldProfile.id = `fieldProfile ${arrayItem}`;
    
            fieldProfile.addEventListener('click', (onmousedown) => {
                var loadProfilebar = document.getElementById('profile-loadname-input');

                loadProfilebar.value = `${arrayItem}`;
                openMenu('ProfileMenu','ProfileSettingsMenu', `${arrayItem}`);
            });
    
            fieldProfile.textContent = `${arrayItem}`
    
            profileList.appendChild(fieldProfile);
        });

        return;
    }

    // Entering Create Profile Menu
    if (currentMenu == 'ProfileMenu' && goingTo == 'CreateProfileMenu') {
        var fieldSelectorDiv = document.getElementById('field-selector-div');
        var fieldProfileBackButton = document.getElementById('field-back-button');
        var createNewProfileConfirm = document.getElementById('create-new-profile-confirm');
        var profileEditorDiv = document.getElementById('field-profile-editor-div');

        fieldSelectorDiv.style.visibility = 'hidden';
        fieldProfileBackButton.style.visibility = 'hidden';
        profileEditorDiv.style.visibility = 'visible';
        createNewProfileConfirm.style.visibility = 'visible';
    }

    // Entering Profile Settings Menu
    if (currentMenu == 'ProfileMenu' && goingTo == 'ProfileSettingsMenu') {
        var fieldSelectorDiv = document.getElementById('field-selector-div');
        var profileSettingsDiv = document.getElementById('profile-settings');
        var fieldProfileBackButton = document.getElementById('field-back-button');
        var fieldProfileEditorDiv = document.getElementById('field-profile-editor-div');
        var profileSettingsText = document.getElementById('profile-settings-text');

        profileSettingsText.textContent = `${profile}`;
        fieldProfileEditorDiv.style.visibility = 'visible';
        profileSettingsDiv.style.visibility = 'visible';
        fieldSelectorDiv.style.visibility = 'hidden';
        fieldProfileBackButton.style.visibility = 'hidden';
    }

    // Entering Load Profile Menu
    if (currentMenu == 'ProfileSettingsMenu' && goingTo == 'LoadProfileMenu') {
        var profileSettingsDiv = document.getElementById('profile-settings');
        var profileSettingsText = document.getElementById('profile-settings-text');
        var profileSettingsLoadMenuInput = document.getElementById('profile-loadname-input');
        var profileSettingsLoadMenu = document.getElementById('load-profile-confirm');

        profileSettingsLoadMenuInput.value = profileSettingsText.textContent;
        profileSettingsDiv.style.visibility = 'hidden';
        profileSettingsLoadMenu.style.visibility = 'visible';
    }

    // Entering Delete Profile Menu
    if (currentMenu == 'ProfileSettingsMenu' && goingTo == 'DeleteProfileMenu') {
        var profileSettingsText = document.getElementById('profile-settings-text');
        var profileSettingsDeleteMenuInput = document.getElementById('profile-deletename-input');
        var profileSettingsDiv = document.getElementById('profile-settings');
        var profileSettingsDeleteMenu = document.getElementById('delete-profile-confirm');

        profileSettingsDeleteMenuInput.value = profileSettingsText.textContent;
        profileSettingsDiv.style.visibility = 'hidden';
        profileSettingsDeleteMenu.style.visibility = 'visible';
    }

    // Entering Overwrite Profile Menu
    if (currentMenu == 'ProfileSettingsMenu' && goingTo == 'OverwriteProfileMenu') {
        var profileSettingsOverwriteMenuInput = document.getElementById('profile-overwritename-input');
        var profileSettingsOverwriteMenu = document.getElementById('overwrite-profile-confirm');
        var profileSettingsText = document.getElementById('profile-settings-text');
        var profileSettingsDiv = document.getElementById('profile-settings');

        profileSettingsOverwriteMenuInput.value = profileSettingsText.textContent;
        profileSettingsDiv.style.visibility = 'hidden';
        profileSettingsOverwriteMenu.style.visibility = 'visible';
    }
}

function closeMenu (currentMenu, goingTo) {

    // Leaving Profile Menu
    if (currentMenu == 'ProfileMenu' && goingTo == 'MainMenu') {
        var fieldProfilesMenu = document.getElementById('field-profiles');
        var fieldSelectorDiv = document.getElementById('field-selector-div');
        var fieldProfileBackButton = document.getElementById('field-back-button');
        var createProfileButton = document.getElementById('create-profile-button');
    
        fieldProfilesMenu.style.visibility = 'hidden';
        fieldSelectorDiv.style.visibility = 'hidden';
        fieldProfileBackButton.style.visibility = 'hidden';
    
        profileCache.forEach(function (arrayItem) {
            var fieldProfiles = document.getElementById(`fieldProfile ${arrayItem}`);
    
            fieldProfiles.remove();
        });

        return;
    }

    // Leaving Create Profile Menu
    if (currentMenu == 'CreateProfileMenu' && goingTo == 'ProfileMenu') {
        var savename = document.getElementById('profile-savename-input');
        var profileEditorDiv = document.getElementById('field-profile-editor-div');
        var fieldSelectorDiv = document.getElementById('field-selector-div');
        var fieldProfileBackButton = document.getElementById('field-back-button');
        var createNewProfileConfirm = document.getElementById('create-new-profile-confirm');
        

        savename.value = '';

        createNewProfileConfirm.style.visibility = 'hidden';
        profileEditorDiv.style.visibility = 'hidden';
        fieldSelectorDiv.style.visibility = 'visible';
        fieldProfileBackButton.style.visibility = 'visible';

        return;
    }

    // Leaving Load Profile Menu
    if (currentMenu == 'LoadProfileMenu' && goingTo == 'ProfileMenu') {
        var loadProfileConfirmDiv = document.getElementById('load-profile-confirm');
        var fieldSelectorDiv = document.getElementById('field-selector-div');
        var fieldProfileBackButton = document.getElementById('field-back-button');
        var fieldProfileEditorDiv = document.getElementById('field-profile-editor-div');

        fieldProfileEditorDiv.style.visibility = 'hidden';
        loadProfileConfirmDiv.style.visibility = 'hidden';
        fieldSelectorDiv.style.visibility = 'visible';
        fieldProfileBackButton.style.visibility = 'visible';
    }

    // Leaving Profile Settings Menu
    if (currentMenu == 'ProfileSettingsMenu' && goingTo == 'ProfileMenu') {
        var profileSettingsDiv = document.getElementById('profile-settings');
        var fieldProfileEditorDiv = document.getElementById('field-profile-editor-div');
        var fieldSelectorDiv = document.getElementById('field-selector-div');
        var fieldProfileBackButton = document.getElementById('field-back-button');

        fieldProfileEditorDiv.style.visibility = 'hidden';
        profileSettingsDiv.style.visibility = 'hidden';
        fieldSelectorDiv.style.visibility = 'visible';
        fieldProfileBackButton.style.visibility = 'visible';
    }

    //Leaving Delete Profile Menu
    if (currentMenu == 'DeleteProfileMenu' && goingTo == 'ProfileMenu') {
        var profileSettingsDeleteMenu = document.getElementById('delete-profile-confirm');
        var fieldProfileEditorDiv = document.getElementById('field-profile-editor-div');
        var fieldSelectorDiv = document.getElementById('field-selector-div');
        var fieldProfileBackButton = document.getElementById('field-back-button');

        profileSettingsDeleteMenu.style.visibility = 'hidden';
        fieldProfileEditorDiv.style.visibility = 'hidden';
        fieldSelectorDiv.style.visibility = 'visible';
        fieldProfileBackButton.style.visibility = 'visible';
    }

    //Leaving Overwrite Profile Menu
    if (currentMenu == 'OverwriteProfileMenu' && goingTo == 'ProfileMenu') {
        var profileSettingsOverwriteMenu = document.getElementById('overwrite-profile-confirm');
        var fieldProfileEditorDiv = document.getElementById('field-profile-editor-div');
        var fieldSelectorDiv = document.getElementById('field-selector-div');
        var fieldProfileBackButton = document.getElementById('field-back-button');

        profileSettingsOverwriteMenu.style.visibility = 'hidden';
        fieldProfileEditorDiv.style.visibility = 'hidden';
        fieldSelectorDiv.style.visibility = 'visible';
        fieldProfileBackButton.style.visibility = 'visible';
    }
}