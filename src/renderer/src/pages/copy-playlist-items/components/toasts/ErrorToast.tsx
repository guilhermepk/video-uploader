export default function ErrorToast({
  errorToastMessage
}: {
  errorToastMessage: string,
}) {
  return (
    <div className="flex flex-col items-centes justify-center gap-2 text-center select-text">
      <p> Erro! </p>
      <p> {errorToastMessage} </p>
    </div>
  );
}