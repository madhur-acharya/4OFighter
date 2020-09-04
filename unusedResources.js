function playerMovementSmooth(player)
{
	const acceleration= 0.5;

	if(inputSystem.up === true)
	{
		player.acceleration.setMag(acceleration);
		if(inputSystem.right === true)
		{
			player.acceleration.setAngle(Math.PI / 4);
		}
		else if(inputSystem.left === true)
		{
			player.acceleration.setAngle( 3 * (Math.PI / 4));
		}
		else
		{
			player.acceleration.setAngle(Math.PI / 2);
		}
	}
	else if(inputSystem.down === true)
	{
		player.acceleration.setMag(acceleration);
		if(inputSystem.right === true)
		{
			player.acceleration.setAngle(-Math.PI / 4);
		}
		else if(inputSystem.left === true)
		{
			player.acceleration.setAngle(-3 * (Math.PI / 4));
		}
		else
		{
			player.acceleration.setAngle(-Math.PI / 2);
		}
	}
	else
	{
		player.acceleration.setMag(acceleration);
		if(inputSystem.right === true)
		{
			player.acceleration.setAngle(0);
		}
		else if(inputSystem.left === true)
		{
			player.acceleration.setAngle(Math.PI);
		}
	}

	if(!inputSystem.up && !inputSystem.down && !inputSystem.left && !inputSystem.right)
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

	if(inputSystem.up || inputSystem.down || inputSystem.left || inputSystem.right)
	{
		if(player.timers.firerate)
		{	
			if(player.timers.firerate.getDuration() > (player.firerate || 250))
			{
				player.timers.firerate.reset();

				const proj= new Projectile(gameObjectList, new Vector(player.position.x, player.position.y), 10, player.shootDirection);
				proj.alias= "playerProjectile";
			}
		}
	}

	if(!inputSystem.up && !inputSystem.down && !inputSystem.left && !inputSystem.right)
	{
		player.shootDirection= Math.PI / 2;
	}
}



monstro.executables.unshift(gameObject => {
	const temp_vect= Vector.subtraction(player.position, gameObject.position);
	gameObject.shootDirection= temp_vect.getAngle();

	if(gameObject.timers.firerate)
	{	
		if(gameObject.timers.firerate.getDuration() > (gameObject.firerate || 250))
		{
			gameObject.timers.firerate.reset();

			const proj= new Projectile(gameObjectList, new Vector(gameObject.position.x, gameObject.position.y), 10, temp_vect.getAngle());
			proj.alias= "enemyProjectile";
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
			
		}
	});
	ast.destroy(10000);
}

let off= 0;
interval.newInterval(() => {
	attack1(getRandomVector(), 10, off);
	off+= Math.PI / (Math.random() * 5);
}, 1000, 20);

