/**
 * Autocomplete match generator and syntax "tree"
 *
 * @todo: create live-template like structure for snippets (placing cursor between {} or [])
 * @todo: contextual autocomplete
 * @todo: complete list of keys, include from nested objects as well
 * @todo: different models for different modes (currently only supports JSON)
 *
 * ideas:
 *  - automate syntax generation
 *
 * @type {*[]}
 */

export const map = [
	{
		"name": "\"id\"",
		"value": "id",
		"meta": "cwl",
		"caption": "id",
		"snippet": "id: "
	},
	{
		"name": "class",
		"value": "\"class\"",
		"meta": "cwl",
		"snippet": "\"class\": "
	},
	{
		"name": "@context",
		"value": "\"@context\"",
		"meta": "cwl",
		"snippet": "\"@context\": "
	},
	{
		"name": "label",
		"value": "\"label\"",
		"meta": "cwl",
		"snippet": "\"label\": "
	},
	{
		"name": "description",
		"value": "\"description\"",
		"meta": "cwl",
		"snippet": "\"description\": "
	},
	{
		"name": "owner",
		"value": "\"owner\"",
		"meta": "cwl",
		"snippet": "\"owner\": "
	},
	{
		"name": "contributor",
		"value": "\"contributor\"",
		"meta": "cwl",
		"snippet": "\"contributor\": "
	},
	{
		"name": "requirements",
		"value": "\"requirements\"",
		"meta": "cwl",
		"snippet": "\"requirements\": "
	},
	{
		"name": "inputs",
		"value": "\"inputs\"",
		"meta": "cwl",
		"snippet": "\"inputs\": "
	},
	{
		"name": "outputs",
		"value": "\"outputs\"",
		"meta": "cwl",
		"snippet": "\"outputs\": "
	},
	{
		"name": "baseCommand",
		"value": "\"baseCommand\"",
		"meta": "cwl",
		"snippet": "\"baseCommand\": "
	},
	{
		"name": "stdin",
		"value": "\"stdin\"",
		"meta": "cwl",
		"snippet": "\"stdin\": "
	},
	{
		"name": "stdout",
		"value": "\"stdout\"",
		"meta": "cwl",
		"snippet": "\"stdout\": "
	},
	{
		"name": "successCodes",
		"value": "\"successCodes\"",
		"meta": "cwl",
		"snippet": "\"successCodes\": "
	},
	{
		"name": "temporaryFailCodes",
		"value": "\"temporaryFailCodes\"",
		"meta": "cwl",
		"snippet": "\"temporaryFailCodes\": "
	},
	{
		"name": "arguments",
		"value": "\"arguments\"",
		"meta": "cwl",
		"snippet": "\"arguments\": "
	}
];

let generateCompletion = function(name) {

	return {
		name: name,
		value: name,
		meta: 'cwl',
		snippet: '"' + name + '": '
	}
};

export const getMatches = function (prefix) {
	map.forEach((value) => {
		value.score = getEditDistance(prefix, value.name) * 50;
	});

	let filter = map.filter((value) => {
		return value.score > 60;
	});

	console.log(filter);

	return filter;
};


/*
 Copyright (c) 2011 Andrei Mackenzie
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

let getEditDistance = function(a, b){
	if(a.length == 0) return b.length;
	if(b.length == 0) return a.length;

	var matrix = [];

	// increment along the first column of each row
	var i;
	for(i = 0; i <= b.length; i++){
		matrix[i] = [i];
	}

	// increment each column in the first row
	var j;
	for(j = 0; j <= a.length; j++){
		matrix[0][j] = j;
	}

	// Fill in the rest of the matrix
	for(i = 1; i <= b.length; i++){
		for(j = 1; j <= a.length; j++){
			if(b.charAt(i-1) == a.charAt(j-1)){
				matrix[i][j] = matrix[i-1][j-1];
			} else {
				matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
					Math.min(matrix[i][j-1] + 1, // insertion
						matrix[i-1][j] + 1)); // deletion
			}
		}
	}

	return matrix[b.length][a.length];
};