# eslint configuration mega pack

:monocle_face: Opinionated eslint configuration installable as a node package.

```bash
.%%%%%%..%%%%%%...........%%%%...%%%%%%..%%..%%..%%%%%%..........%%%%%%...%%%%....%%%%...%%..%%.
...%%......%%............%%..%%....%%....%%%.%%....%%............%%......%%..%%..%%.......%%%%..
...%%......%%............%%%%%%....%%....%%.%%%....%%............%%%%....%%%%%%...%%%%.....%%...
...%%......%%............%%..%%....%%....%%..%%....%%............%%......%%..%%......%%....%%...
.%%%%%%....%%............%%..%%..%%%%%%..%%..%%....%%............%%%%%%..%%..%%...%%%%.....%%...
................................................................................................
```

Covers:

* Typescript
* Jest
* JSdoc
* Importing + sorting
* Prettier integration
* and more.. see [src/Configurations/](src/Configurations)!

## Bundled Plugins

* <https://github.com/ony3000/prettier-plugin-classnames>
* <https://github.com/ony3000/prettier-plugin-merge>
* <https://github.com/ony3000/prettier-plugin-brace-style>
* <https://github.com/hosseinmd/prettier-plugin-jsdoc>
* https://github.com/electrovir/prettier-plugin-multiline-arrays
* https://github.com/ggascoigne/prettier-plugin-import-sort
* https://github.com/ttskch/prettier-plugin-tailwindcss-anywhere

## Installation

> You can remove all eslint related dependencies from your
> projects `package.json` as installing this package will
> install the required dependencies for you.

To use this package in your own projects simply run:

```shell
npm i -D @mateothegreat/eslint-config@latest
```

and then update your `package.json` to include:

```json
{
    ...
    "eslintConfig": {
        "extends": [
            "@mateothegreat/eslint-config"
        ]
    }
    ...
}
```

Now you can run

```shell
npx eslint src/
```

# See also

* <https://github.com/search?q=prettier-plugin+pushed%3A%3E2025-01-01+&type=repositories&p=3>
