const GameObject= (function () 
{
	let privateProps = new WeakMap();

	class GameObject 
	{
		constructor(list= [], positionVector= new Vector(0, 0), velocity= new Vector(0, 0), gravityActive= false, frictionActive= false) 
		{
			privateProps.set(this, {
				position: positionVector,
				rotation: 0,
			});

			this.gravityActive= gravityActive;
			this.gravity= new Vector(0, -0.1);
			this.velocityCap= 50;
			this.velocity= velocity;
			this.frictionActive= frictionActive;
			this.frictionCoefficient= 1;
			this.objectId= performance.now().toString() + Math.round(Math.random() * 1000);
			this.drawGizmos= false;
			this.acceleration= new Vector(0, 0);
			this.layer= "default";
			this.disableCollisionDetection= false;

			this.executables= ["applyGravity", "applyAcceleration", "applyVelocity", "applyFriction"];
			this.timers= {}
			this.renderList= list;
			list.push(this);
		}

		getProp(prop)
		{
			return privateProps.get(this)[prop];
		}

		setProp(prop, value)
		{
			let temp= privateProps.get(this);

			privateProps.set(this, {
				...temp, 
				[prop]: value
			});
		}

		get position()
		{
			return privateProps.get(this).position;
		}

		set position(vect)
		{
			let temp= privateProps.get(this);

			privateProps.set(this, {
				...temp, 
				position : vect,
				rotation: vect.getAngle()
			});
		}

		get rotation()
		{
			return privateProps.get(this).rotation;
		}

		set rotation(angle)
		{
			const temp= privateProps.get(this);
			const vect= temp.position;
			vect.setAngle(angle);

			privateProps.set(this, {
				...temp, 
				position : vect,
				rotation: vect.getAngle()
			});
		}

		applyVelocity()
		{
			let pos= this.getProp("position");
			pos= pos.add(this.velocity);
			this.setProp("position", pos);
		}

		applyGravity()
		{
			if(!this.gravityActive) return;
			if(this.velocity.getMag() < this.velocityCap)
			{
				this.velocity= this.velocity.add(this.gravity);
			}
		}

		applyFriction()
		{
			if(this.frictionActive)
				this.velocity= this.velocity.multiply(this.frictionCoefficient);
		}

		applyAcceleration()
		{
			this.velocity= this.velocity.add(this.acceleration);
			if(this.velocity.getMag() > this.velocityCap)
			{
				this.velocity.setMag(this.velocityCap);
			}
		}

		addTimer(key, clock)
		{
			this.timers[key]= clock;
		}

		executeScripts()
		{
			this.executables.forEach(itm => {
				if(typeof(itm) == "string")
				{
					this[itm]();
				}
				else if(!!(itm && itm.constructor && itm.call && itm.apply))
				{
					itm(this);
				}
				
			});
			if(this.drawGizmos) this.renderGizmos();
			this.renderer(this);
			this.collisionDetection();
		}

		renderer()
		{
			drawVector(this.position);
		}

		renderGizmos()
		{
			drawVector(new Vector(0, 0), this.position);
			drawVector(this.position, this.velocity, "green");
			if(this.collider)
				draw_bounding_circle(this.position, this.collider ? this.collider.radius : 20);
		}

		destroy(delay= 0)
		{
			if(delay > 0)
			{
				this.selfDestructTimer= new timer();
				this.selfDestructDelay= delay;
				this.executables.push("selfDestruct");
			}
			else
			{
				for(let i= 0; i < this.renderList.length; i++)
				{
					if(this.renderList[i].objectId === this.objectId)
					{
						this.renderList.splice(i, 1);
						this.onDestroy && this.onDestroy(this);
					}
				}
			}
		}

		selfDestruct()
		{
			if(this.selfDestructTimer && this.selfDestructTimer.getDuration() > this.selfDestructDelay)
			{
				for(let i= 0; i < this.renderList.length; i++)
				{
					if(this.renderList[i].objectId === this.objectId)
					{
						this.renderList.splice(i, 1);
						this.onDestroy && this.onDestroy(this);
					}	
				}
				this.selfDestructTimer= undefined;
				this.selfDestructDelay= undefined;
			}
		}

		addCollider(colliderObj)
		{
			this.collider= {
				type: "circle",
				radius: 15,
				onCollision: () => {},
				uncolide: false,
				computeBoundryCollision: false,
				...colliderObj
			};
		}

		collisionDetection()
		{
			if(!this.collider) return;
			else
			{	
				if(this.collider.computeBoundryCollision)
				{
					this.velocity= cirlce2WalllCollision(this);
				}

				if(this.disableCollisionDetection) return;
				else
				{
					for(let i= 0; i < this.renderList.length; i++)
					{
						if(this.objectId !== this.renderList[i].objectId && this.layer === this.renderList[i].layer)
						{
							if(this.renderList[i].disableCollisionDetection) return;
							if(Circle2CircleCollision(this, this.renderList[i]))
							{
								if(this.collider.uncolide && this.renderList[i].collider.uncolide) 
								{
									uncolide(this, this.renderList[i] && this.renderList[i]);
								}
								this.collider.onCollision(this, this.renderList[i]);
								this.renderList[i] && this.renderList[i].collider.onCollision(this.renderList[i], this);
							}
						}
					}
				}
			}
		}

		onDestroy()
		{
			
		}
	}

	return GameObject;
})();

class Asteroid extends GameObject{
	constructor(list= [], position= new Vector(0, 0), vertices= 30, collider= {
		type: "circle",
		radius: 50,
		onCollision: () => {},
		uncolide: true
	})
	{
		super(list, position);
		super.collider= collider;
		super.renderList= list;
		this.vertexArray= [];
		this.vertices= vertices;
		this.health= 3;

		let slice= (Math.PI * 2) / this.vertices, 
			angle= 0;
		for(let i= 0; i < this.vertices; i++)
		{
			let vx= Math.cos(angle) * (this.collider.radius - Math.random() * this.collider.radius / 3);
			let vy= Math.sin(angle) * (this.collider.radius - Math.random() * this.collider.radius / 3);	
			let vertex= new Point(vx, vy);

			this.vertexArray.push(vertex);
			angle= angle + slice;
		};

		super.addCollider= obj => {
			super.collider= obj;
			let slice= (Math.PI * 2) / this.vertices, 
				angle= 0;
			for(let i= 0; i < this.vertices; i++)
			{
				let vx= Math.cos(angle) * (this.collider.radius - Math.random() * this.collider.radius / 3);
				let vy= Math.sin(angle) * (this.collider.radius - Math.random() * this.collider.radius / 3);	
				let vertex= new Point(vx, vy);

				this.vertexArray.push(vertex);
				angle= angle + slice;
			};
		};

		super.renderer= () => {
			context.save();
			context.translate(this.position.x, this.position.y);
			context.rotate(this.velocity.getAngle());
			context.beginPath();
			context.strokeStyle= "white";
			context.fillStyle= "#232322";
			context.moveTo(this.vertexArray[0].x, this.vertexArray[0].y);
			for(let i= 1; i < this.vertexArray.length; i++)
			{
				context.lineTo(this.vertexArray[i].x, this.vertexArray[i].y);
			}
			context.lineTo(this.vertexArray[0].x, this.vertexArray[0].y);
			context.stroke();
			context.fill();
			context.restore();
		};
	}
}


class Projectile extends GameObject{
	constructor(list= [], position= new Vector(0, 0), speed= 10, direction= Math.PI / 2, size= 5, alias= "enemyProjectile")
	{
		const vel= new Vector(0, 0);
		vel.setMag(speed);
		vel.setAngle(direction);

		super(list, position);
		super.velocity= vel;
		super.alias= alias;
		super.layer= "projectile";
		super.renderer= obj => {
			context.save();
			context.beginPath();
			context.fillStyle= "white";
			context.arc(obj.position.x, obj.position.y, size, 0, Math.PI * 2);
			context.fill();
		}
		super.addCollider({
			type: "circle",
			radius: size,
			onCollision: (current, other) => {
				if((current.alias === "playerProjectile" && other.alias === "player") || 
					(current.alias === "enemyProjectile" && other.alias === "enemy") || 
					current.alias === other.alias || 
					other.alias === "enemyProjectile" || 
					other.alias === "playerProjectile")
					return;
				else
					current.destroy();
			},
			uncolide: false
		});
		super.destroy(5000);
	}
}

class UIObject{
	constructor(list= [], position= new Vector(0, 0), renderer= () => {})
	{
		this.position= position;
		this.renderList= list;
		this.executables= [renderer];
		this.objectId= performance.now().toString() + Math.round(Math.random() * 1000);
		list.push(this);
	}

	selfDestruct()
	{
		if(this.selfDestructTimer && this.selfDestructTimer.getDuration() > this.selfDestructDelay)
		{
			for(let i= 0; i < this.renderList.length; i++)
			{
				if(this.renderList[i].objectId === this.objectId)
				{
					this.renderList.splice(i, 1);
					this.onDestroy && this.onDestroy(this);
				}
			}
			this.selfDestructTimer= undefined;
			this.selfDestructDelay= undefined;
		}
	}

	destroy(delay= 0)
	{
		if(delay > 0)
		{
			this.selfDestructTimer= new timer();
			this.selfDestructDelay= delay;
			this.executables.push("selfDestruct");
		}
		else
		{
			for(let i= 0; i < this.renderList.length; i++)
			{
				if(this.renderList[i].objectId === this.objectId)
				{
					this.renderList.splice(i, 1);
					this.onDestroy && this.onDestroy(this);
				}
			}
		}
	}

	executeScripts()
	{
		this.executables.forEach(itm => {
			if(typeof(itm) == "string")
			{
				this[itm]();
			}
			else if(!!(itm && itm.constructor && itm.call && itm.apply))
			{
				itm(this);
			}
			
		});
	}
}



