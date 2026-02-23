Dev server: `npm run dev`

Add your bot data in src/secrets.ts after doing:

```
cp secrets.template.ts ./src/secrets.ts
```

Keep the TS compiler running in a separate window:

```
npx tsc -w --noEmit
```

Use oxlint every now and then:

```
npm add -D oxlint
npx oxlint
```

`npx prettier src/*.ts src/dom/*ts src/backend/*.ts --write` too

## Node stuff

I did:

```
npm install vite-node --save-dev
```

Then do:

```
npx run server
```
