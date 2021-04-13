import overrides from './css/overrides.css';

const template = document.createElement('template');
template.innerHTML = `
    <style>${overrides.toString()}</style>
    <div class="paper-card">
        <div class="header">
            <div class="title-text"></div>
        </div>
        <div class="card-content">
        </div>
    </div>
`;

let initCalled;

class PaperCard extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // the attributes seem to need an extra moment before they are available
        const handleAttributes = setInterval(() => {
            clearInterval(handleAttributes);

            // Set the title
            const titleContent = template.content.querySelector('.title-text');
            const heading = this.getAttribute('heading');
            !!titleContent && !!heading && (titleContent.innerHTML = heading);

            const cardContents = this.querySelectorAll('.card-content');

            const parent = template.content.querySelector('.card-content')
            !!parent && cardContents.forEach(cardContent => {
                parent.appendChild(cardContent);
            })

            shadowDOM.appendChild(template.content.cloneNode(true));
        }, 50);

        // Bindings
        // this.loadJS = this.loadJS.bind(this);
    }

    // loadJS(hideAskUs, hideMyLibrary) {
    //     // This loads the external JS file into the HTML head dynamically
    //     //Only load js if it has not been loaded before (tracked by the initCalled flag)
    //     // This loads the external JS file into the HTML head dynamically
    //     //Only load js if it has not been loaded before (tracked by the initCalled flag)
    //     if (!initCalled) {
    //         //Dynamically import the JS file and append it to the document header
    //         const script = document.createElement('script');
    //         script.type = 'text/javascript';
    //         script.async = true;
    //         script.onload = function () {
    //             //Code to execute after the library has been downloaded parsed and processed by the browser starts here :)
    //             initCalled = true;
    //         };
    //         //Specify the location of the ITS DS JS file
    //         script.src = 'paper-card.js';
    //
    //         //Append it to the document header
    //         document.head.appendChild(script);
    //     }
    // }

    // connectedCallback() {
    //     this.loadJS();
    // }
}

export default PaperCard;
