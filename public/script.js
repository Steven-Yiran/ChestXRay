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
      
      output.onload = g => {
        console.log("Processing " + image.name);
      }
    });

    reader.readAsDataURL(image);
});


function predict() {
  img = document.getElementById("output");
  // Load the model.
  mobilenet.load().then(model => {
    // Classify the image.
    model.classify(img).then(predictions => {
      console.log('Predictions: ');
      console.log(predictions);
    });
  });
}

function resetImage(image) {
  output.src = '';
}