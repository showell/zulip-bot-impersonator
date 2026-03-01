## Initial setup

Install oxlint:

`npm add -D oxlint`

## Development workflow

I usually keep 4 terminals open:

* npm run dev # listens on 7888 usually
* npx tsc -w --noEmit # shows TS errors
* <editor>
* <git, etc.>


I also lint every now and then:
* `npx oxlint`
* `npx prettier src/*.ts src/dom/*ts src/backend/*.ts src/plugins/*.ts --write`

## Tests

* npm run test

## Server stuff (in progress)

I did:

```
npm install vite-node --save-dev
```

Then do:

```
npm run server
```
