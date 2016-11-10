import './NewMemoModal.html';
import { TemplateController } from 'meteor/space:template-controller';

TemplateController('NewMemoModal',{
	onCreated(){
		this.autorun(()=>{
			this.subscribe('status');
		});
	},

	events:{
		'click .addMemoModal'(){
			Session.set('cmDoc',undefined);
		},
	},
});
const hooksObject = {
	before:{
		insert:function(doc){
			let isValidForm = AutoForm.validateForm("NewMemo");
			Session.set('isLoadingMemo',true);
			if(isValidForm){
				this.resetForm();
				$('#afModal').closeModal();
				Meteor.call("addMemo",doc,(err,result)=>{
					if(!err){
						Session.set('isLoadingMemo', false);					
					}
				});
			}
		}
	},
}
Meteor.Spinner.options = {
	color:"#fff"
};
AutoForm.hooks({
  NewMemo: hooksObject
});