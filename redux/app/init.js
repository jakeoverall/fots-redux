/**
 * Okay so I am not going to rebuild an entire front-end framework 
 * We have enough of those already!
 * The important concept here is that your app and store are both
 * Singletons - Meaning we only create them each one time and then prevent
 * any other instantiation of either.
 * 
 * You then allow all components access to the store...
 * It is safe to do this because everything that's important
 * is safely encapsulated away from poor developer decisions
 * 
 * Components have the ability to subscribe to mutations through the store
 * And can dispatch actions to the store. Components implement the fire and forget
 * methodology so they can dispatch actions where if the state changes 
 * and they are subscribed to that change they will be updated 
 * 
 * So that's all fancy but we are just going to use a few globals 
 * out of laziness
*/

let app = {
	components: {
		gridComponent: GridComponent(GridStore())
	}
}

app.components.gridComponent.onMount()
