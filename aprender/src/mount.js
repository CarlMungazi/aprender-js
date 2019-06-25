module.exports = function mount($app, $root) {
  return $root.appendChild($app);
}