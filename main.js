window.addEventListener("load", () => {	
	//var width= canvas.width= "1336";
	width= canvas.width= window.innerWidth;
	height= canvas.height= window.innerHeight;

	context= canvas.getContext("2d");
	console.log("begin animation!");
	context.translate(width / 2, height / 2);
	context.transform(1, 0, 0, -1, 0, 0);
	context.lineWidth= 3;
	//context.transform(1, 0, 0, -1, 0, canvas.height)  for cartecian cordinate system with origin at bottom left of screen
	Start();
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
		eventSystem.dispatchEvent("onLevelComplete");
	});

	window.addEventListener("onLevelComplete", () => {
		timeOut.newTimeOut(spawnExit, 1000);
	});

	window.addEventListener("onStartNextLevel", () => drawRouteIntro());

	window.addEventListener("onIntroComplete", () => {
		timeOut.newTimeOut(() => {
			window.player= spawnPlayer();
			MrMonstro(player);
		}, 1000);
	});

	window.addEventListener("onLevelExit", () => {
		timeOut.newTimeOut(drawRouteOutro, 1000);
	});
};

const Start= () => {
	setupEvents();
	clearCanvas();

	eventSystem.dispatchEvent("onStartNextLevel");
	
	getNewFrame();

};

const Update= () => {
	timeOut && timeOut.update();
	interval && interval.update();
	clearCanvas();
	
	//for(i=0; i< 20000000; i++);

	gameObjectList.forEach((itm, indx) => {
		itm.executeScripts();
	});
	
	nurdyStats2.innerHTML= gameObjectList.length;

	getNewFrame();
}
