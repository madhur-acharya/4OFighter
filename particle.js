var point= function(a, b)
{
	this.x= a;
	this.y= b;
}

const Particle= function(x, y, direction, speed, sz)
{
	this.size= sz;
	this.position= new vector(x, y);
	this.velocity= new vector(0, 0);
	this.velocity.setMag(speed);
	this.velocity.setAngle(direction);

	this.update_pos= function()
	{
		var temp= new vector(0, 0);

		if(!deltaTime)
		{
			this.position= this.position.add(this.velocity);
		}
		else
		{
			temp.setMag(this.velocity.getMag() * (60 / deltaTime));
			temp.setAngle(this.velocity.getAngle());
			this.position= this.position.add(temp);
		}
	}
}

var spaceShip= function(x, y, direction, speed, xlr8= 0, friction= 0, sz)
{
	this.size= sz;
	this.topspeed= 15;
	this.fire_rate= 0.20;
	this.bullets_type= 1;

	this.position= new vector(x, y);
	this.velocity= new vector(0, 0);
	this.velocity.setMag(speed);
	this.velocity.setAngle(direction);
	this.acceleration= new vector(0, 0);
	this.acceleration.setMag(xlr8);

	this.update_pos= function()
	{
		var temp= new vector(0, 0);

		if(delta == 0 || delta == undefined || delta == null)
		{
			this.position= this.position.add(this.velocity);
		}
		else
		{
			temp.setMag(this.velocity.getMag() * (60 / delta));
			temp.setAngle(this.velocity.getAngle());
			this.position= this.position.add(temp);
		}
	}

	this.accelerate= function(decelerate= false)
	{
		this.velocity.add(this.acceleration);
		if(this.velocity.getMag() > this.topspeed)
			this.velocity.setMag(this.topspeed);
	}

	this.apply_friction= function()
	{
		this.velocity.multiply(friction);
	}
}

var asteroid= function(x, y, direction, speed, sz= 20, v)
{
	this.size= sz;
	this.vertex_array= [];
	this.vertices= v;
	this.position= new vector(x, y);
	this.velocity= new vector(0, 0);
	this.velocity.setMag(speed);
	this.velocity.setAngle(direction);

	let slice= (Math.PI * 2) / this.vertices, 
		angle= 0;
	for(let i= 0; i < this.vertices; i++)
	{
		let vx= Math.cos(angle) * (this.size - Math.random() * this.size / 3);
		let vy= Math.sin(angle) * (this.size - Math.random() * this.size / 3);	
		let vertex= new point(vx, vy);

		this.vertex_array.push(vertex);
		angle= angle + slice;
	}

	this.update_pos= function()
	{
		var temp= new vector(0, 0);

		if(delta == 0 || delta == undefined || delta == null)
		{
			this.position= this.position.add(this.velocity);
		}
		else
		{
			temp.setMag(this.velocity.getMag() * (60 / delta));
			temp.setAngle(this.velocity.getAngle());
			this.position= this.position.add(temp);
		}
	}
}