import { TemplateController } from 'meteor/space:template-controller';
import { Memos } from '../../api/memos.js';
import { Label } from '../../api/label.js';

import './LabelDetail.html';
import '../partials/Memo.js';
import '../partials/List/List.js';
import '../partials/ViewBtn.js';
import '../partials/PageTitle.js';

TemplateController('LabelDetail', {
	onCreated(){
		this.autorun(()=>{
			this.subscribe('memoWithLabels',this.data._id);
			this.subscribe('label');
		});
	},

	helpers:{
		memos(){
			let lists = Memos.find({labelId:this.data._id});
			return lists;
		},
	},
});