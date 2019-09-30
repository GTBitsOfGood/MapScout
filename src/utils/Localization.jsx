import LocalizedStrings from 'react-localization';

let localizationStrings = new LocalizedStrings({
    en: {
        //auth page text
        emailLabel: "Email Address",
        emailPlaceholder: "Enter Email",
        passwordLabel: "Password",
        passwordPlaceholder: "Password",
        login: "Log In",
        signUp: "Sign Up",
        forgotPassword: "Forgot Password?",
        //nav bar text
        home: "Home ",
        facilityUpload: "Facility Upload",

    },
    es: {
        //auth page text
        emailLabel: "Dirección de correo electrónico",
        emailPlaceholder: "Ingrese correo electrónico",
        passwordLabel: "Contraseña",
        passwordPlaceholder: "Contraseña",
        login: "Iniciar sesión",
        signUp: "Regístrate",
        forgotPassword: "¿Olvidar la contraseña?",
        //nav bar text
        home: "Casa",
        facilityUpload: "Subida de instalaciones",
    }
});

export default localizationStrings;
