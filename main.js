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

const Start= () => {
	clearCanvas();

	const enemy= new GameObject(gameObjectList);
	enemy.alias= "enemy";
	enemy.layer= "projectile";
	//enemy.drawGizmos= true;
	enemy.position= new Vector(0, 200);
	enemy.renderer= drawBoss1;
	enemy.addCollider({
		type: "circle",
		radius: 80,
		onCollision: (current, other) => {
			enemy.renderer= obj => drawBoss1(obj, true);
			timeOut.newTimeOut(() => {
				enemy.renderer= drawBoss1;
			}, 20)
		}
	});

	const player= new GameObject(gameObjectList);
	player.alias= "player";
	player.health= 5;
	player.layer= "projectile";
	player.position= new Vector(0, -height / 3);
	player.renderer= drawSpaceship;
	player.executables.unshift(playerMovementSnappy);
	player.addTimer("firerate", new timer());
	player.firerate= 150;
	player.drawGizmos= true;
	player.addCollider({
		type: "circle",
		radius: 15,
		onCollision: (current, other) => {
			if(other.alias == "asteroid")
			{
				current.health-= 1;
				if(current.health <= 0)
				{
					current.destroy();
				}
			}
		}
	});

	for(let i= 0; i < 5; i++)
	{
		const ast= new Asteroid(gameObjectList, getRandomVector());
		ast.velocity= new Vector(0, -2);
		ast.alias= "asteroid";
		ast.layer= "projectile";
		ast.addCollider({
			type: "circle",
			radius: 50,
			uncolide: true,
			onCollision: (current, other) => {
				if(other.alias == "bullet")
				{
					current.health-= 1;
					if(current.health <= 0)
					{
						current.destroy();
					}
				}
			}
		});
		ast.destroy(10000);
	}

	getNewFrame();
};

const Update= () => {
	timeOut.update();
	clearCanvas();
	//for(i=0; i< 20000000; i++);

	gameObjectList.forEach((itm, indx) => {
		itm.executeScripts();
	});
	
	nurdyStats2.innerHTML= gameObjectList.length;

	getNewFrame();
}
