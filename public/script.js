//for running events and functions
/*
tf.loadLayersModel("jsmodel/model.json").then(model => {
	this._model = model;
})*/

const fileSelector = document.getElementById('myFile');
const output = document.getElementById('output');

fileSelector.addEventListener('change', event => {
    output.src = '';
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', event => {
        output.src = event.target.result;
      });
    reader.readAsDataURL(file);
});

