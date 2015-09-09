
class JsonSchemaParser {
	constructor() {}

	resolveRefs(schema) {
		if (typeof schema === 'string') {
			schema = JSON.parse(schema);
		}

		traverseSchema(schema.properties, schema.definitions);
		removeRefs(schema);

		return schema;
	}
}

function traverseSchema(schema, defs) {

	if (_.isArray(schema)) {
		
		schema.forEach((item) => {
			if (_.isObject(item) || _.isArray(item)) {
				traverseSchema(item, defs);
			}
		});

	} else if (_.isObject(schema)) {
		let keys = Object.keys(schema);

		keys.forEach((key) => {
			if (key === '$ref') {
				console.log('got a $ref for ', schema);
				_.extend(schema, getReference(schema[key], defs));
				
				
			} else if (_.isObject(schema[key]) || _.isArray(schema[key]) && !schema['$ref']) {
				traverseSchema(schema[key], defs);
			}
		});
	}
}

function removeRefs(schema) {
	if (_.isObject(schema)) {
		let keys = Object.keys(schema);

		keys.forEach((key) => {
			if (key == '$ref') {
				delete schema[key];
			} else {
				removeRefs(schema[key]);
			}
		})
	} else if (_.isArray(schema)) {
		schema.forEach((item) => {
			removeRefs(item);
		})
	}
}

function getReference(schemaDef, definitions) {
	let schemaKey = _.last(schemaDef.split('/'));
	if (definitions[schemaKey]) {
		return definitions[schemaKey];
	} else {
		new Error('couldn\'t find definition for ', schemaKey);
	}
}

export default JsonSchemaParser;