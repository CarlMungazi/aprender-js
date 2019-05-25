module.exports = function mount($app, $root) {
  console.log($root)
  return $root.appendChild($app);
}