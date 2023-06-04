# dxbot

## binary bot script <br>

Binary bot that runs with `JavaScript` and `CoffeeScript` code <br>
Simple library of `Run`, `Stop`, `Trade`, `Notify` <br>

## Basic library

```js
Run(callback, <string | market>)
```

```js
Stop(); // just void function
```

```ts
type param = {
  message: string;
  className: string; // success, warning, info, danger
};
Notify(param);
```

```ts
type param = {
  amount: number;
  contract: string;
  duration: number;
  duration_unit?: string; // optional of 't' 's' 'm'
  barrier?: string; // optional of '+0.00', '-0.00'
  prediction?: number; // optional of 0-9
};
```
