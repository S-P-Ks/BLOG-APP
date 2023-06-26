import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

const Editor = ({ placeholder, onChange, content }) => {
  const editor = useRef(null);

  const copyStringToClipboard = function (str) {
    var el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style = { position: "absolute", left: "-9999px" };
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  const facilityMergeFields = [
    "FacilityNumber",
    "FacilityName",
    "Address",
    "MapCategory",
    "Latitude",
    "Longitude",
    "ReceivingPlant",
    "TrunkLine",
    "SiteElevation",
  ];
  const inspectionMergeFields = [
    "InspectionCompleteDate",
    "InspectionEventType",
  ];
  const createOptionGroupElement = (mergeFields, optionGrouplabel) => {
    let optionGroupElement = document.createElement("optgroup");
    optionGroupElement.setAttribute("label", optionGrouplabel);
    for (let index = 0; index < mergeFields.length; index++) {
      let optionElement = document.createElement("option");
      optionElement.setAttribute("class", "merge-field-select-option");
      optionElement.setAttribute("value", mergeFields[index]);
      optionElement.text = mergeFields[index];
      optionGroupElement.appendChild(optionElement);
    }
    return optionGroupElement;
  };
  const buttons = [
    "undo",
    "redo",
    "|",
    "bold",
    "strikethrough",
    "underline",
    "italic",
    "|",
    "superscript",
    "subscript",
    "|",
    "align",
    "|",
    "ul",
    "ol",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "image",
    "link",
    "table",
    "|",
    "hr",
    "eraser",
    "copyformat",
    "|",
    "fullsize",
    "selectall",
    "print",
    "|",
    "source",
    "|",
    {
      name: "insertMergeField",
      tooltip: "Insert Merge Field",
      iconURL: "images/merge.png",
      popup: (editor, current, self, close) => {
        function onSelected(e) {
          let mergeField = e.target.value;
          if (mergeField) {
            console.log(mergeField);
            editor.selection.insertNode(
              editor.create.inside.fromHTML("{{" + mergeField + "}}")
            );
          }
        }
        let divElement = editor.create.div("merge-field-popup");

        let labelElement = document.createElement("label");
        labelElement.setAttribute("class", "merge-field-label");
        labelElement.text = "Merge field: ";
        divElement.appendChild(labelElement);

        let selectElement = document.createElement("select");
        selectElement.setAttribute("class", "merge-field-select");
        selectElement.appendChild(
          createOptionGroupElement(facilityMergeFields, "Facility")
        );
        selectElement.appendChild(
          createOptionGroupElement(inspectionMergeFields, "Inspection")
        );
        selectElement.onchange = onSelected;
        divElement.appendChild(selectElement);

        console.log(divElement);
        return divElement;
      },
    },
    {
      name: "copyContent",
      tooltip: "Copy HTML to Clipboard",
      iconURL: "images/copy.png",
      exec: function (editor) {
        let html = editor.value;
        copyStringToClipboard(html);
      },
    },
  ];

  //   const config2 = {
  //     useSearch: false,
  //     spellcheck: true,
  //     enter: "P",
  //     defaultMode: "1",
  //     toolbarAdaptive: true,
  //     toolbarSticky: true,
  //     showCharsCounter: true,
  //     showWordsCounter: true,
  //     showXPathInStatusbar: false,
  //     askBeforePasteHTML: true,
  //     askBeforePasteFromWord: true,
  //     minHeight: 400,
  //     minWidth: null,
  //     buttons:
  //       "paragraph,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,|,font,fontsize,brush,,link,|,align,undo,redo",
  //     editorCssClass: "alic",
  //     placeHolder: "",
  //     uploader: {
  //       insertImageAsBase64URI: true,
  //     },
  //     controls: {
  //       fontsize: {
  //         list: [
  //           "8",
  //           "9",
  //           "10",
  //           "11",
  //           "12",
  //           "14",
  //           "16",
  //           "18",
  //           "24",
  //           "30",
  //           "36",
  //           "48",
  //           "60",
  //           "72",
  //           "96",
  //           "100",
  //         ],
  //       },
  //       font: {
  //         command: "fontname",
  //         list: {
  //           "": "Default",
  //           "'Open Sans',sans-serif": "Open Sans",
  //           "Helvetica,sans-serif": "Helvetica",
  //           "Arial,Helvetica,sans-serif": "Arial",
  //           "Georgia,serif": "Georgia",
  //           "Impact,Charcoal,sans-serif": "Impact",
  //           "Tahoma,Geneva,sans-serif": "Tahoma",
  //           "'Times New Roman',Times,serif": "Times New Roman",
  //           "Verdana,Geneva,sans-serif": "Verdana",
  //         },
  //       },
  //     },
  //   };

  const editorConfig = {
    readonly: false,
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "medium",
    toolbarAdaptive: false,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
    //defaultActionOnPaste: "insert_clear_html",
    buttons: buttons,
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  const config2 = {
    colors: {
      greyscale: [
        "#000000",
        "#434343",
        "#666666",
        "#999999",
        "#B7B7B7",
        "#CCCCCC",
        "#D9D9D9",
        "#EFEFEF",
        "#F3F3F3",
        "#FFFFFF",
      ],
      palette: [
        "#980000",
        "#FF0000",
        "#FF9900",
        "#FFFF00",
        "#00F0F0",
        "#00FFFF",
        "#4A86E8",
        "#0000FF",
        "#9900FF",
        "#FF00FF",
      ],
      full: [
        "#E6B8AF",
        "#F4CCCC",
        "#FCE5CD",
        "#FFF2CC",
        "#D9EAD3",
        "#D0E0E3",
        "#C9DAF8",
        "#CFE2F3",
        "#D9D2E9",
        "#EAD1DC",
        "#DD7E6B",
        "#EA9999",
        "#F9CB9C",
        "#FFE599",
        "#B6D7A8",
        "#A2C4C9",
        "#A4C2F4",
        "#9FC5E8",
        "#B4A7D6",
        "#D5A6BD",
        "#CC4125",
        "#E06666",
        "#F6B26B",
        "#FFD966",
        "#93C47D",
        "#76A5AF",
        "#6D9EEB",
        "#6FA8DC",
        "#8E7CC3",
        "#C27BA0",
        "#A61C00",
        "#CC0000",
        "#E69138",
        "#F1C232",
        "#6AA84F",
        "#45818E",
        "#3C78D8",
        "#3D85C6",
        "#674EA7",
        "#A64D79",
        "#85200C",
        "#990000",
        "#B45F06",
        "#BF9000",
        "#38761D",
        "#134F5C",
        "#1155CC",
        "#0B5394",
        "#351C75",
        "#733554",
        "#5B0F00",
        "#660000",
        "#783F04",
        "#7F6000",
        "#274E13",
        "#0C343D",
        "#1C4587",
        "#073763",
        "#20124D",
        "#4C1130",
      ],
    },
    useSearch: false,
    spellcheck: false,
    enter: "P",
    defaultMode: "1",
    toolbarAdaptive: false,
    toolbarSticky: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    minHeight: 400,
    minWidth: null,
    buttons:
      "paragraph,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,|,font,fontsize,brush,,link,|,align,undo,redo",
    editorCssClass: "alic",
    placeHolder: "",
    controls: {
      fontsize: {
        list: [
          "8",
          "9",
          "10",
          "11",
          "12",
          "14",
          "16",
          "18",
          "24",
          "30",
          "36",
          "48",
          "60",
          "72",
          "96",
          "100",
        ],
      },
      font: {
        command: "fontname",
        list: {
          "": "Default",
          "'Open Sans',sans-serif": "Open Sans",
          "Helvetica,sans-serif": "Helvetica",
          "Arial,Helvetica,sans-serif": "Arial",
          "Georgia,serif": "Georgia",
          "Impact,Charcoal,sans-serif": "Impact",
          "Tahoma,Geneva,sans-serif": "Tahoma",
          "'Times New Roman',Times,serif": "Times New Roman",
          "Verdana,Geneva,sans-serif": "Verdana",
        },
      },
    },
  };

  //   const config = useMemo(
  //     () => ({
  //       readonly: false, // all options from https://xdsoft.net/jodit/docs/,
  //       placeholder: placeholder || "Start typings...",
  //     }),
  //     [placeholder]
  //   );

  const [cont, setcont] = useState("");

  const edi = useMemo(
    () => (
      <JoditEditor
        ref={editor}
        value={content}
        config={editorConfig}
        tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => onChange(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={async (newContent) => {
          onChange(newContent);
        }}
      />
    ),
    []
  );

  return (
    <div>
      {edi}
      <div onClick={() => console.log(content)}>Print</div>
    </div>
  );
};

export default Editor;
