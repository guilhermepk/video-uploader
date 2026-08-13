export default function ErrorToast({
  setLoading, errorToastMessage
}: {
  setLoading: (value: boolean) => void,
  errorToastMessage: string,
}) {
  setLoading(false);

  return (
    <div className="flex flex-col items-centes justify-center gap-2 text-center select-text">
      <p> Erro! </p>
      <p> {errorToastMessage} </p>
    </div>
  );
}