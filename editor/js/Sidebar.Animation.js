/**
 * @author mrdoob / http://mrdoob.com/
 */

var renderer = null;
Sidebar.Animation = function ( editor ) {

	var signals = editor.signals;
	var action = null;
	var clock = new THREE.Clock();
	var mixers = [];

	var options = {};
	var possibleAnimations = [];

	var container = new UI.Panel();
	container.setId('animation-panel');

	container.add( new UI.Text( 'Animation' ).setTextTransform( 'uppercase' ) );
	container.add( new UI.Break() );
	container.add( new UI.Break() );

	var animationsRow = new UI.Row();
	var stopAnimationBtn = new UI.Button().setLabel('Stop').setDisplay('none');

	container.add( animationsRow );
	container.add(stopAnimationBtn);

	stopAnimationBtn.onClick(stopAnimation);


	signals.rendererChanged.add( function ( newRenderer ) {
		renderer = newRenderer;
	} );

	signals.objectSelected.add( function ( object ) {
        currentObject = object;

        if (currentObject && currentObject.animations) {
			possibleAnimations = currentObject.animations;
			animationsRow.clear();

			possibleAnimations.forEach((a) => {
				var row = new UI.Row().setClass('animation-row');
				var name = new UI.Span();
				var btn = new UI.Button();

				name.setTextContent(a.name);
				row.add(name);
				row.add(btn.setLabel('play').setMarginLeft('4px'));
				animationsRow.add(row);

				btn.onClick(() => playAnimation(a, currentObject));
			});
        } else {
			animationsRow.clear();
		}
    });

	return container;

	function playAnimation(animation, object) {
		animationsRow.setDisplay( 'none' );
		stopAnimationBtn.setDisplay( '' );

		if (!object.mixer) {
			let mixer = new THREE.AnimationMixer( object );
			object.mixer = mixer;
		}
		mixers = [];
		mixers.push(object.mixer);

		action = object.mixer.clipAction(animation);
		action.play();
		animate();
	}

	function stopAnimation() {
		animationsRow.setDisplay( '' );
		stopAnimationBtn.setDisplay( 'none' );
		if (action) {
			action.stop();
		}

		renderer.animate(null);
		renderer.render( editor.scene, editor.camera );
	}

	function animate() {
		renderer.animate( animate.bind(this) );
		if ( mixers.length > 0 ) {
			for ( var i = 0; i < mixers.length; i ++ ) {
				mixers[ i ].update( clock.getDelta() );
			}
		}
		renderer.render( editor.scene, editor.camera );
	}

};
