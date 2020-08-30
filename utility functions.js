//------------------------------------------------------------------------
function realWorldTimer()
{
	this.start_time= Date.now();

	this.getDuration= function()
	{
		let delay= Date.now() - this.start_time;
		return delay;
	}

	this.reset= function()
	{
		this.start_time= Date.now();
	}
}

//------------------------------------------------------------------------
function timer()
{
	this.start_time= time;

	this.getDuration= function()
	{
		let delay= time - this.start_time;
		return delay;
	}

	this.reset= function()
	{
		this.start_time= time;
	}
}

//------------------------------------------------------------------------

class TimeOut{

	constructor()
	{
		this.timeOutArray= [];
	}

	newTimeOut(onTimeOut= () => {}, delay= 0)
	{
		this.timeOutArray.push({
			timer: new timer(),
			delay: delay,
			onTimeOut: onTimeOut
		});
	}
	update()
	{
		for(let i=0; i < this.timeOutArray.length; i++)
		{
			if(this.timeOutArray[i].timer.getDuration() >= this.timeOutArray[i].delay)
			{
				this.timeOutArray[i].onTimeOut();
				this.timeOutArray.splice(i, 1);
			}
		}
	}
}
window.timeOut= new TimeOut();

//------------------------------------------------------------------------
function getRandomNumber(min= 0, max= 1) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
//------------------------------------------------------------------------
const getRandomVector= (limit_x= (width / 2), limit_y= (height / 2)) => {
	let rand= Math.random();
	const x= rand >= 0.5 ? rand * limit_x : -rand * limit_x;
	rand= Math.random();
	const y= rand >= 0.5 ? rand * limit_y : -rand * limit_y;
	return new Vector(x, y);
};
//------------------------------------------------------------------------
function getRandomColor() 
{
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) 
	color += letters[Math.floor(Math.random() * 16)];
		return color;
}
//------------------------------------------------------------------------
function draw_vector(pos, vel= pos, color= "red")
{
	context.save();
	context.beginPath();
	context.strokeStyle= color;
	context.translate(pos.x, pos.y);
	context.rotate(vel.getAngle());
	context.moveTo(0, 0);
	context.lineTo(30, 0);
	context.lineTo(23, -5);
	context.moveTo(30, 0);
	context.lineTo(23, 5);
	context.stroke();
	context.restore();
}
//------------------------------------------------------------------------
function clone_particle(original)
{
	var clone= new particle(0, 0, 0, 0, 0);
		clone.position.x= original.position.x + 0;
		clone.position.y= original.position.y + 0;
		clone.velocity.setMag(original.velocity.getMag() + 0);
		clone.velocity.setAngle(original.velocity.getAngle() + 0);
		clone.size= original.size;
		clone.color= original.color;

	return clone;
}
//------------------------------------------------------------------------
function Circle2CircleCollision(b1, b2)
{
	var x= Math.abs(b1.position.x - b2.position.x);
	var y= Math.abs(b1.position.y - b2.position.y);
	return (((x * x) + (y * y)) <= ((b1.collider.radius + b2.collider.radius) * (b1.collider.radius + b2.collider.radius)));
}
//------------------------------------------------------------------------
function box2BoxCollision(b1, b2)
{
	if(b1.position.x >= b2.position.x - b2.width && b1.position.x <= b2.position.x + b2.width && b1.position.y >= b2.position.y - b2.height && b1.position.y <= b2.position.y + b2.height) 
	{
		return true;
	}
	else
		return false;
}
//------------------------------------------------------------------------
function check_p2wall_collision(ref, inprison= false, stick= false)
{
	let size, flag= false;

	let position= new vector(ref.position.x, ref.position.y);
	size= ref.size; 

	if(ref.position.x >= width / 2 - size || ref.position.x <= -width / 2 + size)
	{
		position.x= Math.sign(ref.position.x) * (width / 2) + (Math.sign(ref.position.x) * -1 * (size + 0)); 
		flag= true;
	}

	if(ref.position.y >= height / 2 - size || ref.position.y <= -height / 2 + size)
	{
		position.y= Math.sign(ref.position.y) * (height / 2) + (Math.sign(ref.position.y) * -1 * (size + 0));
		flag= true;
	}
	
	if(flag === true)
	{
		if(inprison === true)
			ref.position.set_vect(position);
		if(stick === true)
			ref.velocity.setMag(0);
		return position;
	}
	else
		return false; 
}
//------------------------------------------------------------------------
function uncolide(pt1, pt2)
{
	const watchDog= new realWorldTimer();
	while(Circle2CircleCollision(pt1, pt2) && watchDog.getDuration() < 5000)
	{
		var nudge= new Vector(0, 0);
		nudge.setMag(1);
		var tta= Math.atan2(pt1.position.y - pt2.position.y, pt1.position.x - pt2.position.x);
		//nudge.setAngle(tta);
		//pt1.position.add(nudge);
		nudge.setAngle(tta + Math.PI);
		pt2.position= pt2.position.add(nudge);
	}
}
//------------------------------------------------------------------------
function unStackObjects(array)
{
	for(var e1= 0; e1 < array.length; e1++)
		for(var e2= e1; e2 < array.length ; e2++)
		{
			if(e1 == e2)
				continue;
			while(Circle2CircleCollision(array[e1], array[e2]))
			{
				uncolide(array[e1], array[e2]);
			}
		}
}
//------------------------------------------------------------------------
function wrappAround(ref)
{
	if(ref.position.x >= (width / 2) + ref.size * 1 || ref.position.x <= -width / 2 - ref.size * 1)
	{
		ref.position.x= Math.sign(ref.position.x) * (-width / 2) + (Math.sign(ref.position.x) * 1); 
	}
	if(ref.position.y >= height / 2 + ref.size * 1 || ref.position.y <= (-height / 2) - ref.size * 1)
	{
		ref.position.y= Math.sign(ref.position.y) * (-height / 2) + (Math.sign(ref.position.y) * 1);
	}
}
//------------------------------------------------------------------------
function draw_bounding_circle(pos, radius= 20)
{
	context.beginPath();
	context.strokeStyle= "white";
	context.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
	context.stroke();
}
//------------------------------------------------------------------------
function fullscreen()
{
   if(document.getElementById('my_canvas').webkitRequestFullScreen) 
       document.getElementById('my_canvas').webkitRequestFullScreen();
  else 
    document.getElementById('my_canvas').mozRequestFullScreen();    
}
//------------------------------------------------------------------------

function circleRenderer(obj, color= "white", radius= 10, fill= true)
{
	return () => {
		context.save();
		context.beginPath();
		context.fillStyle= color;
		context.arc(obj.position.x, obj.position.y, radius, 0, Math.PI * 2);
		if(fill) context.fill();
		else context.stroke();
		context.restore();
	};
};

