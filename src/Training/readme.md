# Training Detail

For regeneration of ITS DS:

## main.scss

```css
@use 'grid/src/scss/component' as grid;
@use 'body/src/scss/component' as body;
@use 'button/src/scss/component' as button;
```

## package.json

```json
"dependencies": {
    "@uqds/body": "file:../../",
    "@uqds/button": "file:../../",
    "@uqds/core": "file:../../",
    "@uqds/grid": "file:../../"
}
```

To preview changes on localhost: <http://localhost:8080/index-training.html>
