import { is, map, pipe } from 'ramda';

const isObject = (obj: unknown): obj is Object => is(Object, obj);

const toCamelCase = (str: string) =>
	str.replace(/[-_]([a-z])/g, (m) => m[1].toUpperCase());

const camelCaseKeys = (obj: Object) => {
	if (Array.isArray(obj)) return map(camelCaseKeys, obj);
	if (isObject(obj)) {
		return pipe(
			Object.entries,
			map(([key, value]) => [toCamelCase(key), camelCaseKeys(value)]),
			Object.fromEntries,
		)(obj);
	}
	return obj;
};

export default camelCaseKeys;
