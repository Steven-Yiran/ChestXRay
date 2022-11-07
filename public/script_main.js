//for running events and functions
const fileSelector = document.getElementById('input-image');
const output = document.getElementById('output');
const diagOutput = document.getElementById("diag_info");
const formElement = document.getElementById("image-frm");

// upload preview
fileSelector.addEventListener('change', async (event) => {
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
// https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript#using_xmlhttprequest_and_the_formdata_object
function postImage() {
  const XHR = new XMLHttpRequest();
  const FD = new FormData(formElement);

  // Define error behavior
  XHR.addEventListener('error', (event) => {
    alert('Oops! Something went wrong');
  });

  XHR.onreadystatechange = () => {

    if (XHR.readyState === 4) {
      // if successfully received response
      const respond = XHR.response;
      const body = JSON.parse(respond)
      const resultClass = body.class === 1 ? 'POSITIVE' : 'NEGATIVE';
      const resultProb = body.prob.toFixed(3);
      const output = `Predicted covid ${resultClass} with probability ${resultProb}`;
      diagOutput.innerHTML = output;
    }
  }

  XHR.open('POST', '/predict');

  XHR.send(FD);
}


function resetImage() {
  output.src = '';
  diagOutput.innerHTML = "Diagnosis information will be displayed here...";
}