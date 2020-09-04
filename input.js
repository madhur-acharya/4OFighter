class Input{

	constructor()
	{
		this.up= false;
		this.down= false;
		this.left= false;
		this.right= false;
		this.enter= false;
		this.space= false;
		this.mute= false;
		this.w= false;
		this.a= false;
		this.s= false;
		this.d= false;

		this.initialize();
	}

	initialize()
	{
		window.addEventListener("keydown", event => {

			switch(event.keyCode)
			{
				case 38 : {this.up= true; break;}
				case 40 : {this.down= true; break;} 
				case 37 : {this.left= true; break;} 
				case 39 : {this.right= true; break;} 
				case 32 : {this.space= true; break;}
				case 13 : {this.enter= true; break;}
				case 87 : {this.w= true; break;}
				case 65 : {this.a= true; break;}
				case 83 : {this.s= true; break;}
				case 68 : {this.d= true; break;}
			}
		});

		window.addEventListener("keyup", event => {

			switch(event.keyCode)
			{
				case 38 : {this.up= false; break;}
				case 40 : {this.down= false; break;} 
				case 37 : {this.left= false; break;} 
				case 39 : {this.right= false; break;} 
				case 32 : {this.space= false; break;}
				case 13 : {this.enter= false; break;}
				case 87 : {this.w= false; break;}
				case 65 : {this.a= false; break;}
				case 83 : {this.s= false; break;}
				case 68 : {this.d= false; break;}
			}
		});
	}
};

window.inputSystem = new Input();
