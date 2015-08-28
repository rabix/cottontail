/**
 * Created by Maya on 26.8.15.
 */

import * as config from '../../constants/editor.const';
import * as CWL from '../../models/cwl.model.js';

class Editor {
	constructor() {
		this.config = {
			require: ['ace/text/language_tools'],
			advanced: {
				enableSnippets: true,
				enableBaicAutocompletion: false
				//enableLiveAutocompletion: true  //to disable local completer
			},
			theme: config.EDITOR_THEME,
			onLoad: this.load
		};
	}

	load (editor) {
		editor.$blockScrolling = Infinity;

		let langTools = ace.require('ace/ext/language_tools');

		let cwlCompleter = {
			getCompletions: function(editor, session, pos, prefix, callback) {
				callback(null, CWL.getMatches(prefix));
			}
		};

		langTools.setCompleters([cwlCompleter]); //to disable local completer

		editor.setOptions({
			enableBasicAutocompletion: true
		})
	}

	setMode (mode) {
		this.config.mode = mode;
	}
}

angular.module('cottontail').service('Editor', Editor);

export default Editor;