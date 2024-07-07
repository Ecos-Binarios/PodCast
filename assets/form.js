import { getLogin, getRegistro } from "../api/api.js";

const loginForm = document.getElementById("login__form");
const loginInput = document.querySelectorAll(".login__input input");

const registerForm = document.getElementById("signup__form");
const registerInput = document.querySelectorAll(".signup__input input");

const modal = document.querySelector(".modal");
const signup = document.querySelector('.signup');
const login = document.querySelector('.login');


console.log(registerInput)

const credential = {
  email: "",
  password: "",
};

const register = {
    name: "",
    lastname: "",
    email: "",
    password: "",
    passwordrepeat: ""
}

registerInput.forEach((input) => {
    input.addEventListener("input", e => {
        register[e.target.name] = e.target.value;
    });
});


loginInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    credential[e.target.name] = e.target.value;
  });
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if(register.password !== register.passwordrepeat){
    alert("A COLOCADO CONTRASEÑAS DIFERENTES")
  }

  const user = {
    name: register.name,
    lastname: register.lastname,
    email: register.email,
    password: register.password,
  }

  const response =  await getRegistro(user);
  console.log(response)
  if(response.message){
    alert("REGISTER OK")   
    signup.style.display = "none"
    login.style.display = "flex";
   }

});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(credential)

  const response = await getLogin(credential);
   console.log(response)
  if (response.message === "ok" && response.data !== undefined) {
    sessionStorage.setItem("user", JSON.stringify(response.data));
    /* setCookie('token', data.user.token, 7) */
    window.location.href = "/pages/dashboard/dashboard.html";
  }
});
