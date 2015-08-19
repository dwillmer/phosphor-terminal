Phosphor-Terminal
=================

Source Build
------------

**Prerequisites**
- [git](http://git-scm.com/)
- [node](http://nodejs.org/)


```bash
git clone https://github.com/phosphorjs/phosphor-terminal.git
cd phosphor-terminal
npm install
npm run build
```

Output will be placed in the `/dist` directory.

Clean Build
-----------

```bash
npm run clean
npm run build
```


Build Examples
--------------

Follow the source build instructions first.

```bash
npm run build:examples
```

Navigate to `index.html` of the example of interest.


Run Tests
---------

Follow the source build instructions first.

```bash
npm run tests
```

Navigate to `tests/index.html` to run the tests.


Supported Browsers
------------------
The browser versions which are currently *known to work* are listed below.
Earlier versions may also work, but come with no guarantees.

- IE 11
- Firefox 32+
- Chrome 38+
