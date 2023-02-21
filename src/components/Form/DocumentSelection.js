import { docTypes } from "../../utils/form-helper";

const DocumentSelection = () => {
  return (
    <>
      <select name="document">
        {docTypes.map((doc, index) => {
          return <option key={index}>{doc}</option>;
        })}
      </select>
    </>
  );
};

export default DocumentSelection;
