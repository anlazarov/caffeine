/* Caffeine main event javascript v2 */

var storage = chrome.storage.local;
var enabled = false;
initStorage();

// init storage engine on load
function initStorage() {
	storage.get('enabled', function(result){
		//console.log(result['enabled']);
		if(result['enabled'] === undefined) {
			enabled = true;
		} else {
			enabled = result['enabled'];
		}
		if(enabled) {
			caffeineEnable();
		} else {
			caffeineDisable();
		}
	});
}
// saves the current value of enabled to storage
function saveStorage() {
	storage.set({'enabled':enabled}, function() { console.log('saved in chrome.storage.local: '+enabled); });
}
//shows a notification telling the user that Caffeine has been enabled
function showNotification() {
   chrome.notifications.create("welcome", {
      type: "basic",
      iconUrl: "caffeineEnabled.png",
      title: "Caffeine Enabled!",
      message: "Your Chromebook now has a good supply of Caffeine and will stay awake forever! (meaning that automatic power management has been disabled) You can always take away the Caffeine (in effect turn back on the automatic power management) by clicking / toggling the Caffeine extension icon."
	}, function (notificationId) {
	   //callback needs to be included for notifications to work!
	});
}
// toggles the power management to off
function caffeineEnable() {
	chrome.power.requestKeepAwake("display");
	chrome.browserAction.setIcon({path: '/caffeineEnabled.png'});
	//chrome.browserAction.setBadgeText({ text: "c" });
	//console.log('requestKeepAwake: '+enabled);
	saveStorage();
   showNotification();
}
// re-engages the system power management
function caffeineDisable() {
	chrome.power.releaseKeepAwake();
	chrome.browserAction.setIcon({path: '/caffeineDisabled.png'});
	//chrome.browserAction.setBadgeText({ text: '0'});
	//console.log('releaseKeepAwake: '+enabled);
	saveStorage();
}
//listens for events when storage changes (debug)
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        //console.log('Storage key "%s" in namespace "%s" changed. Old value was: %s, new value is: %s', key, namespace, storageChange.oldValue, storageChange.newValue);
    }
});
// listens for events when the button is toggled
chrome.browserAction.onClicked.addListener(function() {
	if(!enabled) {
		enabled = true;
		caffeineEnable();
	} else {
		enabled = false;
		caffeineDisable();
	}
});

// coming soon: chrome.alarms
// http://developer.chrome.com/extensions/alarms.html
