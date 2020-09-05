const spawnPlayer= () => {
	const player= new GameObject(gameObjectList);
	player.alias= "player";
	player.health= 10;
	player.healthCap= 10;
	player.layer= "projectile";
	player.damage= 1;
	player.position= new Vector(0, -height / 3);
	player.renderer= drawSpaceship;
	player.executables.unshift(playerMovementSnappy);
	player.executables.push(obj => drawDossHealthBar(obj, new Vector(-(width/2) + 120, 20), 200, ["brown", "green"]));
	player.addTimer("firerate", new timer());
	player.firerate= 100;
	//player.drawGizmos= true;
	player.addCollider({
		type: "circle",
		radius: 15,
		uncolide: true,
		onCollision: (current, other) => {
			if(other.alias === "asteroid" || other.alias === "enemy" || other.alias === "enemyProjectile")
			{
				if(!current.disableCollisionDetection)
				{
					current.health-= 1;
					other.velocity= new Vector(-other.velocity.x, -other.velocity.y);
					current.disableCollisionDetection= true;
					timeOut.newTimeOut(() => {
						current.disableCollisionDetection= false;
					}, 100);
				}
				
				if(current.health <= 0)
				{
					current.destroy();
				}
			}
		}
	});
	return player;
};

function drawSpaceship(gameObject)
{
	context.save();
	context.translate(gameObject.position.x, gameObject.position.y);
	context.rotate(gameObject.shootDirection || 0);
	context.beginPath();
	context.fillStyle= "white";
	context.moveTo(25, 0);
	context.lineTo(-10, -15);
	context.lineTo(0, 0);
	context.lineTo(-10, 15);
	context.lineTo(25, 0);
	context.fill();

	if(hundredthOfSecond % 2 == true)
	{
		context.strokeStyle= "red";
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(-10, 3);
		context.moveTo(0, 0);
		context.lineTo(-10, -3);
		context.moveTo(0, 0);
		context.lineTo(-15, 0);
		context.stroke();
	}
	context.restore();
};

function spawnTheHive(layer= [], player, delay= 3000, spawnsPerRound= 5)
{
	const TheHive= new GameObject(layer);
	TheHive.alias= "enemy";
	TheHive.layer= "projectile";
	TheHive.health= 100;
	TheHive.healthCap= 100;
	TheHive.executables.push(drawDossHealthBar);

	TheHive.addCollider({
		type: "circle",
		radius: 25,
		uncolide: false,
		onCollision: (current, other) => {
			if(other.alias === "playerProjectile")
			{
				current.health-= other.damage || 1;
				if(current.health <= 0)
				{
					current.destroy();
					interval.clearInterval(current.intervalId);
				}
			}
		}
	});

	TheHive.renderer= gameObject => {
		context.save();
		context.translate(gameObject.position.x, gameObject.position.y);
		context.beginPath();
		context.fillStyle= "white";
		context.arc(0, 0, gameObject.collider.radius, 0, Math.PI * 2);
		context.fill();
		context.restore();
	};

	TheHive.intervalId= interval.newInterval(() => {
		let slice= (Math.PI * 2) / spawnsPerRound, 
		angle= 0;
		for(let i= 0; i < spawnsPerRound; i++)
		{
			const vel= new Vector(0, 0);
			vel.setMag(5);
			vel.setAngle(angle);

			spawnKaamakazi(player, new Vector(0, 0), vel), 2000;
			angle= angle + slice;
		}
	}, delay);

	return spawnTheHive;
}


function spawnKaamakazi(player, position= new Vector(), velocity= getRandomVector(5,5), delay= 1000)
{
	const kaamakazi= new GameObject(gameObjectList, position, velocity);
	kaamakazi.alias= "enemy";
	kaamakazi.layer= "projectile";
	kaamakazi.type= "kaamakazi";
	kaamakazi.health= 1;
	kaamakazi.healthCap= 1;
	kaamakazi.velocityCap= Math.round(Math.random() * 5 + 1);
	kaamakazi.disableCollisionDetection= true;

	kaamakazi.renderer= (gameObject, damaged= false) => {

		context.beginPath();
		context.strokeStyle= "white";
		context.fillStyle= "white";
		context.save();
		context.translate(gameObject.position.x, gameObject.position.y);
		context.rotate(gameObject.velocity.getAngle() - Math.PI / 2);
		context.arc(0, 0, gameObject.collider.radius, 0, Math.PI * 2);
		context.moveTo(-(gameObject.collider.radius), 0);
		context.lineTo(0, -gameObject.collider.radius * 3);
		context.lineTo((gameObject.collider.radius), 0);
		context.fill();
		context.restore();
	};

	kaamakazi.addCollider({
		type: "circle",
		radius: 10,
		uncolide: true,
		computeBoundryCollision: false,
		onCollision: (current, other) => {
			if(other.alias === "playerProjectile")
			{
				current.health-= other.damage || 1;
				if(current.health <= 0)
				{
					current.destroy();
				}
			}
			else if(other.type === "kaamakazi")
			{
				current.velocity= Vector.addition(current.velocity, getRandomVector(1, 1)) ;
			}
		}
	});

	timeOut.newTimeOut(() => {
		kaamakazi.acceleration= new Vector(0.5, 0);
		kaamakazi.disableCollisionDetection= false;
		kaamakazi.executables.unshift(gameObject => {
			const temp_vect= Vector.subtraction(player.position, gameObject.position);
			gameObject.acceleration.setAngle(temp_vect.getAngle());
		});
	}, delay);

	return kaamakazi;
}

function spawnTurret(player)
{
	const turret= new GameObject(gameObjectList);
	turret.alias= "enemy";
	turret.layer= "projectile";
	turret.health= 10;
	turret.healthCap= 10;
	turret.addTimer("firerate", new timer());
	turret.firerate= 500;

	turret.renderer= (gameObject, damaged= false) => {
		const temp_vect= Vector.subtraction(player.position, gameObject.position);
		gameObject.shootDirection= temp_vect.getAngle();

		context.beginPath();
		context.strokeStyle= "white";
		context.fillStyle= "white";
		context.save();
		context.translate(gameObject.position.x, gameObject.position.y);
		context.rotate(gameObject.shootDirection - Math.PI / 2);
		context.arc(0, 0, gameObject.collider.radius, 0, Math.PI * 2);
		context.fill();
		context.moveTo(0, 0);
		context.fillRect(-10, 0, 20, 3 * gameObject.collider.radius / 2);
		context.restore();
	};

	turret.addCollider({
		type: "circle",
		radius: 25,
		uncolide: true,
		computeBoundryCollision: false,
		onCollision: (current, other) => {
			if(other.alias === "playerProjectile")
			{
				turret.health-= other.damage || 1;
				if(turret.health <= 0)
				{
					current.destroy();
				}
			}
		}
	});

	turret.executables.unshift(gameObject => {

		if(gameObject.timers.firerate)
		{	
			if(gameObject.timers.firerate.getDuration() > (gameObject.firerate || 250))
			{
				gameObject.timers.firerate.reset();

				const proj= new Projectile(gameObjectList, new Vector(gameObject.position.x, gameObject.position.y), 10, gameObject.shootDirection, 10);
				proj.alias= "enemyProjectile";
			}
		}
	});

	return turret;
}

function spawnChaser(player)
{
	const dir= (Math.random() * 360) * Math.PI / 180,
		a= (width / 2) * Math.cos(dir),
		b= (width / 2) * Math.sin(dir);
	const vect= new Vector(a, b);

	const chaser= new GameObject(gameObjectList, vect, new Vector(Math.random() * 3, 0));
	chaser.alias= "enemy";
	chaser.layer= "projectile";
	chaser.health= 3;
	chaser.healthCap= 3;
	chaser.addTimer("firerate", new timer());
	chaser.firerate= 750;

	chaser.renderer= (gameObject, damaged= false) => {

		context.beginPath();
		context.strokeStyle= "white";
		context.fillStyle= "white";
		context.save();
		context.translate(gameObject.position.x, gameObject.position.y);
		context.rotate(gameObject.velocity.getAngle() - Math.PI / 2);
		context.arc(0, 0, gameObject.collider.radius, 0, Math.PI * 2);
		context.fill();
		context.moveTo(-(gameObject.collider.radius), 0);
		context.lineTo(-(gameObject.collider.radius * 1.5), -gameObject.collider.radius * 2.5);
		context.moveTo((gameObject.collider.radius), 0);
		context.lineTo((gameObject.collider.radius * 1.5), -gameObject.collider.radius * 2.5);
		context.moveTo(0, -(gameObject.collider.radius));
		context.lineTo(0, -gameObject.collider.radius * 3);
		context.stroke();
		context.restore();
	};

	chaser.addCollider({
		type: "circle",
		radius: 25,
		uncolide: true,
		computeBoundryCollision: false,
		onCollision: (current, other) => {
			if(other.alias === "playerProjectile")
			{
				chaser.health-= other.damage || 1;
				if(chaser.health <= 0)
				{
					current.destroy();
				}
			}
		}
	});

	chaser.executables.unshift(gameObject => {
		const temp_vect= Vector.subtraction(player.position, gameObject.position);
		gameObject.shootDirection= temp_vect.getAngle();

		temp_vect.setMag(gameObject.velocity.getMag());
		gameObject.velocity= temp_vect;

		if(gameObject.timers.firerate)
		{	
			if(gameObject.timers.firerate.getDuration() > (gameObject.firerate || 250))
			{
				gameObject.timers.firerate.reset();

				const proj= new Projectile(gameObjectList, new Vector(gameObject.position.x, gameObject.position.y), 7, temp_vect.getAngle(), 7);
				proj.alias= "enemyProjectile";
			}
		}
	});

	return chaser;
}

function theDuke()
{
	let dukeCount= 0;

	const dukeSpawner= (positon= new Vector(0, 0), number= 1, size= 100, health= 10, vertices= 20) => {
		for(let i= 0; i < number; i++)
		{
			dukeCount++;

			const duke= new Asteroid(gameObjectList, positon, vertices);
			duke.velocity= getRandomVector(5, 5);
			duke.alias= "asteroid";
			duke.layer= "projectile";
			duke.health= health;
			duke.healthCap= health;
			duke.executables.push(gameObject => {
				const pos= new Vector(gameObject.position.x - (gameObject.collider.radius / 2), gameObject.position.y + (gameObject.collider.radius));
				const thickness= 7;
				const colors= ["brown", "red"];
				
				context.save();
				context.translate(pos.x, pos.y);
				context.beginPath();
				context.fillStyle= colors[0];
				context.fillRect(0, 0, 100, thickness);
				context.fillStyle= colors[1];
				const widthPerHP= 100 / gameObject.healthCap;
				const currentHP= gameObject.healthCap - gameObject.health;
				let health= 100 - currentHP * widthPerHP;
				context.fillRect(0, 0, health, thickness);
				context.restore();
			});
			//duke.drawGizmos= true;
			duke.addCollider({
				type: "circle",
				radius: size,
				uncolide: true,
				computeBoundryCollision: true,
				onCollision: (current, other) => {
					if(other.alias === "playerProjectile")
					{
						duke.health-= 1;
						if(duke.health <= 0)
						{
							if(size > 20)
							{
								dukeSpawner(current.position, 2, size - 20, health / 2);
							}
							dukeCount--;
							if(dukeCount <= 0)
								eventSystem.dispatchEvent("onBossDeath");
							current.destroy();
						}
					}
				}
			});
		}
	};

	dukeSpawner();
};

function MrMonstro(player)
{
	const monstro= new GameObject(gameObjectList, getRandomVector());
	monstro.alias= "enemy";
	monstro.layer= "projectile";
	monstro.health= 175;
	monstro.healthCap= 175;
	monstro.addTimer("firerate", new timer());
	monstro.firerate= 500;
	monstro.movementTick= false;

	monstro.executables.push(drawDossHealthBar);

	monstro.renderer= (gameObject, damaged= false) => {
		context.save();
		context.translate(gameObject.position.x, gameObject.position.y);
		context.beginPath();
		context.fillStyle= damaged ? "crimson" : "red";
		context.arc(0, 0, gameObject.collider.radius, 0, Math.PI * 2);
		context.fill();
		context.restore();
	};

	monstro.addCollider({
		type: "circle",
		radius: 50,
		uncolide: true,
		computeBoundryCollision: true,
		onCollision: (current, other) => {
			if(other.alias === "playerProjectile")
			{
				monstro.health-= other.damage || 1;
				if(monstro.health <= 0)
				{
					current.destroy();
					interval.clearInterval(current.intervalId);
					eventSystem.dispatchEvent("onBossDeath");
				}
			}
		}
	});

	monstro.intervalId= interval && interval.newInterval(() => {
		if(monstro.movementTick === false)
		{
			const temp_vect= Vector.subtraction(player.position, monstro.position);
			temp_vect.setMag(5);
			monstro.velocity= temp_vect;
		}
		else
		{
			monstro.velocity= new Vector();

			const temp_vect= Vector.subtraction(player.position, monstro.position);
			monstro.shootDirection= temp_vect.getAngle();

			if(monstro.timers.firerate)
			{	
				if(monstro.timers.firerate.getDuration() > (monstro.firerate || 250))
				{
					monstro.timers.firerate.reset();

					const offsetAng= Math.PI/30;

					for(let i= 0; i < 10; i++)
					{
						const proj= new Projectile(gameObjectList, new Vector(monstro.position.x, monstro.position.y), (Math.random() * 5 + 5), (temp_vect.getAngle() + (offsetAng * i)), 10, "enemyProjectile");
					}
				}
			}
		}
		monstro.movementTick= !monstro.movementTick;
	}, 1000);

	return MrMonstro;
};

function bulletSplosion(position= new Vector(0, 0), numberOfProjectiles= 10, offset= 0)
{
	let slice= (Math.PI * 2) / numberOfProjectiles, 
	angle= offset;
	for(let i= 0; i <= numberOfProjectiles; i++)
	{
		new Projectile(gameObjectList, position, 7, angle, 20);
		angle= angle + slice;
	}
};

function playerMovementSnappy(player)
{
	if(inputSystem.w === true)
	{
		player.velocity.setMag(5);
		if(inputSystem.d === true)
		{
			player.velocity.setAngle(Math.PI / 4);
		}
		else if(inputSystem.a === true)
		{
			player.velocity.setAngle( 3 * (Math.PI / 4));
		}
		else
		{
			player.velocity.setAngle(Math.PI / 2);
		}
	}
	else if(inputSystem.s === true)
	{
		player.velocity.setMag(5);
		if(inputSystem.d === true)
		{
			player.velocity.setAngle(-Math.PI / 4);
		}
		else if(inputSystem.a === true)
		{
			player.velocity.setAngle(-3 * (Math.PI / 4));
		}
		else
		{
			player.velocity.setAngle(-Math.PI / 2);
		}
	}
	else
	{
		player.velocity.setMag(5);
		if(inputSystem.d === true)
		{
			player.velocity.setAngle(0);
		}
		else if(inputSystem.a === true)
		{
			player.velocity.setAngle(Math.PI);
		}
	}

	if(!inputSystem.w && !inputSystem.s && !inputSystem.a && !inputSystem.d)
	{
		player.velocity.setMag(0);
		player.velocity= player.velocity.multiply(0.5);
	}

	player.shootDirection= player.shootDirection || Math.PI / 2;

	if(inputSystem.up === true)
	{
		if(inputSystem.right === true)
		{
			player.shootDirection= Math.PI / 4;
		}
		else if(inputSystem.left === true)
		{
			player.shootDirection=  3 * (Math.PI / 4);
		}
		else
		{
			player.shootDirection= Math.PI / 2;
		}
	}
	else if(inputSystem.down === true)
	{
		if(inputSystem.right === true)
		{
			player.shootDirection= -Math.PI / 4;
		}
		else if(inputSystem.left === true)
		{
			player.shootDirection= -3 * (Math.PI / 4);
		}
		else
		{
			player.shootDirection= -Math.PI / 2;
		}
	}
	else
	{
		if(inputSystem.right === true)
		{
			player.shootDirection= 0;
		}
		else if(inputSystem.left === true)
		{
			player.shootDirection= Math.PI;
		}
	}

	if(!inputSystem.up && !inputSystem.down && !inputSystem.left && !inputSystem.right)
	{
		player.shootDirection= Math.PI / 2;
	}

	if(inputSystem.up || inputSystem.down || inputSystem.left || inputSystem.right)
	{
		if(player.timers.firerate)
		{	
			if(player.timers.firerate.getDuration() > (player.firerate || 250))
			{
				player.timers.firerate.reset();

				const proj= new Projectile(gameObjectList, new Vector(player.position.x, player.position.y), 10, player.shootDirection);
				proj.alias= "playerProjectile";
				proj.damage= player.damage;
			}
		}
	}

	if(inputSystem.space === true)
	{
		
	}

};

function drawDossHealthBar(gameObject, position= new Vector(0, height - 50), barWidth= (width - 200), colors= ["black", "white"])
{
	context.save();
	context.translate(position.x, position.y);
	context.beginPath();
	context.fillStyle= colors[0];
	context.arc(0, 0, gameObject.collider.radius, 0, Math.PI * 2);
	context.fillRect(-barWidth / 2, -height / 2, barWidth, 20);
	context.fillStyle= colors[1];

	const widthPerHP= barWidth / gameObject.healthCap;
	const currentHP= gameObject.healthCap - gameObject.health;
	let health= barWidth - currentHP * widthPerHP;

	context.fillRect(-barWidth / 2, -height / 2, health, 20);
	context.restore();
};

function drawRouteIntro(route= "index.html")
{
	const UI= new UIObject(gameObjectList, new Vector(), gameObject => {
		const text= "https://noogle.com/" + route;
		context.save();
		context.transform(1, 0, 0, -1, 0, 0)
		context.fillStyle= "white";
		context.font = "50px sans";
		context.fillText(text, -context.measureText(text).width / 2, 0);
		if(gameObject.triggerTransition)
		{
			context.fillStyle= "red";
			context.fillText("404", -context.measureText("404").width / 2, 60);
		}
		context.restore();
	});
	UI.triggerTransition= false;
	UI.onDestroy= () => {
		eventSystem.dispatchEvent("onIntroComplete");
	};
	timeOut.newTimeOut(() => {
		UI.triggerTransition= true;
		UI.destroy(2000);
	}, 3000);

};

function drawRouteOutro(route= "index.html")
{
	const UI= new UIObject(gameObjectList, new Vector(), gameObject => {
		const text= "https://noogle.com/" + route;
		context.save();
		context.transform(1, 0, 0, -1, 0, 0)
		context.fillStyle= "white";
		context.font = "50px sans";
		context.fillText(text, -context.measureText(text).width / 2, 0);
		if(gameObject.triggerTransition)
		{
			context.fillStyle= "green";
			context.fillText("200", -context.measureText("200").width / 2, 60);
		}
		else
		{
			context.fillStyle= "red";
			context.fillText("404", -context.measureText("404").width / 2, 60);
		}
		context.restore();
	});
	UI.triggerTransition= false;
	timeOut.newTimeOut(() => {
		UI.triggerTransition= true;
		UI.destroy(2000);
	}, 2000);

};

function spawnExit()
{
	const exit= new GameObject(gameObjectList, new Vector(0, height / 2));
	exit.layer= "projectile";
	exit.addCollider({
		type: "circle",
		radius: 50,
		uncolide: false,
		computeBoundryCollision: false,
		onCollision: (current, other) => {console.log("!");
			if(other.alias === "player")
			{
				current.destroy();
				other.destroy();
				eventSystem.dispatchEvent("onLevelExit");
			}
		}
	});

	exit.renderer= (gameObject) => {
		context.save();
		context.translate(gameObject.position.x, gameObject.position.y);
		context.beginPath();
		context.fillStyle= getRandomColor();
		context.arc(0, 0, gameObject.collider.radius, 0, Math.PI * 2);
		context.fill();
		context.restore();
	};

	return exit;
}

