export * from "./dom/render";

// This is obviously shim code, and we should
// eventually cut over to having modules directly
// import from dom/render.  The dom directory in
// general is supposed to be fair game for nearly
// anything, including plugins, first-class widgets,
// showcase demos, coding playgrounds, etc.
