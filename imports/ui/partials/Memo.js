import './Memo.html';
import { TemplateController } from 'meteor/space:template-controller';
import { Label } from '../../api/label.js';
import { moment } from 'meteor/momentjs:moment';

TemplateController('Memo',{
	state:{
		isHovered:false,
		shouldHeartHightlight:false,
		shouldExpireProgressbarShow:true,
		progressBarColor:'over-75',
		progressRate:0,
		isMemoExpired:false,
		shouldToolTipShow:true,
	},

	onCreated(){
		const self = this;
		self.autorun(()=>{
			self.subscribe('label');
		});
	},

	helpers:{
		isHovered(){
			return this.state.isHovered;
		},
		shouldToolTipShow(){
			if(this.data.status == "expired" || this.data.provider_url == null){
				this.state.shouldToolTipShow = false;
			}else{
				this.state.shouldToolTipShow = true;
			}
			return this.state.shouldToolTipShow;
		},
		shouldExpireProgressbarShow(){
			if(this.data.isFavorited == true){
				this.state.shouldExpireProgressbarShow = false;
			}
			return this.state.shouldExpireProgressbarShow;
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
		shouldFavoriteHightlight(){
			return ( this.state.shouldHeartHightlight || this.data.isFavorited );
		},
		progressBarColor(){
			return this.state.progressBarColor;
		},
		isMemoExpired(){
			if(this.data.status == "expired" && this.data.isFavorited === false){
				this.state.isMemoExpired = true;
			}else{
				this.state.isMemoExpired = false;
			}
			return this.state.isMemoExpired;
		},
		expireStatus(){
			const expireDate = moment(this.data.expiredAt);
			const today = moment().format();
			const progress = expireDate.diff(today, 'hours');
			const expireLimit = this.data.expireIn*24;
			let progressRate = 0;
			progressRate = Math.floor((progress / expireLimit) * 100);

			if(progressRate > 100){
				progressRate = 100;
			}
			if(progressRate <= 0){
				progressRate = 0;
			}

			if(progressRate >= 75){
				this.state.progressBarColor = 'over-75';
			}else if(progressRate >= 50){
				this.state.progressBarColor = 'over-50';
			}else if(progressRate >= 25){
				this.state.progressBarColor = 'over-25';
			}else{
				this.state.progressBarColor = 'over-0';
			}
			this.state.progressRate = progressRate;
			return this.state.progressRate;
		}
	},

	events:{
		'click .fa-cog'(){
			Session.set('showModal',true);
			Session.set('editMemoLabelId', this.data._id);
			Session.set('formType', 'EditMemoLabel');
		},
		'click .edit-btn'(){
			const labelName = Label.findOne({_id:this.data.labelId}).name;
		},
		'click .fa-close'(){
			Meteor.call('deleteMemo',this.data._id);
		},
		'mouseover .card'(){
			this.state.isHovered = true;
		},
		'mouseout .card'(){
			this.state.isHovered = false;
		},
		'mouseover .heart'(){
			this.state.shouldHeartHightlight = true;
		},
		'mouseout .heart'(){
			this.state.shouldHeartHightlight = false;
		},	
		'click .heart'(){
			this.state.shouldExpireProgressbarShow = !this.state.shouldExpireProgressbarShow;
			this.state.isMemoExpired = false;
			Meteor.call('updateFavorite', this.data);
		},	
		'click .card-image-url'(){
			Meteor.call('memoUrlClicked', this.data);
			this.state.isMemoExpired = false;
			window.open(this.data.url);
			return false;
		},
		'click .fa-share-square'(){
			window.open(`https://twitter.com/intent/tweet?text=From my memo "${this.data.name}"&url=${this.data.url}`);
		},
		'click .archive-memo'(){
			if(this.data.status == "active"){
				this.state.isMemoExpired = true;
				Meteor.call('archiveMemo', this.data);
			}else{
				this.state.isMemoExpired = false;
				Meteor.call('memoUrlClicked', this.data);
			}
		}
	},
});