class JsonSchemaParser {
	constructor(schema) {
		this.schema = this.resolveRefs(schema);
	}

	resolveKeyType(key, schema = this.schema) {
		if (!_.isString(key)) {
			throw new Error('JsonSchemaParser.resolveKeyType(key): Key must be a string');
		}

		let result = null;

		if (_.isArray(schema)) {
			for (var i = 0; i < schema.length; i++) {
				result = this.resolveKeyType(key, schema[i]);
				if (result) {
					break;
				}
			}
		} else {
			for (var oProp in schema) {
				if (!schema.hasOwnProperty(oProp)) {
					continue;
				}
				if (oProp === key) {
					return schema[key];
				}
				if (schema[oProp] instanceof Object || schema[oProp] instanceof Array) {
					result = this.resolveKeyType(key, schema[oProp]);
					if (result) {
						break;
					}
				}
			}
		}

		return result;
	}

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