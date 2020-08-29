class EventSystem{
	constructor()
	{
		this.eventStack= {
		};
	}

	createEvent(event)
	{
		this.eventStack[event]= new Event(event);
	}

	dispatchEvent(event)
	{
		window.dispatchEvent(this.eventStack[event]);
	}
};

window.eventSystem= new EventSystem();