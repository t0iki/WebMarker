const onSelectText = () => {
  const selected = (window as any).getSelection().toString();
  console.log(selected);
};

document.addEventListener("selectstart", () => {
  document.addEventListener("mouseup", onSelectText);
});
