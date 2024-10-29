/*
   about tailwind
   can define a color in tailwind.cofig.js and use it anywhere in the project :-
   extend: {
      // add color
      colors: {
        primary: "#2B85FF",
        secondary: "#EF863E",
      },
    },

    can apply a basic css all over the project by this in index.css:-
    @layer base {
    html {
        font-family: "Poppins", serif;
    }
    body {
        background-color: #fdfeff;
        overflow-x: hidden;
    }
}
    can make custum css classes by this in index.css
    @layer components {
    .input-box{
        @apply w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none;
    }
    .btn-primary{
        @apply w-full text-sm bg-primary text-white p-2 rounded my-1 hover:bg-blue-600
    }
    .icon-btn{
        @apply text-xl text-slate-300 cursor-pointer hover:text-primary
    }
    .input-label{
        @apply text-xs text-slate-400
    }
}
    email validation:- 
    export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

    app.use(express.json());
    app.use(express.json()); is a middleware function in Express.js that parses incoming requests with JSON payloads and makes the parsed data available in req.body.

    cors
    CORS, or Cross-Origin Resource Sharing, is a security feature built into web browsers that restricts web pages from making requests to a different domain than the one that served the web page.
    To access different domains
    app.use(
    cors({
        origin: "*"   --> we can access any domains
    })
);
*/