import { TemplateController } from 'meteor/space:template-controller';
import './BoardForm.html';
import { Label } from '../../api/label.js';

TemplateController('BoardForm',{
	state:{
		shouldColorPaletteShow:false,
		selectedColor:"#e4e4e4",
		labelColorsFirst:[
			{value:"#ffcdd2"},
			{value:"#f8bbd0"},
			{value:"#e1bee7"},
			{value:"#d1c4e9"},
			{value:"#c5cae9"},
			{value:"#bbdefb"},
			{value:"#b3e5fc"},
		],
		labelColorsSecond:[
			{value:"#40c4ff"},
			{value:"#18ffff"},
			{value:"#64ffda"},
			{value:"#69f0ae"},
			{value:"#b2ff59"},
			{value:"#eeff41"},
			{value:"#ffd740"},
		],
	},

	helpers:{
		labelColorsFirst(){
			return this.state.labelColorsFirst;
		},
		labelColorsSecond(){
			return this.state.labelColorsSecond;
		},
		selectedColor(){
			return this.state.selectedColor;
		},
		shouldColorPaletteShow(){
			return this.state.shouldColorPaletteShow;
		}
	},

	events:{
		'submit .new-label'(event){
		    // Prevent default browser form submit
		    event.preventDefault();
		 
		    // Get value from form element
		    const target = event.target;
		    const labelName = target.label.value;
		    const labelObj = {
		    	label:labelName,
		    	color:this.state.selectedColor
		    };
		    Meteor.call('addLabel',labelObj,(err,result)=>{
		    	if(err){
		    		Bert.alert( err.reason, 'danger', 'growl-top-right');
		    	};
		    	if(!err){
		    		Bert.alert( 'Label Added', 'info', 'growl-top-right' );
		    	}
		    });
		    
		    // Clear form
	    	target.label.value = '';
		},
		'click .color-chooser-color'(event){
			const selectedColor = event.target.attributes.data.value;
			this.state.selectedColor = selectedColor;
			this.state.shouldColorPaletteShow = false;
		},
		'click .color-btn'(){
			this.state.shouldColorPaletteShow = true;
		},
	}
});