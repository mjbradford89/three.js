/**
 * @author Michael Bradford
 */

Sidebar.Behaviour = function ( editor ) {

    var signals = editor.signals;

    var currentObject;

	var options = {};
	var possibleAnimations = {};

    var container = new UI.Panel();
    container.setId( 'behaviour-panel' );
	container.setBorderTop( '0' );
    container.setPaddingTop( '20px' );

	container.add( new UI.Text( 'behaviour' ).setTextTransform( 'uppercase' ) );
	container.add( new UI.Break() );
    container.add( new UI.Break() );

    var triggerRow = new UI.Row();
    triggerRow.add( new UI.Text( 'Select Trigger' ) );

    var selectTrigger = new UI.Select().setMarginLeft( '4px' );
    var selectedTrigger;
    selectTrigger.setOptions({
        'pick': 'Pick',
        'pointerEnter': 'Pointer Enter',
        'pointerOver': 'Pointer Over',
        'pointerExit': 'Pointer Exit',
        'intersectionEnter': 'Intersection Enter',
        'intersectionExit': 'Intersection Exit'
    });
    selectTrigger.onChange((event) => {
        selectedTrigger = event.target.value;
    });

    triggerRow.add(selectTrigger);

    var actionRow = new UI.Row();
    actionRow.add( new UI.Text( 'Select Action' ) );

    var selectAction = new UI.Select().setMarginLeft( '4px' );
    var selectedAction;
    selectAction.setOptions({
        'playAnimation': 'Play Animation',
        'stopAnimation': 'Stop Animation',
        'playSound': 'Play Sound',
        'stopSound': 'Stop Sound',
        'emitEvent': 'Emit Event'
    });
    selectAction.onChange((event) => {
        selectedAction = event.target.value;
        if (selectAction && selectedAction == 'playAnimation') {
            selectAnimationRow.setDisplay(''); //make visibile
        } else {
            selectAnimationRow.setDisplay('none'); //make invisibile
        }
    });

    actionRow.add(selectAction);

    var selectAnimationRow = new UI.Row().setDisplay('none');
    selectAnimationRow.add( new UI.Text( 'Select Animation ' ) );


    var selectAnimation = new UI.Select().setMarginLeft( '4px' );
    var selectedAnimation;
    selectAnimation.setOptions({
        'spin': 'Spin',
        'explode': 'Explode',
        'implode': 'Implode',
        'muppetRun' :'Run like a Muppet'
    });
    selectAnimation.onChange((event) => {
        selectedAnimation = event.target.value;
    });

    selectAnimationRow.add(selectAnimation);


    var addRow = new UI.Row();
	addRow.add( new UI.Button( 'Add' ).onClick( function () {
        addBehaviour(selectedTrigger, selectedAction, selectedAnimation);
        selectedTrigger = selectedAction = null;
        selectAction.setValue(null);
        selectTrigger.setValue(null);
	} ) );

    var existingBehaviourRow = new UI.Row();

    var behaviourElement = new UI.Div();
    var actionElement = new UI.Div();
    var triggerElement = new UI.Div();
    behaviourElement.add(actionElement, triggerElement);

    existingBehaviourRow.add( behaviourElement )

    container.add( existingBehaviourRow );
    container.add( triggerRow );
    container.add( actionRow );
    container.add( selectAnimationRow );
    container.add( addRow );

	signals.objectSelected.add( function ( object ) {
        currentObject = object;
        resetUI();
    });

	return container;

    function addBehaviour(selectedTrigger, selectedAction, selectedAnimation) {
        var actionUUID = THREE.Math.generateUUID();
        var behaviourElement = new UI.Div().setClass( 'behaviour-element' );
        var actionElement = new UI.Div().setClass( 'action-element' );
        var triggerElement = new UI.Div().setClass( 'trigger-element' );
        var removeButton = new UI.Span().setTextContent('x').setClass('remove');

        if (!selectedAnimation) {
            actionElement.setTextContent( selectedAction );
        } else {
            actionElement.setTextContent( selectedAction +' ('+ selectedAnimation +')' );
        }
        triggerElement.setTextContent( selectedTrigger );

        behaviourElement.add( triggerElement, new UI.Span().setTextContent('>').setClass('arrow'), actionElement, removeButton );
        behaviourElement.setId(actionUUID);

        existingBehaviourRow.add( behaviourElement );

        _addBehaviour(selectedTrigger, selectedAction, selectedAnimation, actionUUID);

        removeButton.onClick((event) => {
            _removeBehaviour(actionUUID)
        });
        resetUI();
    }

    function _addBehaviour(selectedTrigger, selectedAction, selectAnimation, actionUUID) {
        var behaviourArray = currentObject.userData['behaviour'];
        if (!behaviourArray) {
            behaviourArray = [];
        }
        behaviourArray.push({
            trigger: selectedTrigger,
            action: selectedAction,
            animation: selectAnimation,
            uuid: actionUUID
        });
        currentObject.userData['behaviour'] = behaviourArray;
    }

    function _removeBehaviour(actionUUID) {
        var behaviourArray = currentObject.userData['behaviour'];
        if (!behaviourArray) {
            return;
        }
        behaviourArray = behaviourArray.filter((b) => b.uuid != actionUUID);
        currentObject.userData['behaviour'] = behaviourArray;
        document.getElementById(actionUUID).remove();
    }

    function resetUI() {
        selectedAction = selectedTrigger = selectedAnimation = null;
        selectAction.setValue(null);
        selectTrigger.setValue(null);
        selectAnimation.setValue(null);
        selectAnimationRow.setDisplay('none');
    }
};
