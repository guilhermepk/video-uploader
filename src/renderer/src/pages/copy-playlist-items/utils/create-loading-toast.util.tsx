import toast from "react-hot-toast";
import LoadingToast from "../components/toasts/LoadingToast";
import SuccessToast from "../components/toasts/SuccessToast";
import ErrorToast from "../components/toasts/ErrorToast";


type Params = {
  setStarted: () => void,
  setFinished: () => void,
  callback: (setToastSuccessMessage: (newMessage: string) => void) => Promise<void>
}


export function createLoadingToast({
  setFinished,
  setStarted,
  callback
}: Params) {
  let errorToastMessage: string = '';
  let successToastMessage: string = '';

  function setToastSuccessMessage(newMessage: string): void {
    successToastMessage = newMessage;
  }

  toast.promise(async () => {
    try {
      setStarted();
      await callback(setToastSuccessMessage);
    } catch (error: any) {
      errorToastMessage = error.message ?? String(error);
      setFinished();
      throw error;
    }
  }, {
    loading: <LoadingToast />,
    success: () => <SuccessToast successToastMessage={successToastMessage} />,
    error: () => <ErrorToast errorToastMessage={errorToastMessage} />
  });
}