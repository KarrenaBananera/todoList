const AuthUI = (function() {
    let isLoggedIn = false;

    function init() {
        const btnLogin = document.getElementById('btnLogin');
        const btnRegister = document.getElementById('btnRegister');
        const btnLogout = document.getElementById('btnLogout');

        if(btnLogin) {
            btnLogin.addEventListener('click', () => {
                setAuthStatus(true);
            });
        }

        if(btnRegister) {
            btnRegister.addEventListener('click', () => {
                setAuthStatus(true);
            });
        }

        if(btnLogout) {
            btnLogout.addEventListener('click', () => {
                setAuthStatus(false);
            });
        }
        
        updateUI();
    }

    function setAuthStatus(status) {
        isLoggedIn = status;
        updateUI();
        if(window.TaskUI) {
            window.TaskUI.showToast(isLoggedIn ? 'Successfully logged in.' : 'Successfully logged out.', 'success');
        }
    }

    function updateUI() {
        const loggedOutState = document.getElementById('loggedOutState');
        const loggedInState = document.getElementById('loggedInState');

        if(loggedOutState && loggedInState) {
            if(isLoggedIn) {
                loggedOutState.classList.add('d-none');
                loggedInState.classList.remove('d-none');
            } else {
                loggedOutState.classList.remove('d-none');
                loggedInState.classList.add('d-none');
            }
        }
    }

    return {
        init
    };
})();

window.AuthUI = AuthUI;
