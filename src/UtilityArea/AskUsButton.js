import askus from './css/askus.css';
import ApiAccess from '../ApiAccess/ApiAccess';
import { isBackTabKeyPressed, isEscapeKeyPressed, isTabKeyPressed } from '../helpers/keyDetection';

/**
 * API
 * <span slot="site-utilities">             -- tells uqsiteheader where to insert it in the dom
 *  <askus-button
 *      nopaneopacity                       -- primo: dont put a background on it
 *  />
 * </span>
 *
 */

const template = document.createElement('template');
template.innerHTML = `
    <style>${askus.toString()}</style>
    <div id="askus">
        <!-- Button -->
        <button id="askus-button" data-analyticsid="askus-button" aria-label="AskUs contact options" part="button" title="AskUs contact options">
            <svg id="askus-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
            </svg>
            <div id="askus-label" part="label">AskUs</div>
        </button>
        <!-- Menu -->
        <div id="askus-menu" data-testid="askus-menu" data-analyticsid="askus-menu" class="closed-menu" style="display: none">
            <div style="text-align: center; padding-top: 0.5em; color: #595959; font-size: 0.9em;">All links open in a new window</div>
            <ul class="askus-menu-list" role="menu" >
                <!-- FAQ -->
                <li id="askus-faq-li" role="menuitem" aria-disabled="false">
                    <a tabindex="0" href="https://support.my.uq.edu.au/app/library/faqs" rel="noreferrer" data-analyticsid="askus-menu-faq" target="_blank">
                        <svg class="askusListItem MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .65.73.45.75.45C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.41.21.75-.19.75-.45V6c-1.49-1.12-3.63-1.5-5.5-1.5zm3.5 14c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"></path></svg>
                        <span>FAQ</span>
                    </a>
                </li>
                
                <!-- Email -->
                <li role="menuitem" aria-disabled="false">
                    <a tabindex="0" href="mailto:askus@library.uq.edu.au" data-analyticsid="askus-menu-email" target="_blank">
                        <svg class="askusListItem MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>
                        <span>Email</span>
                    </a>
                </li>
                
                <!-- Contact form -->
                <li role="menuitem" aria-disabled="false">
                    <a tabindex="0" href="https://support.my.uq.edu.au/app/library/contact" rel="noreferrer" data-analyticsid="askus-menu-contactform" target="_blank">
                        <svg class="askusListItem MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path></svg>
                        <span>Contact form</span>
                    </a>
                </li>
                
                <!-- CRM Chat -->
                <li id="askus-chat-li" role="menuitem" aria-disabled="false">
                    <span class="chatClosedTimes" tabindex="0" id="askus-chat-closed" data-testid="askus-chat-link" data-analyticsid="askus-menu-chat" onclick="javascript: window.open('https://support.my.uq.edu.au/app/chat/chat_launch_lib/p/45', 'chat', 'toolbar=no, location=no, status=no, width=400, height=400');">
                        <svg class="serviceWithHoursClosed askusListItem MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"></path></svg>
                        <span class="serviceWithHours">Chat with staff</span>
                        <div class="closedLabel" style="display: none"><span id="askus-chat-closed-text" data-testid="askus-chat-closed">Closed</span></div>
                    </span>
                    <a class="chatOpenTimes" style="display: none" tabindex="0" id="askus-chat-link" data-testid="askus-chat-link" data-analyticsid="askus-menu-chat" onclick="javascript: window.open('https://support.my.uq.edu.au/app/chat/chat_launch_lib/p/45', 'chat', 'toolbar=no, location=no, status=no, width=400, height=400');">
                        <svg class="serviceWithHours askusListItem MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"></path></svg>
                        <span class="serviceWithHours">Chat with staff</span>
                        <span class="chatTimes"><span id="askus-chat-time" data-testid="askus-chat-time"></span></span>
                    </a>
                </li>
                
                <!-- AIBot Chat -->
                <!-- IF PAGE HAS A PROACTIVE CHAT!!!!!! -->
                <li id="askus-aibot-li" class="askus-aibot-li" role="menuitem" aria-disabled="false">
                    <a tabindex="0" id="askus-aibot-button" data-testid="askus-aibot-button" data-analyticsid="askus-menu-aibot">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" version="1.1"
                             id="Technology-Robot-Head-6--Streamline-Ultimate">
                            <path
                                d="M11.696280000000002 0.26556C10.441728 0.38124 9.374808 1.296192 9.039384 2.544C8.945952 2.891616 8.923295999999999 3.453096 8.987784 3.8229599999999997C9.153384 4.7724720000000005 9.750143999999999 5.584272 10.602216 6.019056C10.859424 6.150312 11.11572 6.244032000000001 11.346 6.291L11.496 6.321599999999999 11.496 7.372104L11.496 8.422583999999999 8.058 8.430384C4.865424 8.437631999999999 4.607352000000001 8.441208 4.442880000000001 8.480736C3.944088 8.600568 3.6412080000000002 8.766792 3.3000000000000003 9.108C2.962968 9.445032000000001 2.763528 9.805512 2.6426640000000003 10.296C2.5620960000000004 10.622952 2.544864 10.899288 2.544408 11.871432C2.5440240000000003 12.720816 2.540976 12.78804 2.5020000000000002 12.803256000000001C2.478912 12.812256000000001 1.9956000000000003 12.98184 1.428 13.180104000000002C0.8604 13.378368 0.3582 13.556328 0.312 13.575552C0.198696 13.622760000000001 0.09921600000000001 13.719959999999999 0.045503999999999996 13.836C0.003288 13.927152 0.001032 14.040456 0.0005279999999999999 16.081296L0 18.230567999999998 0.06295200000000001 18.356904C0.102192 18.435648 0.158688 18.50424 0.21295199999999997 18.539016C0.260832 18.569712000000003 0.804912 18.770448 1.422 18.985104000000003L2.544 19.375416 2.544384 20.301696C2.5448160000000004 21.325296 2.5639440000000002 21.659952 2.63928 21.961632C2.705568 22.227144 2.9179440000000003 22.649184 3.0913440000000003 22.86C3.347832 23.171832000000002 3.799704 23.462664 4.243896 23.601792C4.702584 23.74548 4.2023280000000005 23.736816 12.026064 23.736792C16.84284 23.736792 19.251383999999998 23.728632 19.370616000000002 23.711904C20.424288 23.564136 21.138624 22.869024 21.386976 21.749856C21.43476 21.534432000000002 21.439704000000003 21.431592 21.44952 20.445144L21.460176 19.374288 22.580088 18.98424C23.196048 18.769704 23.739743999999998 18.567552000000003 23.78832 18.535008C23.844288 18.497472 23.903592 18.423096 23.950319999999998 18.331848L24.024 18.187872 24.024 16.04052C24.024 14.786015999999998 24.015096 13.898688 24.002568 13.906416C23.99076 13.913712000000002 23.974296 13.892472 23.965944 13.859231999999999C23.939256 13.752863999999999 23.790408000000003 13.61388 23.644128000000002 13.558704C23.569272 13.53048 23.0652 13.352736000000002 22.524 13.16376C21.9828 12.97476 21.521088 12.81264 21.498 12.803496C21.459 12.788064 21.456 12.719784 21.455976 11.847432C21.455952 10.836648 21.435072 10.489128000000001 21.356208 10.188C21.155016 9.419664 20.600304 8.847648 19.8 8.583216C19.299288 8.417760000000001 19.455912 8.424 15.799776 8.424L12.504 8.424 12.504 7.3728L12.504 6.321599999999999 12.654 6.291C12.88428 6.244032000000001 13.140576000000001 6.150312 13.397784 6.019056C14.146464000000002 5.637024 14.700648000000001 4.963655999999999 14.936664 4.149216C15.030072 3.8268720000000003 15.055800000000001 3.5892239999999997 15.041208 3.1834320000000003C15.017112 2.51316 14.834015999999998 1.996704 14.43012 1.459656C13.797168 0.6180720000000001 12.764567999999999 0.16704 11.696280000000002 0.26556M11.713464 1.2725760000000002C10.872744 1.3895760000000001 10.165344 2.046888 9.996576000000001 2.8679520000000003C9.951864 3.0855119999999996 9.945264000000002 3.4973520000000002 9.983304 3.696C10.105632 4.334544 10.548 4.897296 11.1438 5.172264C11.444376 5.310984 11.58516 5.338272 12 5.338272C12.41484 5.338272 12.555624 5.310984 12.8562 5.172264C13.452072000000001 4.897248 13.895928 4.33248 14.016383999999999 3.696C14.053992 3.49728 14.04732 3.081528 14.003064 2.8662C13.8786 2.2607280000000003 13.436784 1.7101199999999999 12.85812 1.439352C12.545592 1.293096 12.067008 1.223376 11.713464 1.2725760000000002M4.668 9.469608000000001C4.5756000000000006 9.4878 4.41168 9.546312 4.303752 9.59964C3.972144 9.763463999999999 3.7423200000000003 10.075128000000001 3.621072 10.525392C3.5783280000000004 10.68408 3.5692559999999998 10.788336000000001 3.5668800000000003 11.148L3.564 11.58 12.009432 11.586024L20.454864 11.592072 20.441352 11.106024C20.421792 10.404024 20.347008000000002 10.169568000000002 20.047392 9.871152C19.857864 9.682392 19.581912 9.543624000000001 19.266648 9.478584C19.05012 9.433896 18.848664 9.432672 11.94 9.434568C6.00588 9.436200000000001 4.808328 9.44196 4.668 9.469608000000001M3.55824 17.07C3.564744 21.346752 3.566976 21.546744 3.609744 21.696C3.736392 22.138008000000003 3.9909359999999996 22.421400000000002 4.416672 22.594392C4.73736 22.724712 4.811376 22.729728 6.3086400000000005 22.722576L7.6852800000000006 22.716 8.27868 21.381263999999998C8.605032 20.647152000000002 8.895168 20.009112 8.923416000000001 19.963392C8.951903999999999 19.917336000000002 9.027312 19.851696 9.092640000000001 19.816152L9.210504 19.752 12 19.752L14.789496000000002 19.752 14.90736 19.816152C14.972688 19.851696 15.048096000000001 19.917336000000002 15.076584 19.963392C15.104832000000002 20.009112 15.394968 20.647152000000002 15.721319999999999 21.381263999999998L16.31472 22.716 17.745984 22.722192C19.344816 22.729104000000003 19.387584 22.725792000000002 19.694136 22.571160000000003C20.072304 22.380432000000003 20.339232 21.963216 20.42304 21.432000000000002C20.439168 21.329688 20.447688 19.78296 20.447808 16.938L20.448 12.6 11.999712 12.6L3.551424 12.6 3.55824 17.07M7.472016 13.619544C6.809472 13.73976 6.197928 14.142552 5.824896000000001 14.704392C5.2980719999999994 15.497928 5.275536 16.551456 5.768016 17.364168C6.147264000000001 17.990016 6.7462800000000005 18.407856000000002 7.456175999999999 18.541704C7.771896 18.601248000000002 8.288688 18.579096 8.58 18.493536C10.0968 18.048023999999998 10.838952 16.394088 10.152984 14.988C9.855144 14.377512 9.347616 13.932 8.694528 13.707744C8.350224 13.589544 7.8402 13.552728 7.472016 13.619544M15.651 13.620384C15.021624 13.73436 14.458224000000001 14.087544 14.062872 14.616C13.916832000000001 14.811192000000002 13.736664 15.196584000000001 13.664280000000002 15.468552C13.60836 15.678696 13.600560000000002 15.753552 13.600560000000002 16.080000000000002C13.600560000000002 16.4034 13.608623999999999 16.482216 13.662192000000001 16.683216C13.900488000000001 17.577192 14.542944 18.239064 15.42 18.49416C15.711936 18.579048 16.229592 18.60096 16.543824 18.541704C17.25372 18.407856000000002 17.852736 17.990016 18.231984 17.364168C18.724464 16.551456 18.701928 15.497928 18.175104 14.704392C17.627736000000002 13.879968 16.616304 13.445592 15.651 13.620384M1.752 14.133192000000001L1.02 14.391504 1.013832 16.082064L1.0076880000000001 17.7726 1.433832 17.920632C1.6682400000000002 18.00204 2.013888 18.122808 2.202 18.189L2.544 18.30936 2.544 16.090680000000003C2.544 14.330952000000002 2.5377840000000003 13.872288 2.5140000000000002 13.873439999999999C2.497512 13.874256 2.1546000000000003 13.991136000000001 1.752 14.133192000000001M21.456 16.090680000000003L21.456 18.30936 21.798000000000002 18.189C21.986088 18.122808 22.33176 18.00204 22.566167999999998 17.920632L22.992312000000002 17.7726 22.986168 16.082064L22.98 14.391504 22.248 14.133192000000001C21.8454 13.991136000000001 21.502512 13.874256 21.486 13.873439999999999C21.462216 13.872288 21.456 14.330952000000002 21.456 16.090680000000003M0.011496 16.080000000000002C0.011496 17.2746 0.014424 17.763312000000003 0.018000000000000002 17.166C0.021576 16.568712 0.021576 15.591312 0.018000000000000002 14.994C0.014424 14.396712 0.011496 14.8854 0.011496 16.080000000000002M7.514784 14.641056C7.028544 14.768400000000002 6.61524 15.179256000000002 6.465624 15.684000000000001C6.435984 15.783959999999999 6.4229519999999996 15.908712000000001 6.423 16.092C6.4230719999999994 16.32348 6.431952 16.381248 6.494976 16.561056C6.584856000000001 16.817424 6.704832 16.999872 6.902880000000001 17.181336C7.193808000000001 17.447928 7.505952 17.568 7.908 17.568C8.348976 17.568 8.638128 17.448672000000002 8.954544 17.136048C9.113592 16.978920000000002 9.181272 16.8906 9.248856000000002 16.752C9.459071999999999 16.320864 9.458352 15.830832000000001 9.246912 15.408C9.133488 15.181176 8.84136 14.87988 8.623536000000001 14.765064C8.301528 14.59536 7.872504 14.54736 7.514784 14.641056M15.700848 14.639088C15.43296 14.711471999999999 15.251976 14.819351999999999 15.035544 15.035664C14.659896 15.411072 14.518991999999999 15.884304 14.628096000000001 16.404C14.688024 16.689384 14.810112 16.903560000000002 15.045456 17.136048C15.361872 17.448672000000002 15.651024 17.568 16.092 17.568C16.529016 17.568 16.833096 17.440344 17.148192 17.1246C17.4516 16.820567999999998 17.576808 16.515408 17.576808 16.080000000000002C17.576808 15.791640000000001 17.537136 15.626807999999999 17.408736 15.381552000000001C17.241816 15.062736000000001 16.896216 14.767895999999999 16.564944 14.661672000000001C16.330056 14.586383999999999 15.934248 14.57604 15.700848 14.639088M9.223896 21.738L8.789736 22.716 10.39488 22.722168C11.277696 22.725552 12.722304000000001 22.725552 13.60512 22.722168L15.210263999999999 22.716 14.776104000000002 21.738L14.341920000000002 20.76 12 20.76L9.65808 20.76 9.223896 21.738"
                                stroke="none" fill="currentColor" fill-rule="evenodd"></path>
                        </svg>                    
                        <span>Chatbot</span>
<!--                        <span class="aibotTimes"><span id="askus-aibot-time" data-testid="askus-aibot-time"></span></span>-->
                    </a>
                </li>

                <!-- Phone -->
                <li id="askus-phone-li" role="menuitem" aria-disabled="false">
                    <span class="chatClosedTimes" id="askus-phone-closed" data-testid="askus-menu-phone" data-analyticsid="askus-menu-phone">
                        <svg class="serviceWithHoursClosed askusListItem MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></svg>
                        <span class="serviceWithHours">Phone</span>
                        <div class="closedLabel" style="display: none"><span id="askus-phone-closed-text" data-testid="askus-phone-closed">Closed</span></div>
                    </span>
                    <a class="chatOpenTimes" style="display: none" tabindex="0" id="askus-phone-link" href="https://web.library.uq.edu.au/contact-us" rel="noreferrer" data-testid="askus-menu-phone" data-analyticsid="askus-menu-phone" target="_blank">
                        <svg class="serviceWithHours askusListItem MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></svg>
                        <span class="serviceWithHours">Phone</span>
                        <span class="chatTimes"><span id="askus-phone-time" data-testid="askus-phone-time"></span></span>
                    </a>
                </li>
            </ul>
            <!-- More ways -->
            <p id="askus-contact-moreways" class="moreWays">
                <a tabindex="0" href="https://web.library.uq.edu.au/contact-us" rel="noreferrer" data-analyticsid="askus-menu-moreways" target="_blank">
                    <span>More ways to contact us</span>
                </a>
            </p>
            
        </div>
    </div>
    <!-- Screen wrapper -->
    <div id="askus-pane" data-testid="askus-pane" aria-hidden="true" class=closed-pane style="display: none" />
`;

class AskUsButton extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        if (this.isPaneButtonOpacityDropRequested()) {
            // primo needs the opacity on the background turned off because it interacts weirdly with the Primo styles
            // add a class to the pane, and turn off the background colour on that class
            const pane = template.content.getElementById('askus-pane');
            !!pane && pane.classList.add('noOpacity');
        }

        // // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));
        this.updateAskusDOM(shadowDOM);
        this.addButtonListeners(shadowDOM);

        // Bindings
        this.updateAskusDOM = this.updateAskusDOM.bind(this);
        this.addButtonListeners = this.addButtonListeners.bind(this);
        this.isPaneButtonOpacityDropRequested = this.isPaneButtonOpacityDropRequested.bind(this);
    }

    async updateAskusDOM(shadowRoot) {
        // if proactive chat doesnt exist on the current page, dont provide a chatbot link
        const proactiveChatElement = document.getElementsByTagName('proactive-chat');
        console.log('### proactiveChatElement=', proactiveChatElement);
        const aibotLink = shadowRoot.getElementById('askus-aibot-li');
        console.log('### aibotLink=', aibotLink);
        if (!proactiveChatElement || proactiveChatElement.length === 0) {
            !!aibotLink && aibotLink.remove();
        } else {
            console.log('proacttive chat is present');
        }

        const api = new ApiAccess();
        await api.loadChatStatus().then((isOnline) => {
            if (!!isOnline) {
                // hide .chatClosedTimes
                const chatClosedTimes = shadowRoot.querySelectorAll('.chatClosedTimes');
                !!chatClosedTimes && chatClosedTimes.forEach((c) => (c.style.display = 'none'));

                // remove display none from .chatOpenTimes
                const chatOpenTimes = shadowRoot.querySelectorAll('.chatOpenTimes');
                !!chatOpenTimes && chatOpenTimes.forEach((s) => (s.style.display = ''));

                // adding times to .chatOpenTimes is done from loadOpeningHours
            } else {
                // Chat is closed for the day

                // remove display none from 'closed' div
                const closedLabels = shadowRoot.querySelectorAll('.closedLabel');
                !!closedLabels && closedLabels.forEach((s) => (s.style.display = ''));

                // make icons red
                const icons = shadowRoot.querySelectorAll('svg.serviceWithHoursClosed');
                !!icons && icons.forEach((l) => (l.style.fill = '#c40000'));
            }
        });

        await api.loadOpeningHours().then((hours) => {
            // display opening hours in the askus widget
            const chatitem = shadowRoot.getElementById('askus-chat-time');
            !!hours && !!hours.chat && !!chatitem && (chatitem.innerHTML = `${hours.chat} today`);

            const phoneitem = shadowRoot.getElementById('askus-phone-time');
            !!hours && !!hours.phone && !!phoneitem && (phoneitem.innerText = `${hours.phone} today`);
        });
    }

    addButtonListeners(shadowDOM, isOnline) {
        let askUsClosed = true;
        function openAskusMenu() {
            askUsClosed = false;
            const askusMenu = shadowDOM.getElementById('askus-menu');
            !!askusMenu && (askusMenu.style.display = 'block');
            const askusPane = shadowDOM.getElementById('askus-pane');
            !!askusPane && (askusPane.style.display = 'block');

            function showDisplay() {
                !!askusMenu && askusMenu.classList.remove('closed-menu');
                !!askusPane && askusPane.classList.remove('closed-pane');
            }

            setTimeout(showDisplay, 100);
            document.onkeydown = function (e) {
                const evt = e || /* istanbul ignore next */ window.event;
                if (isEscapeKeyPressed(evt) && askUsClosed === false) {
                    closeAskusMenu();
                }
            };
        }

        function closeAskusMenu() {
            askUsClosed = true;
            const askusMenu = shadowDOM.getElementById('askus-menu');
            const askusPane = shadowDOM.getElementById('askus-pane');

            !!askusMenu && askusMenu.classList.add('closed-menu');
            !!askusPane && askusPane.classList.add('closed-pane');

            function hideDisplay() {
                !!askusMenu && (askusMenu.style.display = 'none');
                !!askusPane && (askusPane.style.display = 'none');
            }

            setTimeout(hideDisplay, 500);
        }

        function handleAskUsButton() {
            const askusPane = shadowDOM.getElementById('askus-pane');
            !!askusPane && askusPane.addEventListener('click', handleMouseOut);
            openAskusMenu();
        }

        function handleMouseOut() {
            const askusPane = shadowDOM.getElementById('askus-pane');

            askUsClosed = !askUsClosed;
            !!askusPane && askusPane.removeEventListener('mouseleave', handleMouseOut);
            closeAskusMenu();
        }

        // Attach a listener to the askus button
        const askusButton = shadowDOM.getElementById('askus-button');
        !!askusButton && askusButton.addEventListener('click', handleAskUsButton);

        function openProactiveChatBotIframe() {
            const proactiveChatElement = document.getElementsByTagName('proactive-chat');
            console.log('proactiveChatElement =', proactiveChatElement);
            !!proactiveChatElement &&
                proactiveChatElement.length > 0 &&
                proactiveChatElement[0].setAttribute('showchatbot', 'true');

            closeAskusMenu();
        }

        // Attach a listener to the chatbot button
        const chatbotButton = shadowDOM.getElementById('askus-aibot-button');
        !!chatbotButton && chatbotButton.addEventListener('click', openProactiveChatBotIframe);

        // Chat status
        function openChat() {
            window.open(
                'https://support.my.uq.edu.au/app/chat/chat_launch_lib/p/45',
                'chat',
                'toolbar=no, location=no, status=no, width=400, height=400',
            );
        }
        /* istanbul ignore next */
        shadowDOM.getElementById('askus-faq-li').addEventListener('keydown', function (e) {
            if (isBackTabKeyPressed(e)) {
                closeAskusMenu();
            }
        });
        /* istanbul ignore next */
        shadowDOM.getElementById('askus-contact-moreways').addEventListener('keydown', function (e) {
            if (isTabKeyPressed(e)) {
                closeAskusMenu();
            }
        });
    }

    isPaneButtonOpacityDropRequested() {
        // primo only provides the attributes in lower case :(
        const noPaneOpacity = this.getAttribute('nopaneopacity');
        return !!noPaneOpacity || noPaneOpacity === '';
    }
}

export default AskUsButton;
