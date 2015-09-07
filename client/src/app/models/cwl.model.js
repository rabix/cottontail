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
	return {
		value: key,
		meta: 'CWL',
		caption: key,
		snippet: '"' + key + '": '
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

