export default function SuccessToast({
  setLoading, setFinished, successToastMessage
}: {
  setLoading: (value: boolean) => void,
  setFinished: (value: boolean) => void,
  successToastMessage: string
}) {
  setLoading(false);
  setFinished(true);

  return (
    <div className="flex flex-col items-centes justify-center gap-2 text-center select-text">
      <p> Sucesso! </p>
      <p> {successToastMessage} </p>
    </div>
  );
}