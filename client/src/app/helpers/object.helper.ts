export class ObjectHelper {

    private static pathDelimiter = ".";

    /**
     * Adds a value to a nested path in an object
     *
     * @param target Target object to add properties to
     * @param path dot-delimited path, ex. "foo.bar.baz"
     * @param value value to add to the "baz" key
     */
    public static addProperty(target: Object, path: string[] | string, value: any): void {

        // Ensure that path is an array of path elements
        const path = typeof path === "string" ? path.split(ObjectHelper.pathDelimiter) : path;

        path.reduce((acc, curr, index, arr)=> {
            if (index === arr.length - 1) {
                return acc[curr] = value;
            }

            if (!acc.hasOwnProperty(curr)) {
                acc[curr] = {};
                return acc[curr];
            } else if (typeof acc[curr] === "object" && acc[curr] !== null) {
                return acc[curr];
            } else {
                throw new Error("Couldn't add a nested property to type " + typeof acc);
            }
        }, target);
    }

    public static getProperty(target: Object, path: string[] | string, defaultValue?: any): any {
        // Ensure that path is an array of path elements
        const path = typeof path === "string" ? path.split(ObjectHelper.pathDelimiter) : path;

        let lastRef = target;
        for (let key of path) {
            if (lastRef.hasOwnProperty(key)) {
                lastRef = lastRef[key];
            } else {
                return defaultValue;
            }
        }

        return lastRef;
    }

    /**F
     * Overwrite enumerable properties of the target with the ones from the source object
     * @param target
     * @param source
     * @returns {Object}
     * @link ObjectHelper-addEnumerablesTest
     */
    public static extendEnumerables(target: Object, source: Object): void {
        for (let key of Object.keys(source)) {
            if (target.propertyIsEnumerable(key)) {
                target[key] = source[key];
            }
        }
    }

    public static findChild(children: Object[],
                            path: string[],
                            comparator: (child: any, pathKey: string) => boolean,
                            childrenKey = "children"): any {


        let pathKey = path.shift();

        for (let i = 0; i < children.length; i++) {
            let child = children[i];

            if (comparator(child, pathKey) === true) {
                if (path.length === 0) {
                    return child;
                } else {
                    return ObjectHelper.findChild(child[childrenKey], path, comparator);
                }
            }
        }

        // No match found
    }

    public static extendWithNonExisting(target: Object, ...sources: Object[]): void {

        for (let i = 0; i < sources.length; i++) {
            for (let key of Object.keys(sources[i])) {
                if (!target.hasOwnProperty(key)) {
                    target[key] = sources[i][key];
                }
            }
        }
    }

    public static childrenDiff(target: Object[], update: Object[], identifier: string, defaultProps = {}): Object[] {

        return update.map(item => {
            let correspondingitemInTarget = ObjectHelper
                .findChild(target, [item[identifier]], (ch, key) => ch[identifier] === key);


            ObjectHelper.extendWithNonExisting(item, correspondingitemInTarget || {}, defaultProps);

            return item;

        });

    }
}
