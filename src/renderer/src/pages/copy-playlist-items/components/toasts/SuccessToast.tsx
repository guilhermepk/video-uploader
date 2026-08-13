export default function SuccessToast({
  successToastMessage
}: {
  successToastMessage: string
}) {
  return (
    <div className="flex flex-col items-centes justify-center gap-2 text-center select-text">
      <p> Sucesso! </p>
      <p> {successToastMessage} </p>
    </div>
  );
}