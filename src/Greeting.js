import React from "react";
import PropTypes from "prop-types";

const PDFViewer = ({ url, searchterm, pagenumber }) => {
  console.log(url, searchterm, pagenumber);
  if (!url) url = "";
  if (!searchterm) searchterm = "";
  if (!pagenumber) pagenumber = "";
  function hasBadCharacter(passageIn) {
    //flagging any unicode character over f000
    const maxUnicode = 0xf000;
    let position = -1;

    for (let i = 0; i < passageIn.length; i++) {
      const code = passageIn.charCodeAt(i);
      if (code > maxUnicode || passageIn[i] === '"') {
        position = i;
        break;
      }
    }

    return position;
  }

  function removeLinebreaks(str) {
    return str.replace(/[\r\n]+/gm, "");
  }

  function stripHtml(html) {
    return html.replace(/<em>/g, "").replace(/<\/em>/g, "");
  }

  function cleanPassage(html) {
    let passageIn = stripHtml(html);
    passageIn = removeLinebreaks(passageIn);
    const re = new RegExp(String.fromCharCode(160), "g"); //nbsp should be replaced by space 160->32
    passageIn = passageIn.replace(re, " ");
    let badPosition = -1;
    do {
      badPosition = hasBadCharacter(passageIn);
      if (badPosition !== -1) {
        const splitPassages = passageIn.split(passageIn[badPosition]);
        let maxSplit = 0;
        let largestSplit = "";
        for (let i = 0; i < splitPassages.length; i++) {
          if (maxSplit < splitPassages[i].length) {
            maxSplit = splitPassages[i].length;
            largestSplit = splitPassages[i];
          }
        }
        passageIn = largestSplit;
      }
    } while (badPosition !== -1);

    return passageIn.trim();
  }

  function encodeQueryResult() {
    const page = pagenumber;
    const zoom = 90;
    const phraseToggle = false;
    const passage = encodeURIComponent(cleanPassage(searchterm));
    const fullSource =
      `/pdfjs-dist/web/viewer.html?url=` +
      url +
      `#page=` +
      page +
      `&zoom=` +
      zoom +
      `&search=` +
      passage +
      `&phrase=` +
      phraseToggle;

    console.log("Sending query to viewer: " + fullSource); // TODO: DELETE

    return fullSource;
  }

  return (
    <div id="viewer" style={{ width: "100%", height: "100%" }}>
      <iframe
        title="unique"
        width="100%"
        height="1000px"
        src={encodeQueryResult()}
      />
    </div>
  );
};

PDFViewer.propTypes = {
  searchterm: PropTypes.string.isRequired,
  pagenumber: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default PDFViewer;
