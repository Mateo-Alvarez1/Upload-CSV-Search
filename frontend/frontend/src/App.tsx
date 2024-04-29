import { useState } from "react";
import { uploadFile } from "./services/upload";
import { Toaster, toast } from "sonner";
import { type Data } from "./types";

const APP_STATUS = {
  IDLE: "idle",
  ERROR: "error",
  READY_UPLOAD: "ready_upload",
  UPLOADING: "uploadung",
  READY_USAGE: "ready_usage",
} as const;

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: "Subir Archivo",
  [APP_STATUS.UPLOADING]: "Subiendo",
};

type appStatusType = (typeof APP_STATUS)[keyof typeof APP_STATUS];

function App() {
  const [appStatus, setAppStatus] = useState<appStatusType>(APP_STATUS.IDLE);
  const [Data, setData] = useState<Data>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];

    if (file) {
      setFile(file);
      setAppStatus(APP_STATUS.READY_UPLOAD);
    }

    console.log(file);
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (appStatus !== APP_STATUS.READY_UPLOAD || !file) {
      return;
    }

    setAppStatus(APP_STATUS.UPLOADING);

    const [error, newData] = await uploadFile(file);

    if (error) {
      setAppStatus(APP_STATUS.ERROR);
      toast.error(error.message);
      return;
    }

    setAppStatus(APP_STATUS.READY_USAGE);

    if (newData) setData(newData);
    toast.success("Archivo subido exitosamente");

    console.log(newData);
  };

  const showButton =
    appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING;

  return (
    <>
      {/* <Toaster /> */}
      <h2>Upload CSV + Search</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">
          <input
            disabled={appStatus === APP_STATUS.UPLOADING}
            onChange={handleInputChange}
            type="file"
            name="file"
            accept=".csv"
          />
        </label>
        {showButton && (
          <button disabled={appStatus === APP_STATUS.UPLOADING}>
            {BUTTON_TEXT[appStatus]}
          </button>
        )}
      </form>
    </>
  );
}

export default App;
