import { FormFeedback } from "reactstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import type { EditorConfig } from "@ckeditor/ckeditor5-core";
import { DomainQuestionConstants, QuestionCardConstants } from "Components/constants/DomainQuestion";
import { useEffect } from "react";

interface FileLoader {
  file: Promise<File>;
}
interface UploadResponse {
  default: string;
}
interface CustomEditorConfig extends EditorConfig {
  image?: {
    toolbar: string[];
  };
}

class UploadAdapter {
  private readonly loader: FileLoader;
  private reader?: FileReader;

  constructor(loader: FileLoader) {
    this.loader = loader;
  }

  upload(): Promise<UploadResponse> {
    return this.loader.file.then((file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            default: reader.result as string,
          });
        };
        reader.onerror = () => reject(new Error("Upload failed"));
        reader.readAsDataURL(file);
      });
    });
  }

  abort(): void {
    if (this.reader) {
      this.reader.abort();
    }
  }
}

const CkeditorComponent = ({
  formik,
  selectedOption,
  setPersistentFormValues,
  persistentFormValues,
  isEditing,
  children
}: any) => {

  useEffect(() => {
    if (!isEditing) {
      setPersistentFormValues({
        editorData: formik.values.editorData,
        option1: formik.values.option1 ?? persistentFormValues.option1,
        option2: formik.values.option2 ?? persistentFormValues.option2,
        option3: formik.values.option3 ?? persistentFormValues.option3,
        option4: formik.values.option4 ?? persistentFormValues.option4
      });
    }
  }, [selectedOption]);

  function uploadPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: FileLoader
    ) => {
      return new UploadAdapter(loader);
    };
  }

  const editorConfig: CustomEditorConfig = {
    licenseKey: 'GPL',
    extraPlugins: [uploadPlugin],
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "imageUpload",
      "blockQuote",
      "insertTable",
      "undo",
      "redo",
    ],
    image: {
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
      ],
    },
  };

  return (
    <div>
      <p><span className="fw-bold">{QuestionCardConstants.Note} </span>{DomainQuestionConstants.PleaseAddImageLessThen10MB}</p>
      <CKEditor
        editor={ClassicEditor as any}
        data={formik.values.editorData}
        onChange={(_event: any, editor: any) => {
          const data = editor.getData();
          formik.setFieldValue("editorData", data);
        }}
        config={editorConfig as any}
      />
      {formik.touched.editorData && formik.errors.editorData && (
        <FormFeedback className="d-block">
          {formik.errors.editorData}
        </FormFeedback>
      )}
      {children}
    </div>
  );
};

export default CkeditorComponent;
