
    document.getElementById("login-form").addEventListener("submit", function (e) {     //when submit is pressed and prevent reload of the  page do this ..
                e.preventDefault();

    const form = e.target; // Get the form element
 
    const formData = new FormData(form);

    const screenName = formData.get("screenName");
    document.getElementById("screen-input").value ="";

  

    if (screenName.trim()) {

        document.getElementById("screen-input").value ="";


        fetch('http://13.58.196.73:8080/login', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    screenName: screenName // change this to the actual name
  })
})
.then(response => response.json())
.then(data => {
  console.log(data);

  if (data.success) {
   // alert(data.message); 
   window.location.href ="game.html"

     // e.g., "User added successfully" or "User already exists"
  } else {
    alert(data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
});


    }
    else {
        document.getElementById("loginError").innerText = "Please enter a name";
    }
});


function checkSession() {

   fetch('http://13.58.196.73:8080/session', {
  method: 'GET',
  credentials: 'include',  // important for session cookies!
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log(data);

  if (data.loggedIn) {
    alert(`Logged in as: ${data.user}`);
  } else {
    alert("Not logged in");
  }
})
.catch(error => {
  console.error('Error:', error);
});
}
