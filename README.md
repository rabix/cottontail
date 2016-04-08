# Cottontail


## Packaging
Running `npm run package` in the root project folder will produce a tarball in the "release" subfolder.

## Unpacking
1. Either use your OS to unpack the tar, or run `tar -zxf {archive_name} -C {output_folder}`.
2. Run `sudo npm link` to create the `cottontail` global symlink.
3. Use it by running `cottontail [directory (optional)] [-o (open browser, optional)] [--port 1337 (optional)]`

In order to improve our software, we may report runtime errors back to our servers.
If you explicitly wish to disable this, you can add a `--no-error-reporting` parameter to the CLI command.

## Tests

**Server tests: **
To run the server tests run the following command from the project root:

	node serverSpec-runner.js

This will run the tests in the ==/spec== folder and generates a JUnitXml report in the ==/spec/report== folder. The tests files must have a ***[sS]pec.js** ending.

