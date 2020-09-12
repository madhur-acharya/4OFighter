window.addEventListener("load", () => {	
	//var width= canvas.width= "1336";
	width= canvas.width= window.innerWidth;
	height= canvas.height= window.innerHeight;

	context= canvas.getContext("2d");
	context.translate(width / 2, height / 2);
	context.transform(1, 0, 0, -1, 0, 0);
	context.lineWidth= 3;
	//context.transform(1, 0, 0, -1, 0, canvas.height)  for cartecian cordinate system with origin at bottom left of screen

	setupEvents();
	clearCanvas();
});

window.addEventListener("keyup", event => {
	if(event.keyCode == 27)
	{
		isPaused= !isPaused;
		if(isPaused == false)
		{
			getNewFrame();
		}
	}
});

const clearCanvas= () => {
	context.fillStyle= "black";
	context.fillRect(-width / 2, -height / 2, width, height);
}

const getNewFrame= () => {
	
	if(isPaused)
	{
		context.save();
		context.scale(1, -1);
		context.fillStyle = "white";
		context.font = "50px impact";
		context.textAlign = "center";
		context.fillText("PAUSED!", 0, -100);
		context.restore();
		cancelAnimationFrame(aniId); 
	}
	else
	{
		aniId= requestAnimationFrame((timestamp) => {
			timePerFrame= timestamp - lastTime;
			time+= timePerFrame;
			seconds= Math.round(time / 1000);
			halfSecond= Math.round(time / 500);
			tenthOfSecond= Math.round(time / 100);
			hundredthOfSecond= Math.round(time / 10);
			deltaTime= fps > 0 ? (60 / fps) : 1;
			fps= Math.ceil(1000 / timePerFrame);
			lastTime= timestamp;
			framerateTag.innerHTML= "FPS: " + fps + " , DeltaTime: " + Math.round(deltaTime);
			nurdyStats.innerHTML= "Time: " + seconds;
			Update();
		});
	}
};

const setupEvents= () => {
	window.addEventListener("onBossDeath", () => {
		gameObjectList= [player];
		eventSystem.dispatchEvent("onLevelComplete");
	});

	window.addEventListener("onLevelComplete", () => {
		timeOut.newTimeOut(spawnExit, 1000);
	});

	window.addEventListener("onStartNextLevel", () => {
		levelList.shift();

		if(levelList.length <= 0)
		{
			eventSystem.dispatchEvent("onGameComplete");
		}
		else
			drawRouteIntro(levelList[0].route);
	});

	window.addEventListener("onIntroComplete", () => {
		timeOut.newTimeOut(() => {
			if(!player)
				player= spawnPlayer();
			else
				gameObjectList= [player];

			levelList[0].level(player);
		}, 1000);
	});

	window.addEventListener("onOutroComplete", () => {
		timeOut.newTimeOut(() => {
			eventSystem.dispatchEvent("onStartNextLevel");
		}, 1000);
	});

	window.addEventListener("onLevelExit", () => {
		if(player) player.position= new Vector(0, -height / 3);
		gameObjectList.length= 0;
		timeOut.newTimeOut(() => drawRouteOutro(levelList[0].route), 1000);
	});

	window.addEventListener("onPlayerDeath", () => {
		player= spawnPlayer();
		gameObjectList.length= 0;
		playerDeathScene();
	});

	window.addEventListener("onLevelRestart", () => {
		drawRouteIntro(levelList[0].route);
	});

	window.addEventListener("onGameComplete", () => {
		gameObjectList.length= 0;
		canvas.hidden= true;
		isPaused= true;
		gameComplete= true;

		eventSystem.dispatchEvent("onShowEndGameScene");
	});

	window.addEventListener("onTutorialComplete", () => {
		player.position= new Vector(0, 0);
		eventSystem.dispatchEvent("onStartNextLevel");
	});

	window.addEventListener("onGameStart", () => {
		Start();
	});
};

const Start= () => {
	console.log("begin animation!");

	levelList= [
		{level: () => {}, route: "tutorial"},
		{level : startLevel1, route: "index.html"}, 
		{level :startLevel2, route: "cats.jpg"}, 
		{level :startLevel3, route : "download-free-ram.php"}
	];

	tutorialScreen();
	player= spawnPlayer();

	getNewFrame();

};

const Update= () => {
	timeOut && timeOut.update();
	interval && interval.update();
	clearCanvas();
	
	gameObjectList.forEach((itm, indx) => {
		itm.executeScripts();
	});
	
	nurdyStats2.innerHTML= gameObjectList.length;

	getNewFrame();
}
