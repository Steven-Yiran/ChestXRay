//for running events and functions
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
  // Load the model.
  mobilenet.load().then(model => {
    // Classify the image.
    model.classify(output).then(predictions => {
      console.log('Predictions: ');
      console.log(predictions);
    });
  });
}

function resetImage(image) {
  output.src = '';
}

/*
tf.loadLayersModel("jsmodel/model.json").then(model => {
	this._model = model;
})*/