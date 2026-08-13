import toast from "react-hot-toast";
import LoadingToast from "../components/toasts/LoadingToast";
import SuccessToast from "../components/toasts/SuccessToast";
import ErrorToast from "../components/toasts/ErrorToast";


type Params = {
  setLoading: (value: boolean) => void,
  setFinished: (value: boolean) => void,
  callback: (setToastSuccessMessage: (newMessage: string) => void) => Promise<void>
}


export function createLoadingToast({
  setLoading,
  setFinished,
  callback
}: Params) {
  let errorToastMessage: string = '';
  let successToastMessage: string = '';

  function setToastSuccessMessage(newMessage: string): void {
    successToastMessage = newMessage;
  }

  toast.promise(async () => {
    try {
      setLoading(true);

      await callback(setToastSuccessMessage);
    } catch (error: any) {
      errorToastMessage = error.message ?? String(error);
      throw error;
    }
  }, {
    loading: <LoadingToast />,
    success: () => <SuccessToast setFinished={setFinished} setLoading={setLoading} successToastMessage={successToastMessage} />,
    error: () => <ErrorToast errorToastMessage={errorToastMessage} setLoading={setLoading} />
  });
}