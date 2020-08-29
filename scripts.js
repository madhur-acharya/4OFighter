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

				const bullet= GameObject.createNew(gameObjectList);
				bullet.position= player.position;
				bullet.drawGizmos= true;
				bullet.velocity= new Vector(0, 10);
				bullet.alias= "bullet" + gameObjectList.length;
				bullet.layer= "projectile";
				bullet.renderObject= obj => {
					context.save();
					context.beginPath();
					context.fillStyle= "orange";
					context.arc(obj.position.x, obj.position.y, 5, 0, Math.PI * 2);
					context.fill();
				}
				bullet.addCollider({
					type: "circle",
					radius: 5,
					onCollision: (current, other) => {
						current.destroy();
					}
				});
				bullet.destroy(5000);
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

				const bullet= GameObject.createNew(projectiles);
				bullet.position= player.position;
				bullet.drawGizmos= true;
				bullet.velocity= new Vector(0, 10);
				bullet.alias= "bullet" + projectiles.length;
				bullet.renderObject= obj => {
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

