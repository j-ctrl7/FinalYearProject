
function setFormMessage(formElement, type, message){
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove(".form__message--success", ".form__message--error");
    messageElement.classList.add('.form__message--${type}');
}


//
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('login');
    const createAccountForm = document.getElementById('createAccount');

    document.getElementById('linkCreateAccount').addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.getElementById('linkLogin').addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

});