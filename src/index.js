import React from "react";
import * as ReactDOMClient from "react-dom/client";

import reactToWebComponent from "react-to-webcomponent";

import PDFViewer from "./Greeting";

const MyGreeting = reactToWebComponent(PDFViewer, React, ReactDOMClient);

customElements.define("web-greeting", MyGreeting);
