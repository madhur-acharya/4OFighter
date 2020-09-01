function drawSpaceship(gameObject)
{
	context.save();
	context.translate(gameObject.position.x, gameObject.position.y);
	context.rotate(Math.PI / 2);
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

function drawBoss1(gameObject, damaged= false)
{
	context.save();
	context.translate(gameObject.position.x, gameObject.position.y);
	context.beginPath();
	context.fillStyle= damaged ? "crimson" : "red";
	context.arc(0, 0, gameObject.collider.radius, 0, Math.PI * 2);
	context.fill();
	context.restore();
};

function SpawnDuke()
{
	let dukeCount= 0;

	const dukeSpawner= (positon= new Vector(0, 0), number= 1, size= 100, health= 10, vertices= 50) => {
		for(let i= 0; i < number; i++)
		{
			dukeCount++;

			const duke= new Asteroid(gameObjectList, positon, vertices);
			duke.velocity= getRandomVector(5, 5);
			duke.alias= "asteroid";
			duke.layer= "projectile";
			duke.health= health;
			//duke.drawGizmos= true;
			duke.addCollider({
				type: "circle",
				radius: size,
				uncolide: true,
				computeBoundryCollision: true,
				onCollision: (current, other) => {
					if(other.alias === "projectile")
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
								window.alert("Yey!");
							current.destroy();
						}
					}
				}
			});
		}
	};

	dukeSpawner();
};

function attack1(position= new Vector(0, 0), numberOfProjectiles= 10, offset= 0)
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
	if(inputSystem.up === true)
	{
		player.velocity.setMag(5);
		if(inputSystem.right === true)
		{
			player.velocity.setAngle(Math.PI / 4);
		}
		else if(inputSystem.left === true)
		{
			player.velocity.setAngle( 3 * (Math.PI / 4));
		}
		else
		{
			player.velocity.setAngle(Math.PI / 2);
		}
	}
	else if(inputSystem.down === true)
	{
		player.velocity.setMag(5);
		if(inputSystem.right === true)
		{
			player.velocity.setAngle(-Math.PI / 4);
		}
		else if(inputSystem.left === true)
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
		if(inputSystem.right === true)
		{
			player.velocity.setAngle(0);
		}
		else if(inputSystem.left === true)
		{
			player.velocity.setAngle(Math.PI);
		}
	}

	if(inputSystem.space === true)
	{
		if(player.timers.firerate)
		{	
			if(player.timers.firerate.getDuration() > (player.firerate || 250))
			{
				player.timers.firerate.reset();

				new Projectile(gameObjectList, new Vector(player.position.x, player.position.y + 30));
			}
		}
	}

	if(!inputSystem.up && !inputSystem.down && !inputSystem.left && !inputSystem.right)
	{
		player.velocity.setMag(0);
		player.velocity= player.velocity.multiply(0.5);
	}
}

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

	if(inputSystem.space === true)
	{
		if(player.timers.firerate)
		{	
			if(player.timers.firerate.getDuration() > (player.firerate || 250))
			{
				player.timers.firerate.reset();

				const bullet= new GameObject(projectiles);
				bullet.position= player.position;
				bullet.drawGizmos= true;
				bullet.velocity= new Vector(0, 10);
				bullet.alias= "projectile";
				bullet.renderer= obj => {
					context.save();
					context.beginPath();
					context.fillStyle= "orange";
					context.arc(obj.position.x, obj.position.y, 5, 0, Math.PI * 2);
					context.fill();
				}
				bullet.addCollider();
				bullet.collider.radius= 5;
				bullet.destroy(1000);
			}
		}
	}
}

