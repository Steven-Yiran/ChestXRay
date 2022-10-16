//for running events and functions
const fileSelector = document.getElementById('img-selector');
const output = document.getElementById('output');
const diagOutput = document.getElementById("diag_info");


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
      console.log('Predictions:');
      console.log(predictions);
      res = "";
      for (let val = 0; val < predictions.length; val++) {
         res += predictions[val]["className"] + ": " + Number(predictions[val]["probability"].toPrecision(3)) + "\n";
      }
      diagOutput.innerHTML = res;
    });
  });
}

function resetImage() {
  output.src = '';
  diagOutput.innerHTML = "Diagnosis information will be displayed here...";
}

/*
tf.loadLayersModel("jsmodel/model.json").then(model => {
	this._model = model;
})*/