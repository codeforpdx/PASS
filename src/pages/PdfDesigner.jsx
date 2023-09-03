import { Designer, BLANK_PDF } from '@pdfme/ui';
import { generate } from '@pdfme/generator';
import { useSession } from '@hooks';
import React, { useEffect, useRef } from 'react';
import {
  readFile,
  getTemplateFromJsonFile,
  getTemplate,
  cloneDeep,
  downloadJsonFile
} from '../utils/pdf-designer';
import QueryUI from '../components/QueryEngine/QueryUI';

const PdfDesigner= () => {

  const designerRef = useRef(null);
  const designer = useRef(null);
  const { session } = useSession();

  useEffect(() => {
    const template = {
      basePdf: BLANK_PDF,
      schemas: []
    }
    if (designerRef.current) {
      designer.current = new Designer({
        domContainer: designerRef.current,
        template
      });
    }
    return () => {
      if (designer.current) {
        designer.current.destroy();
      }
    }
  }, [designerRef]);

  const onChangeBasePDF = (e) => {
    if (e.target && e.target.files) {
      readFile(e.target.files[0], "dataURL").then(async (basePdf) => {
        if (designer.current) {
          designer.current.updateTemplate(
            Object.assign(cloneDeep(designer.current.getTemplate()), {
              basePdf,
            })
          );
        }
      });
    }
  };

  const onLoadTemplate = (e) => {
    if (e.target && e.target.files) {
      getTemplateFromJsonFile(e.target.files[0])
        .then((t) => {
          if (designer.current) {
            designer.current.updateTemplate(t);
          }
        })
        .catch((error) => {
          alert(`Invalid template file. ${error}`);
        });
    }
  };

  const onDownloadTemplate = () => {
    if (designer.current) {
      downloadJsonFile(designer.current.getTemplate(), "template");
    }
  };

  const onResetTemplate = () => {
    if (designer.current) {
      designer.current.updateTemplate(getTemplate());
    }
  };

  const onGeneratePDF = async () => {
    if (designer.current) {
      const template = designer.current.getTemplate();
      const inputs = template.sampledata ?? [];
      const pdf = await generate({ template, inputs });
      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob));
    }
  };

  return <div style={{
    display: "flex",
      
  }}>
    <div style={{flexGrow: 1, flexShrink: 1}}>
      <QueryUI
        initialQuery='
  SELECT * WHERE { ?s ?p ?o } LIMIT 100'
        initialQueryUrl={session.info.webId}
      />
    </div>
    <div style={{flexGrow: 3}}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <label style={{ width: 90 }}>
          Change Base
          <input
            type="file"
            accept="application/pdf"
            onChange={onChangeBasePDF}
          />
        </label>
        <label style={{ width: 90}}>
          Load 
          <input
            type="file"
            accept="application/json"
            onChange={onLoadTemplate}
          />
        </label>
        <button type='button' onClick={onDownloadTemplate}>Download Template</button>
        <button type='button' onClick={onResetTemplate}>Reset Template</button>
        <button type='button' onClick={onGeneratePDF}>Generate PDF</button>
      </header>
      <div ref={designerRef}/>
    </div>
    </div>
}

export default PdfDesigner;
