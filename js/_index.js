/* 
    Set preferred/short name
*/

function setPreferredName() {
  const fullName = document.querySelector("#name");
  const preferredNameContainer = document.querySelector(
    'label[for="preferred-name"]'
  );
  const inputSizer = document.querySelector(
    'span.input-sizer[data-field="preferred-name"]'
  );
  const preferredName = document.querySelector("#preferred-name");
  if (!fullName.value || fullName.value === "") {
    preferredNameContainer.setAttribute("data-active", "false");
    preferredName.value = "";
    inputSizer.innerText = "";
  } else {
    const shortName = fullName.value.split(/\s/);
    preferredName.value = shortName[0];
    inputSizer.innerText = shortName[0];
    // Set reveal timeout
    if (preferredNameContainer.getAttribute("data-active") === "false") {
      setTimeout(() => {
        preferredNameContainer.setAttribute("data-active", "true");
      }, 1500);
    } else {
      preferredNameContainer.setAttribute("data-active", "true");
    }
  }
  sizePreferredName();
}

function sizePreferredName() {
  const inputSizer = document.querySelector(
    'span.input-sizer[data-field="preferred-name"]'
  );
  const preferredName = document.querySelector("#preferred-name");
  preferredName.style.width = `${inputSizer.offsetWidth + 15}px`;
}

/*
setPreferredName()
sizePreferredName()
document.querySelector('#name').addEventListener('keyup', setPreferredName)
document.querySelector('#preferred-name').addEventListener('keyup', (e) => {
    document.querySelector('span.input-sizer[data-field="preferred-name"]').innerText = e.target.value
    sizePreferredName()
})
*/

let existingSubscriber = false;

function handleURLParams() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const email = params.get("email");
  const notifications = params.get("notifications");
  if (name) {
    document.querySelector("#name").value = name;
  }
  if (email) {
    document.querySelector('label[for="email"]').innerHTML +=
      '<p class="email-update">Need to update your email address? Contact us at <a href="mailto:info@adventproject.org">info@adventproject.org</a>.</p>';
    document.querySelector("#email").value = email;
    document.querySelector("#email").setAttribute("disabled", "");
  }
  if (notifications) {
    document.querySelector("#notifications").value = notifications;
  }
  if (name || email) {
    existingSubscriber = true;
    document.querySelector('input[type="submit"]').value = "Update";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  handleURLParams();
});

/* 
    Handle form submission 
*/

function submitForm(form) {
  let subscribeObj = {};

  subscribeObj.name = form.querySelector("#name").value;
  subscribeObj.email = form.querySelector("#email").value;

  if (form.querySelector("#preferred-name")) {
    subscribeObj.preferredName = form.querySelector("#preferred-name").value;
  }
  if (form.querySelector("#notifications")) {
    subscribeObj.notifications = form.querySelector("#notifications").value;
  }

  // Get status text element
  const statusEl = document.querySelector("#status");
  statusEl.setAttribute("class", "subscribing");
  statusEl.innerText = "Subscribing...";

  // take the data and post to the netlify function
  fetch(".netlify/functions/subscribe", {
    body: JSON.stringify(subscribeObj),
    method: "POST",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // Map terse Sendy API responses to friendly messages
      let statusText = data.message,
        statusType = "";
      if (data.success == true) {
        statusText = `🎉 Subscribed! Talk to you soon.`;
        statusType = "success";
      } else {
        let alreadySubscribedMessage = {
          sendyText: "Already subscribed",
          type: "info",
          text: `You're already subscribed! Thanks for reading.`,
        };
        if (subscribeObj.notifications !== "" || existingSubscriber == true) {
          alreadySubscribedMessage.text = `Thanks! Your preferences have been updated.`;
        }
        const errorMessages = [alreadySubscribedMessage];
        errorMessages.forEach((obj) => {
          if (data.message.includes(obj.sendyText)) {
            statusText = obj.text;
            statusType = obj.type;
          }
        });
      }
      statusEl.innerText = statusText;
      statusEl.setAttribute("class", statusType);
    })
    .catch((error) => {
      statusEl.innerText = `There was an issue connecting to our system. Sorry! Please email us at info@adventproject.org, and we can update your information.`;
      statusEl.setAttribute("class", "error");
    });
}

document.querySelector("#subscribe").addEventListener("submit", (e) => {
  e.preventDefault();
  submitForm(e.target);
});
