import LocalizedStrings from 'react-localization';

let localizationStrings = new LocalizedStrings({
    en: {
        //auth page text
        header: "Provider Login",
        description: "Please verify that you are with the PACTS network",
        emailLabel: "Email Address",
        emailPlaceholder: "Enter Email",
        passwordLabel: "Password",
        passwordPlaceholder: "Password",
        submit: "Submit",
        signUp: "Sign Up",
        //nav bar text
        home: "Home ",
        facilityUpload: "Facility Upload",

    },
    es: {
        //auth page text
        header: "Inicio de sesión del proveedor",
        description: "Verifica que estás con la red PACTS",
        emailLabel: "Dirección de correo electrónico",
        emailPlaceholder: "Ingrese correo electrónico",
        passwordLabel: "Contraseña",
        passwordPlaceholder: "Contraseña",
        submit: "Enviar",
        signUp: "Regístrate",
        //nav bar text
        home: "Casa",
        facilityUpload: "Subida de instalaciones",
    }
});

export default localizationStrings;
