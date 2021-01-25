export function onNoMatch(req, res) {
  res.status(404).end("page is not found... or is it");
}

export function onError(err, req, res, next) {
  console.log(err);

  res.status(500).end(err.toString());
  // OR: you may want to continue
  next();
}
