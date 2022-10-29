//for running events and functions
const fileSelector = document.getElementById('input-image');
const output = document.getElementById('output');
const diagOutput = document.getElementById("diag_info");
const formElement = document.getElementById("image-frm");

// upload preview
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


// Based on:
// https://stackoverflow.com/questions/46640024/how-do-i-post-form-data-with-fetch-api
function postImage() {
  const data = new URLSearchParams();
  for (const pair of new FormData(formElement)) {
    data.append(pair[0], pair[1]);
  }
  console.log("here!");
  console.log(data);
  // const url = "/predict";
  // const response = await fetch(url, {
  //   method: 'post',
  //   body: data,
  // })
  // const body = await response.json();
  // console.log(body);
}


function resetImage() {
  output.src = '';
  diagOutput.innerHTML = "Diagnosis information will be displayed here...";
}