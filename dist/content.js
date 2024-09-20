"use strict";
const onSelectText = () => {
    const selected = window.getSelection().toString();
    console.log(selected);
};
document.addEventListener("selectstart", () => {
    document.addEventListener("mouseup", onSelectText);
});
