
//checking password strength in signup authentication folder

let strongOrweak = document.getElementById("strong-or-weak")
let pass = document.getElementById("password");
pass.addEventListener("keyup", () => {
  checkPassword(pass.value)
})

tippy('#password', {
  content: "Password should include: Capital and small letters, numbers, special characters and min 8 characters",
  placement: 'top-end',
  theme: 'google'
})

function checkPassword(passoword) {

  var strengthBar = document.getElementById("strength");
  var buttonSignUp = document.getElementById("signup")
  var strength = 0;

  // if (passoword.match(/[a-zA-Z0-9][a-zA-Z0-9]+/)) {
  //   strength += 1

  // }

  if (passoword.match(/[a-z]+/)) {
    strength += 1

  }
  if (passoword.match(/[A-Z]+/)) {
    strength += 1

  }
  if (passoword.match(/[0-9]+/)) {
    strength += 1

  }
  if (passoword.match(/[~<>?!@$%^&*()]+/)) {
    strength += 1

  }
  // if (passoword.match(/[!@$%^&*()]+/)) {
  //   strength += 1

  // }
  if (passoword.length >= 8) {
    strength += 1

  }
  switch (strength) {
    case 0:
      strengthBar.value = "20"
      strengthBar.removeAttribute("class");
      buttonSignUp.disabled=true
      strengthBar.classList.add("progress-20")
      strongOrweak.innerHTML=" weak password"
     //strengthBar.style.backgroundColor="red"
      break;
      case 1:
      strengthBar.value = "40"
      strengthBar.removeAttribute("class");
      buttonSignUp.disabled=true
      strengthBar.classList.add("progress-40")
      strongOrweak.innerHTML=" weak password"
      break;
      case 2:
      strengthBar.value = "60"
      strengthBar.removeAttribute("class");
      buttonSignUp.disabled=true
      strengthBar.classList.add("progress-60")
      strongOrweak.innerHTML=" weak password"
      break;
      case 3:
      strengthBar.value = "80"
      strengthBar.removeAttribute("class");
      buttonSignUp.disabled=true
      strengthBar.classList.add("progress-80")
      strongOrweak.innerHTML=" weak password"
      break;
      case 4:
      strengthBar.value = "90"
      strengthBar.removeAttribute("class");
      buttonSignUp.disabled=true
      strengthBar.classList.add("progress-90")
      strongOrweak.innerHTML=" weak password"
      break;
      case 5:
      strengthBar.value = "100"
      strengthBar.removeAttribute("class")
      strengthBar.classList.add("progress-100");
      buttonSignUp.disabled=false
      strongOrweak.innerHTML=" strong password"
      break;
  }
}