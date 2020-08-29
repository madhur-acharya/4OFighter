const GameObject= (function () 
{
	let privateProps = new WeakMap();

	class GameObject 
	{
		constructor(positionVector= new Vector(0, 0), gravityActive= false, frictionActive= false) 
		{
			privateProps.set(this, {
				position: positionVector,
				rotation: 0,
			});

			this.gravityActive= gravityActive;
			this.gravity= new Vector(0, -0.1);
			this.velocityCap= 50;
			this.velocity= new Vector(0, 0);
			this.frictionActive= frictionActive;
			this.frictionCoefficient= 1;
			this.objectId= performance.now().toString();
			this.drawGizmos= false;
			this.acceleration= new Vector(0, 0);
			this.layer= "default";

			this.executables= ["applyGravity", "applyAcceleration", "applyVelocity", "applyFriction"];
			this.timers= {}
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

		static createNew(list)
		{
			if(!list) return;
			const obj= new GameObject();
			obj.renderList= list;
			list.push(obj);
			return obj;
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
			if(this.velocity.getMag() < this.velocityCap)
			{
				this.velocity= this.velocity.add(this.acceleration);
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
			this.renderObject(this);
			this.collisionDetection();
		}

		renderObject()
		{
			draw_vector(this.position);
		}

		renderGizmos()
		{
			draw_vector(new Vector(0, 0), this.position);
			draw_vector(this.position, this.velocity, "green");
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
						this.renderList.splice(i, 1);
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
						this.renderList.splice(i, 1);
				}
				this.selfDestructTimer= undefined;
				this.selfDestructDelay= undefined;
			}
		}

		addCollider(colliderObj= {
			type: "circle",
			radius: 15,
			onCollision: () => {}
		})
		{
			this.collider= colliderObj;
		}

		collisionDetection()
		{
			if(!this.collider) return;
			else
			{
				for(let i= 0; i < this.renderList.length; i++)
				{
					if(this.objectId !== this.renderList[i].objectId && this.layer === this.renderList[i].layer)
					{
						if(Circle2CircleCollision(this, this.renderList[i]))
						{
							this.collider.onCollision(this, this.renderList[i]);
							this.renderList[i].collider.onCollision(this, this.renderList[i]);
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



