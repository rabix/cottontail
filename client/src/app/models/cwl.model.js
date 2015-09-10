import JsonSchemaParser from '../services/JsonSchemaParser';
import * as toolSchema from '../schemas/tool.schema';

const keyList = [ 'id',
	'class',
	'@context',
	'label',
	'description',
	'owner',
	'contributor',
	'requirements',
	'inputs',
	'outputs',
	'baseCommand',
	'stdin',
	'stdout',
	'successCodes',
	'temporaryFailCodes',
	'arguments',
	'sbg:name',
	'sbg:latestRevision',
	'sbg:modifiedBy',
	'sbg:sbgMaintained',
	'sbg:createdOn',
	'sbg:modifiedOn',
	'sbg:createdBy',
	'sbg:revisionsInfo',
	'sbg:projectSlug',
	'sbg:validationErrors',
	'sbg:revision',
	'sbg:projectId',
	'sbg:job',
	'sbg:contributors',
	'dockerPull',
	'dockerImageId',
	'value',
	'fileDef',
	'fileContent',
	'filename',
	'engine',
	'script',
	'sbg:category',
	'type',
	'inputBinding',
	'name',
	'symbols',
	'sbg:cmdInclude',
	'separate',
	'position',
	'prefix',
	'outputBinding',
	'sbg:inheritMetadataFrom',
	'valueFrom',
	'allocatedResources',
	'input',
	'size',
	'path',
	'secondaryFiles',
	'mem',
	'cpu' ];

const makeJsonSnippet = function (key) {
	let parser = new JsonSchemaParser(toolSchema),
		type = parser.resolveKeyType(key),
		snippet = key;
	let typeName = type ? type.type : 'string';

	// strings are formatted funky to preserve white spaces
	switch (typeName) {
		case 'string':
			snippet =
`"${key}": "\${1:${key}}"`;
			break;
		case 'object':
			snippet =
`"${key}": {
	"\${1}": \${2}
}`;
			break;
		case 'array':
			snippet =
`"${key}": [
	\${1}
]`;
	}

	return {
		value: key,
		meta: 'CWL',
		caption: key,
		snippet: snippet
	};
};

const makeYamlSnippet = function (key) {
	return {
		value: key,
		meta: 'CWL',
		caption: key,
		snippet: key + ':'
	};
};

const generateSnippet = function(key, lang) {
	switch(lang) {
		case 'json':
		default:
			return makeJsonSnippet(key);
		case 'yaml':
			return makeYamlSnippet(key);
	}
};



export {keyList, generateSnippet};

