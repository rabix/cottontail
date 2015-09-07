/**
 * Created by Maya on 26.8.15.
 */

import * as config from '../../constants/editor.const';
import * as Autocomplete from '../../services/Autocomplete';
const _private = new WeakMap();
const _editor = {};

const load = function (editor) {
	_private.set(_editor, editor);

	let langTools = ace.require('ace/ext/language_tools');

	let cwlCompleter = {
		getCompletions: function (editor, session, pos, prefix, callback) {
			let mode = session.getMode().$id.split('/')[2],
				matches = Autocomplete.getMatches(prefix, mode);

			callback(null, matches);
		}
	};

	langTools.setCompleters([cwlCompleter]); //to disable local completer

	editor.setOptions({
		enableBasicAutocompletion: true,
		enableLiveAutocompletion: true
	});

	editor.$blockScrolling = Infinity;
};

class Editor {
	constructor() {
		this.config = {
			require: ['ace/text/language_tools'],
			advanced: {
				enableSnippets: true,
				enableLiveAutocompletion: false,
				enableBasicAutocompletion: false
			},
			theme: config.EDITOR_THEME,
			onLoad: load
		};
	}

	setMode(mode) {
		this.config.mode = mode;
	}
}

angular.module('cottontail').service('Editor', Editor);

export default Editor;