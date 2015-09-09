import * as CWL from '../models/cwl.model';
import * as JsonSchemaParser from 'JsonSchemaparser';
import * as toolSchema from '../schemas/tool.schema';


const calculateLevenshteinDistance = function (a, b) {
	if (a.length == 0) return b.length;
	if (b.length == 0) return a.length;

	var matrix = [];

	// increment along the first column of each row
	var i;
	for (i = 0; i <= b.length; i++) {
		matrix[i] = [i];
	}

	// increment each column in the first row
	var j;
	for (j = 0; j <= a.length; j++) {
		matrix[0][j] = j;
	}

	// Fill in the rest of the matrix
	for (i = 1; i <= b.length; i++) {
		for (j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) == a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
					Math.min(matrix[i][j - 1] + 1, // insertion
						matrix[i - 1][j] + 1)); // deletion
			}
		}
	}

	return matrix[b.length][a.length];
};

/**
 * Matches by fuzzy regex search.
 * @param input
 * @param mode
 * @returns {Array}
 */
const fuzzySearch = function (input, mode) {

	let matches = [],
		pattern = input.split('').join('.*'),
		regex = new RegExp(pattern);

	CWL.keyList.forEach((key) => {
		let snippet = CWL.generateSnippet(key, mode);
		snippet.score = key.search(regex);
		if (snippet.score !== -1) {
			matches.push(snippet);
		}
	});

	return matches;
};

/**
 * Matches by levenshtein distance.
 * @param input
 * @param mode
 * @returns {Array}
 */
const getMatches = function (input, mode) {
	let matches = [];

	CWL.keyList.forEach((key) => {
		let snippet = CWL.generateSnippet(key, mode);
		snippet.score = calculateLevenshteinDistance(input, key);
		if (snippet.score < 20) {
			matches.push(snippet);
		}
	});

	return matches;
};


export {getMatches, fuzzySearch};