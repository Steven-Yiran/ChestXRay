//for running events and functions
const fileSelector = document.getElementById('input-image');
const imgPreview = document.getElementById('img-preview');
const diagOutput = document.getElementById("diag-info");
const formElement = document.getElementById("image-frm");
const resetButton = document.getElementById("reset-btn");
const checkBoxField = document.getElementById("consent-area")
const checkBox = document.getElementById("consent-box");
const keyInputField = document.getElementById('id-input-area');


function displayImage(event) {
  const image = event.target.files[0];
  const reader = new FileReader();

  reader.addEventListener('load', event => {
    imgPreview.src = event.target.result;
    // imgPreview.onload = () => {
    //   console.log("Processing " + image.name);
    // }
  });

  reader.readAsDataURL(image);
}

// upload preview
fileSelector.addEventListener('change', displayImage);


function updateInfo(json) {
  if (json.success) {
    const resultClass = json.class === 1 ? 'POSITIVE' : 'NEGATIVE';
    const resultProb = json.prob.toFixed(3);
    const output = `Predicted covid ${resultClass} with probability ${resultProb}`;
    // display results
    diagOutput.innerHTML = output;
    checkBoxField.style.display = "block";
  } else {
    diagOutput.innerHTML = "Request Failed";
  }
}


function runInference() {
  // force display preview
  
  const FD = new FormData(formElement);

  const url = "/predict"
  const options = {
    body: FD, 
    method: 'post'
  }
  // consume the prediction api
  fetch(url, options)
    .then(res => res.json())
    .then(updateInfo)
    .catch(err => console.error('error:' + err));
}


resetButton.addEventListener('click', () => {
  imgPreview.src = '';
  diagOutput.innerHTML = "Diagnosis information will be displayed here...";
  checkBox.checked = false;
  checkBoxField.style.display = "none";
  keyInputField.style.display = "none";
})


checkBox.addEventListener('change', () => {
  if (checkBox.checked) {
    keyInputField.style.display = "block";
    console.log(fileSelector.files[0].name);
  } else {
    keyInputField.style.display = "none";
  }
})