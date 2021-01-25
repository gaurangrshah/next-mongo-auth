const logger = (e) => console.log('Err!', e)
export default async function TC(tryFn, catchFn = logger) {
  let val;
  try {
    val = tryFn();
  } catch (e) {
    val = catchFn(e);
  }
  return await val;
}

/*
 USAGE:

 tc(
  () =>
    state
      ? console.log("state found", state)
      : new Error("No State Found", state),
  (e) => console.log("Err!", e)
);

*/
