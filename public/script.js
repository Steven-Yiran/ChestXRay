//for running events and functions
/*
tf.loadLayersModel("jsmodel/model.json").then(model => {
	this._model = model;
})*/

const fileSelector = document.getElementById('img-selector');
const output = document.getElementById('output');

fileSelector.addEventListener('change', async event => {
    output.src = '';
    const image = event.target.files[0];

    const reader = new FileReader();

    reader.addEventListener('load', event => {
        output.src = event.target.result;

        output.onload = async g => {
          console.log("Processing " + image.name);
          await predict(image);
      }
    });

    reader.readAsDataURL(image);
});

async function predict(image) {
  // TO DO: predict on image
  console.log("Predict");
}

function resetImage(image) {
  output.src = '';
}
