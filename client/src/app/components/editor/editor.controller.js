/**
 * Created by Maya on 26.8.15.
 */

import * as config from '../../constants/editor.const';
import * as CWL from '../../models/cwl.model.js';
import * as key from '../../services/Shortcuts';
const _private = new WeakMap();
const _editor = {};
const _callbacks = {};
let shortcuts = [];

class Editor {
	constructor() {
		this.config = {
			require: ['ace/text/language_tools'],
			advanced: {
				enableSnippets: true,
				enableBaicAutocompletion: false
			},
			theme: config.EDITOR_THEME,
			onLoad: load
		};
	}

	setMode (mode) {
		this.config.mode = mode;
	}
}

const load = function (editor) {
	_private.set(_editor, editor);

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
	
	editor.$blockScrolling = Infinity;
};

angular.module('cottontail').service('Editor', Editor);

export default Editor;