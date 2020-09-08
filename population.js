canvas= document.getElementById("my_canvas");
framerateTag= document.getElementById("framerate");
nurdyStats= document.getElementById("nurdy_stats");
nurdyStats2= document.getElementById("nurdy_stats2");
nurdyStats3= document.getElementById("nurdy_stats3");
boss1Sprite= document.getElementById("boss1");
window.onerror= err => console.log(err);

eventSystem.createEvent("onBossDeath");
eventSystem.createEvent("onLevelComplete");
eventSystem.createEvent("onLevelExit");
eventSystem.createEvent("onStartNextLevel");
eventSystem.createEvent("onIntroComplete");
eventSystem.createEvent("onOutroComplete");
eventSystem.createEvent("onlifeLost");
eventSystem.createEvent("onPlayerDeath");
eventSystem.createEvent("onLevelRestart");
eventSystem.createEvent("onGameComplete");

var isPaused= false,
	showPausedMessage= true,
	aniId, 
	context,
	framerateTag,
	canvas,
	width= 0,
	height= 0,
	lastTime= 0, 
	fps= 60, 
	timePerFrame= 1 / 60,
	deltaTime= 1,
	time= 0,
	seconds= 0
	halfSecond= 0,
	quarterSecond= 0
	lives= 3;

var player;

var gameObjectList= [],
	bossList= [],
	levelList= [],
	routeList= ["index.html", "login", "cats.jpg", "download-free-ram.php"];

//collision arrays
var projectiles= []

