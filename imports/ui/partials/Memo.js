import './Memo.html';
import { TemplateController } from 'meteor/space:template-controller';
import { Label } from '../../api/label.js';

TemplateController('Memo',{
	state:{
		isHovered:false
	},

	onCreated(){
		this.autorun(()=>{
			this.subscribe('label');
		});
	},
	onRendered(){
		$('.tooltipped').tooltip({delay: 50});
	},
	onDestroyed(){
		$('.tooltipped').tooltip('remove');
	},

	helpers:{
		isHovered(){
			return this.state.isHovered;
		},
		isOwner(){
			return (Meteor.userId() === this.data.owner);
		},
		hasLabel(){
			return (this.data.labelId)? true:false;
		},
		faviconUrl(){
			return `http://www.google.com/s2/favicons?domain=${this.data.url}`;
		},
	},

	events:{
		'click .fa-close'(){
			Meteor.call('deleteMemo',this.data._id);
		},
		'mouseover .card'(){
			this.state.isHovered = true;
		},
		'mouseout .card'(){
			this.state.isHovered = false;
		},
		'click .card-image-url'(){
			window.open(this.data.url);
		}
	},
});