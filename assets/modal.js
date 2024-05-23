
const modal = document.querySelector(".modal")
const btnModalOpenLogin = document.querySelector(".btn-login")
const btnModalOpenSignup = document.querySelector(".btn-signup")

const btnModalCloseSignup = document.querySelector(".signup__header .modal__close")
const btnModalCloseLogin = document.querySelector(".login__header .modal__close")

const btnOpenLogin = document.querySelector(".signup__login .signup__link")
const btnOpenSignup = document.querySelector(".login__signup .login__link")

const btnOpenLoginFooter = document.getElementById('btnLoginFooter');
const btnOpenSignupFooter = document.getElementById('btnSignupFooter');

const signup = document.querySelector('.signup')
const login = document.querySelector('.login')

btnModalOpenLogin.addEventListener('click', (e) => {
    login.style.display = "flex"
    modal.showModal();
})

btnModalOpenSignup.addEventListener('click', (e) => {
    signup.style.display = "flex"
    modal.showModal();
})

btnModalCloseSignup.addEventListener('click', (e) => {
    signup.style.display = "none"
    modal.close();
})
btnModalCloseLogin.addEventListener('click', (e) => {
    login.style.display = "none"
    modal.close();
})

btnOpenSignup.addEventListener('click', () => {
    login.style.display = "none"
    signup.style.display = "flex"
})

btnOpenLogin.addEventListener('click', () => {
    signup.style.display = "none"
    login.style.display = "flex"
})

// FOOTER
btnOpenSignupFooter.addEventListener('click', (e) => {
    e.preventDefault()
    login.style.display = "none"
    signup.style.display = "flex"
    modal.showModal()
    console.log("SIgnup")
})

btnOpenLoginFooter.addEventListener('click', (e) => {
    e.preventDefault()
    signup.style.display = "none"
    login.style.display = "flex"
    modal.showModal()
    console.log("LOInf")
})
